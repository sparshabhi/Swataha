import React, { useState, useEffect } from 'react';
import { CeqhsLayout } from './CeqhsLayout';
import { CeqhsLauncher } from './CeqhsLauncher';
import { CeqhsWorkspaceChooser } from './CeqhsWorkspaceChooser';
import { CeqhsSurveys } from './CeqhsSurveys';
import { CeqhsProgrammeStudio } from './CeqhsProgrammeStudio';
import { CeqhsApplicationsDashboard } from './CeqhsApplicationsDashboard';
import { CeqhsCardsAppModal } from './CeqhsCardsAppModal';
import { CeqhsKnowledgeBaseModal } from './CeqhsKnowledgeBaseModal';
import { CeqhsOverview } from './CeqhsOverview';
import { CeqhsPartnerSchools } from './CeqhsPartnerSchools';
import { CeqhsSchoolWorkspace } from './CeqhsSchoolWorkspace';
import { CeqhsDossierReview } from './CeqhsDossierReview';
import { CeqhsMilestones } from './CeqhsMilestones';
import { CeqhsTraining } from './CeqhsTraining';
import { CeqhsReports } from './CeqhsReports';
import { CeqhsFollowUp } from './CeqhsFollowUp';
import { CeqhsTeam } from './CeqhsTeam';
import { CeqhsSettings } from './CeqhsSettings';
import { CeqhsApprovalsHub } from './CeqhsApprovalsHub';
import { CeqhsAddSchoolWizard } from './CeqhsAddSchoolWizard';
import { CeqhsCurriculumStudio } from './CeqhsCurriculumStudio';
import { CeqhsFreshResetModal } from './CeqhsFreshResetModal';
import { CeqhsLivingDashboard } from './CeqhsLivingDashboard';
import { CeqhsSchoolProfileView } from './CeqhsSchoolProfileView';
import { CeqhsNeedsBaselineView } from './CeqhsNeedsBaselineView';
import { CeqhsPlanComposerView } from './CeqhsPlanComposerView';
import { CeqhsCurriculumIntegrationView } from './CeqhsCurriculumIntegrationView';
import { CeqhsActivityLibraryView } from './CeqhsActivityLibraryView';
import { CeqhsAdultDevelopmentView } from './CeqhsAdultDevelopmentView';
import { CeqhsEvidenceImpactView } from './CeqhsEvidenceImpactView';
import { CeqhsAwardProgressView } from './CeqhsAwardProgressView';
import { CeqhsAdministrationView } from './CeqhsAdministrationView';
import { ImpactEvidenceSection } from './impact/ImpactEvidenceSection';
import {
  SEED_CEQHS_STAFF,
  SEED_PARTNER_SCHOOLS,
  SEED_DOSSIER_ITEMS,
  SEED_MILESTONES,
  SEED_TRAINING_COHORTS,
  SEED_SUPPORT_CASES,
  SEED_PRIORITY_QUEUE,
  SEED_RECENT_ACTIVITY,
  SEED_AUDIT_LOGS,
} from '../../data/ceqhsUserData';
import {
  FOUNDER_SUPER_ADMIN,
  SEED_APPROVAL_REQUESTS,
  SEED_PILOT_SCHOOLS,
} from '../../data/ceqhsBaselineState';
import {
  INITIAL_CURRICULUM_MAPPINGS,
  OFFICIAL_CURRICULUM_FRAMEWORKS,
} from '../../data/ceqhsCurriculumBaseline';
import {
  ApprovalRequest,
  CurriculumAlignmentMapping,
  PilotSchoolTenant,
  EnvironmentResetRecord,
  MappingStatus,
  ApprovalDecision,
  ApprovalState,
} from '../../types/ceqhsGovernance';
import { clearAllFirestoreData } from '../../lib/firestoreService';
import {
  CEQHSStaffUser,
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  TrainingCohort,
  SupportCaseItem,
  PriorityQueueItem,
  RecentActivityItem,
  AuditEventItem,
  CEQHSUserRole,
} from '../../types/ceqhsUser';

interface CeqhsUserPortalProps {
  onSignOut: () => void;
  onSwitchToSchoolAdmin?: (tenantId: string) => void;
}

