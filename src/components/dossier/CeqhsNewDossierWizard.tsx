import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  BookOpen,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  DossierModel,
  PrimaryCurriculumFramework,
  GradeLevel,
  DossierSectionConfig,
} from '../../types/ceqhsDossier';
import { DEFAULT_23_DOSSIER_SECTIONS } from '../../data/ceqhsDossierBaseline';

interface CeqhsNewDossierWizardProps {
  onCancel: () => void;
  onDossierCreated: (newDossier: DossierModel) => void;
  availableSchools?: { id: string; name: string; location: string; type: string }[];
  isSchoolCoordinator?: boolean;
  preselectedSchoolId?: string;
}

export const CeqhsNewDossierWizard: React.FC<CeqhsNewDossierWizardProps> = ({
  onCancel,
  onDossierCreated,
  availableSchools = [
    { id: 'tenant-a-oakridge', name: 'Oakridge International Primary School', location: 'Cambridge, UK', type: 'Independent International' },
    { id: 'tenant-gw-ib', name: 'Greenwood World Primary School', location: 'Geneva, Switzerland', type: 'IB World School' },
    { id: 'tenant-stmarys-uk', name: 'St. Mary\'s Primary Academy', location: 'Yorkshire, UK', type: 'State Primary Academy' },
    { id: 'tenant-delhiworld-ox', name: 'Delhi World Primary Academy', location: 'New Delhi, India', type: 'Oxford Partner School' },
  ],
  isSchoolCoordinator = false,
  preselectedSchoolId = 'tenant-a-oakridge',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Select school
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(preselectedSchoolId);

  // Step 2: Programme and Cycle
  const [programmeVersion, setProgrammeVersion] = useState<string>('CEQHS Living Journal for Primary Educators (Grades 1–5)');
  const [cycleName, setCycleName] = useState<string>('Primary Cycle 1: Emotional Literacy & Restorative Culture');
  const [implementationPeriod, setImplementationPeriod] = useState<string>('September 2026 – June 2027');
  const [academicYear, setAcademicYear] = useState<string>('2026–2027');
  const [participatingGrades, setParticipatingGrades] = useState<GradeLevel[]>([
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ]);
  const [coordinatorName, setCoordinatorName] = useState<string>('Dr. Clara Sterling');
  const [coordinatorEmail, setCoordinatorEmail] = useState<string>('c.sterling@oakridge.edu.uk');
  const [ceqhsLeadName, setCeqhsLeadName] = useState<string>('Saugat Singh (Founder & Chief Program Architect)');

  // Step 3: Primary Curriculum Context
  const [primaryCurriculum, setPrimaryCurriculum] = useState<PrimaryCurriculumFramework>('Cambridge Curriculum');
  const [curriculumJurisdiction, setCurriculumJurisdiction] = useState<string>('Cambridge Primary Assessment International Education (CIE)');

  // Step 4: Sections Selection
  const [sectionsConfig, setSectionsConfig] = useState<DossierSectionConfig[]>(
    DEFAULT_23_DOSSIER_SECTIONS.map((s) => ({ ...s, isIncluded: true }))
  );

  // Step 5: Safeguarding & Confidentiality confirmation
  const [safeguardConsent, setSafeguardConsent] = useState({
    photoConsentConfirmed: false,
    studentNamesDeidentified: false,
    quotesAnonymised: false,
    teacherPrivateExcluded: false,
    externalSuitabilityAgreed: false,
  });

  const selectedSchool = availableSchools.find((s) => s.id === selectedSchoolId) || availableSchools[0];

  const handleToggleGrade = (grade: GradeLevel) => {
    if (participatingGrades.includes(grade)) {
      if (participatingGrades.length > 1) {
        setParticipatingGrades(participatingGrades.filter((g) => g !== grade));
      }
    } else {
      setParticipatingGrades([...participatingGrades, grade]);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setSectionsConfig((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, isIncluded: !s.isIncluded } : s))
    );
  };

  const allSafeguardsConfirmed =
    safeguardConsent.photoConsentConfirmed &&
    safeguardConsent.studentNamesDeidentified &&
    safeguardConsent.quotesAnonymised &&
    safeguardConsent.teacherPrivateExcluded &&
    safeguardConsent.externalSuitabilityAgreed;

  const handleFinishCreate = () => {
    const newDossier: DossierModel = {
      id: `dossier-${selectedSchoolId.replace(/[^a-z0-9]/gi, '')}-${Date.now().toString().slice(-4)}`,
      schoolTenantId: selectedSchool.id,
      schoolName: selectedSchool.name,
      schoolLocation: selectedSchool.location,
      schoolType: selectedSchool.type,
      cycleId: `cycle-${Date.now().toString().slice(-4)}`,
      cycleName,
      implementationPeriod,
      academicYear,
      programmeVersionId: 'prog-ceqhs-living-journal-v2',
      programmeVersionName: programmeVersion,
      primaryCurriculum,
      curriculumJurisdiction,
      participatingGrades,
      status: 'Draft',
      leadCoordinator: {
        name: coordinatorName,
        email: coordinatorEmail,
        role: 'School Implementation Lead',
      },
      ceqhsLeadReviewer: {
        name: 'Saugat Singh',
        email: 'saugat.swataha@gmail.com',
        role: 'Founder and Chief Program Architect',
      },
      targetSections: sectionsConfig,
      schoolNarrative: `${selectedSchool.name} is undertaking the CEQHS Living Journal implementation across Grades 1–5 to cultivate verified emotional literacy, restorative conflict dialogue, and educator self-regulation.`,
      startingPointSummary: 'Baseline inquiry and teacher focus group reviews in progress.',
      focusSummary: 'Establishing daily morning check-ins and emotion vocabulary wheels in homerooms.',
      embeddingSummary: 'Restorative peer circles, calming sensory corners, and faculty living journal entries.',
      narrativeJourneyDraft: `Draft generated from selected evidence. Over the ${academicYear} cycle, ${selectedSchool.name} has committed to embedding emotional intelligence principles directly into daily classroom practice...`,
      isNarrativeApproved: false,
      narrativeSourceCitations: [],
      heroPhotoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      heroPhotoCaption: 'Primary learners and faculty in morning relational check-in routine.',
      coverFooter: 'Prepared through the CEQHS Practice & Evidence Platform · Implementation Cycle Workspace',
      verificationStatement: 'The evidence contained in this dossier was reviewed against the CEQHS implementation and evidence requirements applicable to this implementation cycle.',
      verifiedByFounder: false,
      claims: [],
      practiceStories: [],
      visualEvidence: [],
      peerObservations: [],
      baselineComparisons: [
        {
          indicatorArea: 'Educator Emotional Regulation Confidence',
          startingPoint: 'Baseline pending',
          currentPractice: 'Phase 1 Active',
          reportedChange: 'Initialising',
          dataSource: 'CEQHS Faculty Inquiry Survey',
          sampleSize: 'Primary Faculty',
          collectionDate: 'Sep 2026',
          isSelfReported: true,
          interpretationNote: 'Initial baseline benchmark.',
        },
      ],
      qualitativeFindings: ['Faculty orientation completed.'],
      activeVersionNumber: 'v0.1-draft',
      versionHistory: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    onDossierCreated(newDossier);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Wizard Header */}
      <div className="bg-[#2E523A] text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-amber-300">
              C
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                CEQHS Implementation Governance
              </div>
              <h2 className="text-2xl font-serif">New Implementation Cycle Dossier</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs px-2.5 py-1 rounded bg-white/10 text-white font-mono">
              Step {currentStep} of 6
            </span>
          </div>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-6 gap-2 mt-6">
          {[
            'School',
            'Cycle & Grades',
            'Curriculum',
            '23 Sections',
            'Safeguards',
            'Create',
          ].map((stepName, sIdx) => {
            const stepNum = sIdx + 1;
            const isActive = currentStep === stepNum;
            const isDone = currentStep > stepNum;
            return (
              <div
                key={stepName}
                className={`text-center pb-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-amber-300 text-white font-medium'
                    : isDone
                    ? 'border-emerald-400 text-emerald-200'
                    : 'border-white/20 text-white/50'
                }`}
              >
                <div className="text-[10px] uppercase tracking-wider">{`0${stepNum}`}</div>
                <div className="text-xs truncate">{stepName}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="p-8">
        {/* STEP 1: SELECT SCHOOL */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Step 1: Confirm Partner School Tenant</h3>
              <p className="text-sm text-stone-600 mt-1">
                Each school tenant operates in secure isolation. All student records, teacher reflections, and
                evidence assets belong strictly to the assigned institution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSchools.map((school) => {
                const isSelected = selectedSchoolId === school.id;
                return (
                  <button
                    key={school.id}
                    type="button"
                    disabled={isSchoolCoordinator}
                    onClick={() => setSelectedSchoolId(school.id)}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#2E523A] bg-emerald-50/50 shadow-xs ring-1 ring-[#2E523A]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                        <Building2 className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#2E523A] text-white font-medium">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-stone-900 mt-3">{school.name}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{school.location}</div>
                    <div className="text-xs text-[#2E523A] font-medium mt-2">{school.type}</div>
                  </button>
                );
              })}
            </div>

            {isSchoolCoordinator && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-amber-700" />
                School Admin view: School tenant is locked to your home institution.
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PROGRAMME AND CYCLE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Step 2: Define Programme Version & Cycle Parameters</h3>
              <p className="text-sm text-stone-600 mt-1">
                Active programme is strictly limited to Grades 1–5. Configure academic year and developmental groupings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  CEQHS Programme Version
                </label>
                <input
                  type="text"
                  value={programmeVersion}
                  onChange={(e) => setProgrammeVersion(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Cycle Name
                </label>
                <input
                  type="text"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 text-stone-900 focus:ring-2 focus:ring-[#2E523A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Implementation Period
                </label>
                <input
                  type="text"
                  value={implementationPeriod}
                  onChange={(e) => setImplementationPeriod(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  School Coordinator
                </label>
                <input
                  type="text"
                  value={coordinatorName}
                  onChange={(e) => setCoordinatorName(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  CEQHS Lead Reviewer (Super Admin)
                </label>
                <input
                  type="text"
                  value={ceqhsLeadName}
                  disabled
                  className="w-full text-sm p-3 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-900"
                />
              </div>
            </div>

            {/* Participating Grades Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Participating Primary Grades (Mandatory Scope: Grades 1–5 only)
              </label>
              <div className="flex flex-wrap gap-2">
                {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as GradeLevel[]).map((grade) => {
                  const isChecked = participatingGrades.includes(grade);
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => handleToggleGrade(grade)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        isChecked
                          ? 'bg-[#2E523A] text-white border-[#2E523A]'
                          : 'bg-stone-50 text-stone-600 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {grade}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Selected: {participatingGrades.join(', ')} ({participatingGrades.length} Grades)
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: CURRICULUM CONTEXT */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Step 3: Primary Curriculum Context & Alignment</h3>
              <p className="text-sm text-stone-600 mt-1">
                Select the primary curriculum framework used by the school. Only approved curriculum connections
                appear in the official verification section.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'Cambridge Curriculum',
                  title: 'Cambridge Primary Curriculum',
                  desc: 'Cambridge Assessment International Education (CIE) Wellbeing and Global Perspectives strands.',
                },
                {
                  id: 'International Baccalaureate (IB)',
                  title: 'IB Primary Years Programme (PYP)',
                  desc: 'PYP Learner Profile (Caring, Reflective, Balanced) and Approaches to Learning (ATL).',
                },
                {
                  id: 'Oxford Curriculum',
                  title: 'Oxford International Curriculum',
                  desc: 'Oxford International Primary Wellbeing, Global Skills Projects, and Self-Regulation.',
                },
                {
                  id: 'National Curriculum',
                  title: 'National Curriculum (Statutory)',
                  desc: 'Statutory Primary Relationships & Health Education (PSHE) and Pastoral Climate.',
                },
              ].map((curr) => {
                const isSelected = primaryCurriculum === curr.id;
                return (
                  <button
                    key={curr.id}
                    type="button"
                    onClick={() => {
                      setPrimaryCurriculum(curr.id as PrimaryCurriculumFramework);
                      setCurriculumJurisdiction(curr.desc);
                    }}
                    className={`text-left p-5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#2E523A] bg-emerald-50/50 shadow-xs ring-1 ring-[#2E523A]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-stone-900">{curr.title}</div>
                      {isSelected && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#2E523A] text-white font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-2">{curr.desc}</p>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Curriculum Version & Jurisdiction Details
              </label>
              <input
                type="text"
                value={curriculumJurisdiction}
                onChange={(e) => setCurriculumJurisdiction(e.target.value)}
                className="w-full text-sm p-3 rounded-lg border border-stone-300 text-stone-900"
              />
            </div>
          </div>
        )}

        {/* STEP 4: 23 SECTIONS SELECTION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-900">Step 4: Dossier Sections Structure (23 Sections)</h3>
                <p className="text-sm text-stone-600 mt-1">
                  By default, all 23 standard sections are included to ensure complete verification compliance.
                </p>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                {sectionsConfig.filter((s) => s.isIncluded).length} of 23 Included
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-2">
              {sectionsConfig.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => handleToggleSection(sec.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    sec.isIncluded
                      ? 'border-emerald-300 bg-emerald-50/40 text-stone-900'
                      : 'border-stone-200 bg-stone-50/70 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-stone-500">
                      {sec.sectionNumber.toString().padStart(2, '0')}
                    </span>
                    <input
                      type="checkbox"
                      checked={sec.isIncluded}
                      onChange={() => handleToggleSection(sec.id)}
                      className="rounded border-stone-300 text-[#2E523A] focus:ring-[#2E523A]"
                    />
                  </div>
                  <div className="text-xs font-semibold mt-1 truncate">{sec.title}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{sec.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: SAFEGUARDING & CONFIDENTIALITY */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900">Mandatory Safeguarding & Privacy Governance</h4>
                <p className="text-xs text-amber-800 mt-1">
                  CEQHS publications are public or school-wide artefacts. You must confirm compliance with all 5
                  privacy rules before the dossier workspace can be provisioned.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'photoConsentConfirmed',
                  label: 'Parental & Institutional Photo Consent Confirmed',
                  desc: 'Every photograph included in this dossier has signed, recorded guardian consent for educational portfolio review.',
                },
                {
                  key: 'studentNamesDeidentified',
                  label: 'Student Names & Personal Identifiers Removed',
                  desc: 'No real student surnames or identifying badges appear anywhere in the narrative or photographic assets.',
                },
                {
                  key: 'quotesAnonymised',
                  label: 'Student Voice & Educator Quotes Anonymised',
                  desc: 'All quotes are formatted with pseudonyms or grade band indicators (e.g., "Grade 3 Learner").',
                },
                {
                  key: 'teacherPrivateExcluded',
                  label: 'Teacher-Private Reflections Strictly Excluded',
                  desc: 'Personal educator journal entries designated as private are protected from leaking into the published document.',
                },
                {
                  key: 'externalSuitabilityAgreed',
                  label: 'Public & Accreditation Audience Suitability',
                  desc: 'Content represents professional pedagogical inquiry suitable for school governing bodies and CEQHS accreditation.',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={safeguardConsent[item.key as keyof typeof safeguardConsent]}
                    onChange={(e) =>
                      setSafeguardConsent({
                        ...safeguardConsent,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="mt-1 rounded border-stone-300 text-[#2E523A] focus:ring-[#2E523A]"
                  />
                  <div>
                    <div className="text-sm font-medium text-stone-900">{item.label}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{item.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: CREATE & SUMMARY */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Step 6: Review & Initialize Dossier Workspace</h3>
              <p className="text-sm text-stone-600 mt-1">
                Confirm your configuration. Clicking "Initialize Dossier" will create the workspace and start the
                curation workflow in Draft state.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs uppercase text-stone-500 font-medium">Partner School</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{selectedSchool.name}</div>
                  <div className="text-xs text-stone-500">{selectedSchool.location}</div>
                </div>
                <div>
                  <span className="text-xs uppercase text-stone-500 font-medium">Curriculum Framework</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{primaryCurriculum}</div>
                  <div className="text-xs text-stone-500">{curriculumJurisdiction}</div>
                </div>
                <div>
                  <span className="text-xs uppercase text-stone-500 font-medium">Cycle & Period</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{cycleName}</div>
                  <div className="text-xs text-stone-500">{implementationPeriod}</div>
                </div>
                <div>
                  <span className="text-xs uppercase text-stone-500 font-medium">Grades & Scope</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{participatingGrades.join(', ')}</div>
                  <div className="text-xs text-stone-500">
                    {sectionsConfig.filter((s) => s.isIncluded).length} Sections Included
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  All 5 Safeguarding Requirements Verified
                </div>
                <div className="text-stone-500">
                  Initial Status: <span className="font-semibold text-stone-800">Draft</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation */}
      <div className="px-8 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
        <button
          type="button"
          onClick={currentStep === 1 ? onCancel : () => setCurrentStep(currentStep - 1)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            disabled={currentStep === 5 && !allSafeguardsConfirmed}
            onClick={() => setCurrentStep(currentStep + 1)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all flex items-center gap-2 ${
              currentStep === 5 && !allSafeguardsConfirmed
                ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                : 'bg-[#2E523A] hover:bg-[#24412e] shadow-sm'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinishCreate}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#2E523A] hover:bg-[#24412e] shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Initialize Dossier Workspace
          </button>
        )}
      </div>
    </div>
  );
};