export const CeqhsUserPortal: React.FC<CeqhsUserPortalProps> = ({
  onSignOut,
  onSwitchToSchoolAdmin,
}) => {
  // Staff state with Founder Saugat Singh as the designated Super Admin
  const [staff, setStaff] = useState<CEQHSStaffUser[]>(() => {
    const founderStaffMember: CEQHSStaffUser = {
      id: FOUNDER_SUPER_ADMIN.id,
      name: FOUNDER_SUPER_ADMIN.name,
      email: FOUNDER_SUPER_ADMIN.email,
      role: 'platform_admin',
      title: FOUNDER_SUPER_ADMIN.title,
      avatarInitials: 'SS',
      assignedSchoolIds: ['sch-oakridge', 'sch-greenwood', 'sch-stmarys', 'sch-delhi-world'],
      assignedCount: 4,
      isActive: true,
      lastSignIn: 'Just now',
      phone: '+44 20 7946 0912',
      joinedDate: '2024-01-10',
    };

    const saved = localStorage.getItem('ceqhs_staff_users');
    if (saved) {
      try {
        const parsed: CEQHSStaffUser[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Replace any legacy placeholder Aris with Saugat Singh
          const sanitized = parsed.map((s) => {
            if (s.name.includes('Aris') || s.email.includes('aris')) {
              return { ...s, name: 'Saugat Singh', email: 'saugat.swataha@gmail.com', avatarInitials: 'SS', title: 'Founder & Lead Program Architect' };
            }
            return s;
          });
          // Ensure founder is first
          const others = sanitized.filter((s) => s.name !== 'Saugat Singh' && s.email !== 'saugat.swataha@gmail.com');
          return [founderStaffMember, ...others];
        }
      } catch (e) {
        console.error('Error loading staff', e);
      }
    }
    const otherStaff = SEED_CEQHS_STAFF.filter((s) => s.id !== founderStaffMember.id && !s.name.includes('Aris'));
    return [founderStaffMember, ...otherStaff];
  });

  // Current user defaults to Founder Saugat Singh (Super Admin)
  const [currentStaffUser, setCurrentStaffUser] = useState<CEQHSStaffUser>(() => {
    return staff.find((s) => s.name === 'Saugat Singh' || s.email === 'saugat.swataha@gmail.com') || staff[0];
  });

  // Governance: Approvals Hub state
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(() => {
    const saved = localStorage.getItem('ceqhs_approval_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading approval requests', e);
      }
    }
    return SEED_APPROVAL_REQUESTS;
  });

  // Governance: Curriculum alignment mappings state
  const [curriculumMappings, setCurriculumMappings] = useState<CurriculumAlignmentMapping[]>(() => {
    const saved = localStorage.getItem('ceqhs_curriculum_mappings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading curriculum mappings', e);
      }
    }
    return INITIAL_CURRICULUM_MAPPINGS;
  });

  // Schools & pilot tenants
  const [schools, setSchools] = useState<CEQHSPartnerSchool[]>(() => {
    const saved = localStorage.getItem('ceqhs_partner_schools');
    return saved ? JSON.parse(saved) : SEED_PARTNER_SCHOOLS;
  });

  const [dossierItems, setDossierItems] = useState<DossierItemEvidence[]>(() => {
    const saved = localStorage.getItem('ceqhs_dossier_items');
    return saved ? JSON.parse(saved) : SEED_DOSSIER_ITEMS;
  });

  const [milestones, setMilestones] = useState<MilestoneItem[]>(() => {
    const saved = localStorage.getItem('ceqhs_milestones');
    return saved ? JSON.parse(saved) : SEED_MILESTONES;
  });

  const [cohorts, setCohorts] = useState<TrainingCohort[]>(() => {
    const saved = localStorage.getItem('ceqhs_training_cohorts');
    return saved ? JSON.parse(saved) : SEED_TRAINING_COHORTS;
  });

  const [supportCases, setSupportCases] = useState<SupportCaseItem[]>(() => {
    const saved = localStorage.getItem('ceqhs_support_cases');
    return saved ? JSON.parse(saved) : SEED_SUPPORT_CASES;
  });

  const [priorityQueue, setPriorityQueue] = useState<PriorityQueueItem[]>(SEED_PRIORITY_QUEUE);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(SEED_RECENT_ACTIVITY);

  const [auditLogs, setAuditLogs] = useState<AuditEventItem[]>(() => {
    const saved = localStorage.getItem('ceqhs_audit_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          return parsed.filter((log: AuditEventItem) => {
            if (!log?.id || seen.has(log.id)) return false;
            seen.add(log.id);
            return true;
          });
        }
      } catch (e) {
        console.error('Failed to parse audit logs from storage', e);
      }
    }
    return SEED_AUDIT_LOGS;
  });

  // Routing state
  const [activeRoute, setActiveRoute] = useState<string>('workspaces');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || '');
  const [routeFilterParam, setRouteFilterParam] = useState<string | undefined>(undefined);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [isCardsAppOpen, setIsCardsAppOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [isFreshResetModalOpen, setIsFreshResetModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ceqhs_staff_users', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('ceqhs_approval_requests', JSON.stringify(approvalRequests));
  }, [approvalRequests]);

  useEffect(() => {
    localStorage.setItem('ceqhs_curriculum_mappings', JSON.stringify(curriculumMappings));
  }, [curriculumMappings]);

  useEffect(() => {
    localStorage.setItem('ceqhs_partner_schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem('ceqhs_dossier_items', JSON.stringify(dossierItems));
  }, [dossierItems]);

  useEffect(() => {
    localStorage.setItem('ceqhs_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('ceqhs_support_cases', JSON.stringify(supportCases));
  }, [supportCases]);

  useEffect(() => {
    localStorage.setItem('ceqhs_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAuditEvent = (
    actionType: string,
    details: string,
    schoolId?: string,
    schoolName?: string
  ) => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 6);
    const newLog: AuditEventItem = {
      id: `audit-${Date.now()}-${uniqueSuffix}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: currentStaffUser.name,
      actorRole: currentStaffUser.role.replace('_', ' '),
      actionType,
      details,
      schoolId,
      schoolName,
      ipAddress: '192.168.1.104',
    };
    setAuditLogs((prev) => [newLog, ...prev.filter((item) => item.id !== newLog.id)]);
  };

  // Handlers
  const handleNavigate = (route: string, filterParam?: string) => {
    setActiveRoute(route);
    setRouteFilterParam(filterParam);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSchoolWorkspace = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setActiveRoute('school-workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Approvals Hub Decision Handler (Founder Saugat Singh sole authority)
  const handleMakeApprovalDecision = (
    requestId: string,
    decision: 'Approved' | 'Rejected' | 'Request Clarification' | 'Activated' | 'Suspended',
    notes: string
  ) => {
    const targetReq = approvalRequests.find((r) => r.id === requestId);
    if (!targetReq) return;

    let newState: ApprovalState = targetReq.status;
    if (decision === 'Approved') newState = 'Approved';
    else if (decision === 'Activated') newState = 'Active';
    else if (decision === 'Rejected') newState = 'Rejected';
    else if (decision === 'Suspended') newState = 'Suspended';
    else if (decision === 'Request Clarification') newState = 'Draft';

    const decisionRecord: ApprovalDecision = {
      id: `dec-${Date.now()}`,
      decision,
      decisionMaker: 'Saugat Singh',
      decisionMakerRole: 'Founder and Chief Program Architect',
      timestamp: new Date().toISOString(),
      previousState: targetReq.status,
      newState,
      notes,
      auditEventId: `audit-${Date.now()}`,
    };

    const updatedRequests = approvalRequests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          status: newState,
          decisionHistory: [decisionRecord, ...(req.decisionHistory || [])],
        };
      }
      return req;
    });

    setApprovalRequests(updatedRequests);

    // If a school onboarding was approved or activated, mark that partner school as Active
    if (targetReq.targetType === 'school' && (decision === 'Approved' || decision === 'Activated')) {
      setSchools((prev) =>
        prev.map((s) => {
          if (s.id === targetReq.targetId || s.name === targetReq.targetName) {
            return {
              ...s,
              status: 'Active',
            };
          }
          return s;
        })
      );
    }

    logAuditEvent(
      `Governance Decision: ${decision}`,
      `Founder Saugat Singh issued decision "${decision}" on ${targetReq.targetType} "${targetReq.targetName}". Notes: ${notes}`,
      targetReq.schoolId,
      targetReq.schoolName
    );
  };

  // Curriculum Studio Mapping Handler
  const handleUpdateMappingStatus = (mappingId: string, newStatus: MappingStatus) => {
    setCurriculumMappings((prev) =>
      prev.map((m) => {
        if (m.id === mappingId) {
          return {
            ...m,
            mappingStatus: newStatus,
            approvedBy: newStatus === 'Approved for pilot use' ? currentStaffUser.name : m.approvedBy,
            approvalTimestamp:
              newStatus === 'Approved for pilot use' ? new Date().toISOString() : m.approvalTimestamp,
          };
        }
        return m;
      })
    );

    logAuditEvent(
      'Curriculum Mapping Governance',
      `Updated mapping ${mappingId} status to "${newStatus}" by ${currentStaffUser.name}`
    );
  };

  const handleAddCurriculumMapping = (newMapping: CurriculumAlignmentMapping) => {
    setCurriculumMappings((prev) => [newMapping, ...prev]);
    logAuditEvent(
      'Curriculum Mapping Created',
      `Added new alignment mapping: ${newMapping.ceqhsPracticeName} ↔ ${newMapping.outcomeTitle}`
    );
  };

  // Protected Fresh-Start Reset Handler
  const handleExecuteReset = async (resetRecord: EnvironmentResetRecord) => {
    // Reset all localStorage keys to clean approved baseline state
    const keysToRemove = [
      'ceqhs_partner_schools',
      'ceqhs_dossier_items',
      'ceqhs_support_cases',
      'ceqhs_training_cohorts',
      'ceqhs_tenants',
      'ceqhs_tenant_users',
      'ceqhs_active_tenant_id',
      'ceqhs_active_tenant_user_id',
      'ceqhs_living_dossiers',
      'ceqhs_priority_queue',
      'ceqhs_recent_activity',
      'ceqhs_audit_logs',
      'ceqhs_educators',
      'ceqhs_journey_entries',
      'ceqhs_personal_goals',
      'ceqhs_active_user',
      'ceqhs_game_progress',
      'ceqhs_notifications',
      'ceqhs_entries',
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // Clear backend Firestore database
    try {
      await clearAllFirestoreData();
    } catch (e) {
      console.warn('Firestore database wipe note:', e);
    }

    // Keep Founder Super Admin intact and clear all states to empty
    setSchools([]);
    setDossierItems([]);
    setSupportCases([]);
    setCohorts([]);
    setApprovalRequests([]);
    setPriorityQueue([]);
    setRecentActivity([]);
    setCurriculumMappings(INITIAL_CURRICULUM_MAPPINGS);

    logAuditEvent(
      'FRESH_START_PILOT_RESET',
      `Full system fresh start executed by Founder Saugat Singh. All tenants, schools, reports, dossiers, and activity cleared. Platform is fresh and ready from the beginning.`
    );
  };

  // Onboard new school via wizard
  const handleCompleteSchoolOnboarding = (wizardData: any) => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 6);
    const newSchool: CEQHSPartnerSchool = {
      id: `sch-${Date.now()}-${uniqueSuffix}`,
      tenantId: `tenant-${wizardData.schoolName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: wizardData.schoolName,
      code: wizardData.shortCode || wizardData.schoolName.slice(0, 4).toUpperCase(),
      shortCode: wizardData.shortCode || wizardData.schoolName.slice(0, 4).toUpperCase(),
      location: `${wizardData.city || 'London'}, ${wizardData.country || 'UK'}`,
      region: 'Global Pilot',
      country: wizardData.country || 'United Kingdom',
      timezone: wizardData.timezone || 'GMT (UTC+0)',
      academicYear: wizardData.academicYear || '2026-2027',
      status: 'Onboarding',
      healthState: 'Healthy',
      currentPhase: 'ORIENTATION',
      phase: 0,
      phaseName: 'Phase 0 — Readiness, leadership alignment, and baseline inquiry',
      implementationCycle: 'Year 1 - Pilot',
      programme: 'Primary SEL Living Journal',
      cohort: 'Cohort 2026-2027',
      schoolAdminName: wizardData.coordinatorName || 'Lead Coordinator',
      schoolAdminEmail: wizardData.coordinatorEmail || 'coordinator@school.edu',
      leadCoordinatorName: wizardData.coordinatorName || 'Lead Coordinator',
      leadCoordinatorEmail: wizardData.coordinatorEmail || 'coordinator@school.edu',
      assignedOwnerId: currentStaffUser.id,
      assignedOwnerName: currentStaffUser.name,
      assignedCeqhsStaffId: currentStaffUser.id,
      assignedCeqhsStaffName: currentStaffUser.name,
      activeTeachersCount: wizardData.participatingGrades?.length * 4 || 12,
      enrolledStudentsCount: wizardData.participatingGrades?.length * 45 || 180,
      teacherCount: wizardData.participatingGrades?.length * 4 || 12,
      studentCount: wizardData.participatingGrades?.length * 45 || 180,
      trainingProgressPercent: 0,
      dossierProgressPercent: 0,
      milestonesReachedCount: 0,
      totalMilestonesCount: 6,
      evidenceCount: 0,
      reflectionsCount: 0,
      peerObservationsCount: 0,
      classroomAdaptationsCount: 0,
      lastActivityDate: new Date().toISOString().split('T')[0],
      riskStatus: 'normal',
      onboardingDate: new Date().toISOString().split('T')[0],
      primaryCurriculum: wizardData.primaryCurriculum,
      curriculumJurisdiction: wizardData.curriculumJurisdiction,
      participatingGrades: wizardData.participatingGrades || ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
      safeguardingAcknowledged: true,
      onboardingCompletedDate: new Date().toISOString().split('T')[0],
      approvedPracticesCount: wizardData.selectedPracticeIds?.length || 4,
    };

    setSchools((prev) => [newSchool, ...prev]);

    // Create an Approval Request for Founder Saugat Singh
    const newApprovalReq: ApprovalRequest = {
      id: `app-sch-${Date.now()}`,
      targetType: 'school',
      targetId: newSchool.id,
      targetName: newSchool.name,
      submittedBy: currentStaffUser.name,
      submittedAt: new Date().toISOString(),
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      status: 'Pending approval',
      details: {
        primaryCurriculum: newSchool.primaryCurriculum,
        curriculumJurisdiction: newSchool.curriculumJurisdiction,
        participatingGrades: newSchool.participatingGrades,
        leadCoordinatorEmail: newSchool.leadCoordinatorEmail,
        safeguardingAcknowledged: true,
      },
      decisionHistory: [],
    };

    setApprovalRequests((prev) => [newApprovalReq, ...prev]);

    logAuditEvent(
      'School Onboarding Submitted',
      `Submitted pilot onboarding application for ${newSchool.name} under ${newSchool.primaryCurriculum} for Founder review.`,
      newSchool.id,
      newSchool.name
    );

    setIsOnboardModalOpen(false);
    handleOpenSchoolWorkspace(newSchool.id);
  };

  const handleUpdateDossierReview = (
    itemId: string,
    decision: 'Approved' | 'Revision requested' | 'Flagged for follow-up',
    schoolFeedback: string,
    internalNotes: string,
    revisionReason?: string
  ) => {
    const itemToUpdate = dossierItems.find((i) => i.id === itemId);
    if (itemToUpdate) {
      logAuditEvent(
        'Review decision',
        `Artifact "${itemToUpdate.title}" review status set to ${decision}`,
        itemToUpdate.schoolId,
        itemToUpdate.schoolName
      );
    }

    setDossierItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated: DossierItemEvidence = {
            ...item,
            reviewStatus: decision,
            schoolVisibleFeedback: schoolFeedback,
            ceqhsInternalNotes: internalNotes,
            assignedReviewerId: currentStaffUser.id,
            assignedReviewerName: currentStaffUser.name,
            lastUpdatedDate: new Date().toISOString().split('T')[0],
          };

          if (revisionReason) {
            updated.versionHistory = [
              ...updated.versionHistory,
              {
                version: updated.version + 1,
                submittedDate: new Date().toISOString().split('T')[0],
                submittedBy: item.submittedBy,
                summary: 'Revision in progress following feedback.',
                revisionReason,
              },
            ];
          }

          return updated;
        }
        return item;
      })
    );
  };

  const handleVerifyMilestone = (milestoneId: string, notes: string) => {
    const mToVerify = milestones.find((m) => m.id === milestoneId);
    if (mToVerify) {
      logAuditEvent(
        'Milestone verification',
        `Verified milestone "${mToVerify.name}" for ${mToVerify.schoolName}`,
        mToVerify.schoolId,
        mToVerify.schoolName
      );
    }

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: 'Verified',
            verifiedBy: currentStaffUser.name,
            verifiedDate: new Date().toISOString().split('T')[0],
            verificationNotes: notes,
            completionPercent: 100,
          };
        }
        return m;
      })
    );
  };

  const handleRequestMilestoneRevision = (milestoneId: string, notes: string) => {
    const mToRevise = milestones.find((m) => m.id === milestoneId);
    if (mToRevise) {
      logAuditEvent(
        'Milestone revision requested',
        `Requested additional evidence for "${mToRevise.name}" in ${mToRevise.schoolName}`,
        mToRevise.schoolId,
        mToRevise.schoolName
      );
    }

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status: 'Revision Requested',
            verificationNotes: notes,
          };
        }
        return m;
      })
    );
  };

  const handleAddSupportCase = (caseData: Partial<SupportCaseItem>) => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 6);
    const newCase: SupportCaseItem = {
      id: `case-${Date.now()}-${uniqueSuffix}`,
      caseNumber: `SUP-${Date.now().toString().slice(-4)}`,
      schoolId: caseData.schoolId || schools[0].id,
      schoolName: caseData.schoolName || schools[0].name,
      relatedPersonName: caseData.relatedPersonName || 'School Administrator',
      relatedPersonRole: caseData.relatedPersonRole || 'Lead',
      category: caseData.category || 'Curriculum Alignment',
      description: caseData.description || '',
      ownerId: caseData.ownerId || currentStaffUser.id,
      ownerName: caseData.ownerName || currentStaffUser.name,
      priority: caseData.priority || 'Medium',
      dueDate: caseData.dueDate || '2026-09-25',
      status: 'Open',
      internalNotes: caseData.internalNotes || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSupportCases((prev) => [newCase, ...prev]);
    logAuditEvent(
      'Support case created',
      `Opened support case ${newCase.caseNumber} for ${newCase.schoolName}`,
      newCase.schoolId,
      newCase.schoolName
    );
  };

  const handleResolveSupportCase = (caseId: string) => {
    const caseToResolve = supportCases.find((sc) => sc.id === caseId);
    if (caseToResolve) {
      logAuditEvent(
        'Support case resolved',
        `Resolved case ${caseToResolve.caseNumber} for ${caseToResolve.schoolName}`,
        caseToResolve.schoolId,
        caseToResolve.schoolName
      );
    }

    setSupportCases((prev) =>
      prev.map((sc) => {
        if (sc.id === caseId) {
          return {
            ...sc,
            status: 'Resolved',
            resolutionDate: new Date().toISOString().split('T')[0],
          };
        }
        return sc;
      })
    );
  };

  const handleAddStaff = (newStaffData: Partial<CEQHSStaffUser>) => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 6);
    const newStaff: CEQHSStaffUser = {
      id: `staff-${Date.now()}-${uniqueSuffix}`,
      name: newStaffData.name || '',
      email: newStaffData.email || '',
      role: newStaffData.role || 'reviewer',
      title: newStaffData.title || 'Reviewer',
      avatarInitials: newStaffData.avatarInitials || 'ST',
      assignedSchoolIds: [],
      assignedCount: 0,
      isActive: true,
      lastSignIn: 'Invited',
      phone: newStaffData.phone || '',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setStaff((prev) => [...prev, newStaff]);
    logAuditEvent('Staff invitation', `Invited staff member ${newStaff.name} as ${newStaff.role}`);
  };

  const handleUpdateRole = (staffId: string, role: CEQHSUserRole) => {
    const staffToUpdate = staff.find((s) => s.id === staffId);
    if (staffToUpdate) {
      logAuditEvent('Role change', `Updated role of ${staffToUpdate.name} to ${role}`);
    }

    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, role };
        }
        return s;
      })
    );
  };

  const handleToggleActive = (staffId: string) => {
    const staffToToggle = staff.find((s) => s.id === staffId);
    if (staffToToggle) {
      const newActive = !staffToToggle.isActive;
      logAuditEvent(
        'Staff status toggle',
        `${newActive ? 'Reactivated' : 'Deactivated'} staff account ${staffToToggle.name}`
      );
    }

    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, isActive: !s.isActive };
        }
        return s;
      })
    );
  };

  const handleAssignSchools = (staffId: string, schoolIds: string[]) => {
    const staffToAssign = staff.find((s) => s.id === staffId);
    if (staffToAssign) {
      logAuditEvent('Portfolio assignment', `Updated assigned schools portfolio for ${staffToAssign.name}`);
    }

    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return {
            ...s,
            assignedSchoolIds: schoolIds,
            assignedCount: schoolIds.length,
          };
        }
        return s;
      })
    );
  };

  const handleViewAsSchoolAdmin = (schoolId: string) => {
    const targetSchool = schools.find((s) => s.id === schoolId);
    if (targetSchool && onSwitchToSchoolAdmin) {
      onSwitchToSchoolAdmin(targetSchool.tenantId);
    }
  };

  const pendingApprovalsCount = approvalRequests.filter(
    (r) => r.status === 'Pending approval' || r.status === 'Invitation sent'
  ).length;
  const selectedSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  return (
    <CeqhsLayout
      currentUser={currentStaffUser}
      allStaff={staff}
      activeRoute={activeRoute}
      onNavigate={(route) => handleNavigate(route)}
      onSwitchUser={(staffId) => {
        const found = staff.find((s) => s.id === staffId);
        if (found) setCurrentStaffUser(found);
      }}
      onSignOut={onSignOut}
      onOpenLauncher={() => setIsLauncherOpen(true)}
      onAddSchool={() => setIsOnboardModalOpen(true)}
      onOpenCardsApp={() => setIsCardsAppOpen(true)}
      onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
      onOpenFreshResetModal={() => setIsFreshResetModalOpen(true)}
      pendingApprovalsCount={pendingApprovalsCount}
      pendingDossierCount={dossierItems.filter((d) => d.reviewStatus === 'Awaiting review').length}
      pendingMilestoneCount={milestones.filter((m) => m.status === 'Evidence Submitted').length}
      openSupportCount={supportCases.filter((s) => s.status !== 'Resolved').length}
    >
      {/* CARDS APP MODAL */}
      <CeqhsCardsAppModal
        isOpen={isCardsAppOpen}
        onClose={() => setIsCardsAppOpen(false)}
      />

      {/* KNOWLEDGE BASE MODAL */}
      <CeqhsKnowledgeBaseModal
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />

      {/* 6-STEP SCHOOL ONBOARDING WIZARD */}
      <CeqhsAddSchoolWizard
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        staffList={staff}
        onCompleteWizard={handleCompleteSchoolOnboarding}
      />

      {/* PROTECTED FRESH-START RESET MODAL (Founder Saugat Singh) */}
      <CeqhsFreshResetModal
        isOpen={isFreshResetModalOpen}
        onClose={() => setIsFreshResetModalOpen(false)}
        onExecuteReset={handleExecuteReset}
        currentSchoolCount={schools.length}
        currentStaffCount={staff.length}
        currentDossierCount={dossierItems.length}
      />

      {/* LAUNCHER MODAL */}
      {isLauncherOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <CeqhsLauncher
              onNavigate={(route) => {
                handleNavigate(route);
                setIsLauncherOpen(false);
              }}
              onClose={() => setIsLauncherOpen(false)}
              pendingDossierCount={dossierItems.filter((d) => d.reviewStatus === 'Awaiting review').length}
              pendingMilestoneCount={milestones.filter((m) => m.status === 'Evidence Submitted').length}
              openSupportCount={supportCases.filter((s) => s.status !== 'Resolved').length}
            />
          </div>
        </div>
      )}

      {/* VIEW ROUTING */}
      {(activeRoute === 'workspaces' || activeRoute === 'applications') && (
        <CeqhsWorkspaceChooser
          currentUser={currentStaffUser}
          schools={schools}
          dossierItems={dossierItems}
          milestones={milestones}
          supportCases={supportCases}
          pendingApprovalsCount={pendingApprovalsCount}
          onNavigate={handleNavigate}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
          onAddSchool={() => setIsOnboardModalOpen(true)}
          onOpenCardsApp={() => setIsCardsAppOpen(true)}
          onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
          onOpenFreshResetModal={() => setIsFreshResetModalOpen(true)}
        />
      )}

      {/* CEQHS LIVING JOURNEY MODULES (GRADES 1–5 PILOT) */}
      {activeRoute === 'living-dashboard' && (
        <CeqhsLivingDashboard
          onNavigate={handleNavigate}
          onOpenDraftModal={() => handleNavigate('curriculum-integration')}
        />
      )}

      {activeRoute === 'school-profile' && (
        <CeqhsSchoolProfileView
          onLaunchOnboarding={() => setIsOnboardModalOpen(true)}
        />
      )}

      {activeRoute === 'needs-baseline' && (
        <CeqhsNeedsBaselineView
          onNavigate={handleNavigate}
        />
      )}

      {activeRoute === 'ceqhs-plan' && (
        <CeqhsPlanComposerView
          onOpenCurriculumIntegration={() => handleNavigate('curriculum-integration')}
        />
      )}

      {activeRoute === 'curriculum-integration' && (
        <CeqhsCurriculumIntegrationView
          onOpenDraftModal={() => handleNavigate('curriculum')}
        />
      )}

      {activeRoute === 'activity-library' && (
        <CeqhsActivityLibraryView />
      )}

      {activeRoute === 'adult-development' && (
        <CeqhsAdultDevelopmentView />
      )}

      {activeRoute === 'evidence-impact' && (
        <CeqhsEvidenceImpactView onNavigateToImpactEvidence={() => handleNavigate('impact-evidence')} />
      )}

      {activeRoute === 'impact-evidence' && (
        <ImpactEvidenceSection onNavigateGlobal={handleNavigate} />
      )}

      {activeRoute === 'award-progress' && (
        <CeqhsAwardProgressView />
      )}

      {activeRoute === 'administration' && (
        <CeqhsAdministrationView
          currentRole={currentStaffUser.role}
          onRoleChange={(role) => handleUpdateRole(currentStaffUser.id, role as any)}
        />
      )}

      {/* APPROVALS HUB (Founder Saugat Singh Sole Authority) */}
      {activeRoute === 'approvals' && (
        <CeqhsApprovalsHub
          requests={approvalRequests}
          onMakeDecision={handleMakeApprovalDecision}
          onNavigateSchool={(schoolId) => handleOpenSchoolWorkspace(schoolId)}
        />
      )}

      {/* CURRICULUM ALIGNMENT STUDIO (Grades 1–5: IB, OX, CA, NC) */}
      {activeRoute === 'curriculum' && (
        <CeqhsCurriculumStudio
          mappings={curriculumMappings}
          onUpdateMappingStatus={handleUpdateMappingStatus}
          onAddMapping={handleAddCurriculumMapping}
        />
      )}

      {activeRoute === 'surveys' && (
        <CeqhsSurveys
          schools={schools}
          onBack={() => handleNavigate('workspaces')}
        />
      )}

      {activeRoute === 'programme-studio' && (
        <CeqhsProgrammeStudio
          onBack={() => handleNavigate('workspaces')}
          onOpenCardsApp={() => setIsCardsAppOpen(true)}
          onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        />
      )}

      {activeRoute === 'overview' && (
        <CeqhsOverview
          currentUser={currentStaffUser}
          schools={schools}
          dossierItems={dossierItems}
          milestones={milestones}
          priorityQueue={priorityQueue}
          recentActivity={recentActivity}
          supportCases={supportCases}
          onNavigate={handleNavigate}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
          onAddSchool={() => setIsOnboardModalOpen(true)}
        />
      )}

      {activeRoute === 'schools' && (
        <CeqhsPartnerSchools
          schools={schools}
          staff={staff}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
          onAddSchool={() => setIsOnboardModalOpen(true)}
          initialFilterStatus={routeFilterParam?.replace('status=', '')}
        />
      )}

      {activeRoute === 'school-workspace' && selectedSchool && (
        <CeqhsSchoolWorkspace
          school={selectedSchool}
          allStaff={staff}
          dossierItems={dossierItems}
          milestones={milestones}
          supportCases={supportCases}
          cohorts={cohorts}
          auditLogs={auditLogs}
          onBack={() => setActiveRoute('schools')}
          onViewAsSchoolAdmin={handleViewAsSchoolAdmin}
          onUpdateDossierReview={handleUpdateDossierReview}
          onVerifyMilestone={handleVerifyMilestone}
          onAddSupportCase={handleAddSupportCase}
        />
      )}

      {activeRoute === 'dossier-review' && (
        <CeqhsDossierReview
          dossierItems={dossierItems}
          schools={schools}
          initialStatusFilter={routeFilterParam?.replace('status=', '')}
          onUpdateDossierReview={handleUpdateDossierReview}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
        />
      )}

      {activeRoute === 'milestones' && (
        <CeqhsMilestones
          milestones={milestones}
          schools={schools}
          initialStatusFilter={routeFilterParam?.replace('status=', '')}
          onVerifyMilestone={handleVerifyMilestone}
          onRequestMilestoneRevision={handleRequestMilestoneRevision}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
        />
      )}

      {activeRoute === 'training' && (
        <CeqhsTraining
          cohorts={cohorts}
          schools={schools}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
        />
      )}

      {activeRoute === 'reports' && (
        <CeqhsReports
          schools={schools}
          milestones={milestones}
          cohorts={cohorts}
          dossierItems={dossierItems}
        />
      )}

      {activeRoute === 'follow-up' && (
        <CeqhsFollowUp
          supportCases={supportCases}
          schools={schools}
          staff={staff}
          onAddSupportCase={handleAddSupportCase}
          onResolveSupportCase={handleResolveSupportCase}
          onOpenSchoolWorkspace={handleOpenSchoolWorkspace}
        />
      )}

      {activeRoute === 'team' && (
        <CeqhsTeam
          staff={staff}
          schools={schools}
          onAddStaff={handleAddStaff}
          onUpdateRole={handleUpdateRole}
          onToggleActive={handleToggleActive}
          onAssignSchools={handleAssignSchools}
        />
      )}

      {activeRoute === 'settings' && (
        <CeqhsSettings auditLogs={auditLogs} />
      )}
    </CeqhsLayout>
  );
};
