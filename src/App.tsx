import React, { useState, useEffect } from 'react';
import {
  MOCK_USERS,
  THEMES,
  JOURNEY_PHASES,
  INITIAL_ENTRIES,
  CALENDAR_EVENTS,
  RESOURCE_LIBRARY,
  BEFORE_NOW_SHIFTS,
  SCHOOL_SIGNALS,
  DOSSIER_CHAPTERS,
  CEQHS_REVIEW_CHECKPOINTS,
} from './mockData';
import {
  JourneyEntry,
  EntryType,
  User,
  MomentCategory,
  CEQHSReviewCheckpoint,
  GameProgressState,
  UserSettings,
  Tenant,
  TenantUser,
  AppNotification,
} from './types';
import { INITIAL_TENANTS, INITIAL_TENANT_USERS } from './data/tenantData';
import { Navigation } from './components/Navigation';
import { EducatorDashboard } from './components/EducatorDashboard';
import { MyJourneyTimeline } from './components/MyJourneyTimeline';
import { MomentsThatMattered } from './components/MomentsThatMattered';
import { ThemesLibrary } from './components/ThemesLibrary';
import { JourneyCalendar } from './components/JourneyCalendar';
import { ResourceLibrary } from './components/ResourceLibrary';
import { SchoolCoordinatorDashboard } from './components/SchoolCoordinatorDashboard';
import { DossierView } from './components/DossierView';
import { CEQHSReviewWorkspace } from './components/CEQHSReviewWorkspace';
import { TenantManagementHub } from './components/TenantManagementHub';
import { CaptureModal } from './components/CaptureModal';
import { DDAGameSimulator } from './components/DDAGameSimulator';
import { Achievements } from './components/Achievements';
import { AuthAndProfileModal } from './components/AuthAndProfileModal';
import { LoginScreen } from './components/LoginScreen';
import { CeqhsUserPortal } from './components/ceqhs/CeqhsUserPortal';
import { NotificationCenter } from './components/NotificationCenter';
import { ImpactEvidencePortal } from './components/impact/ImpactEvidencePortal';

const INITIAL_NOTIFICATIONS: AppNotification[] = [];
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
} from './lib/firebase';
import {
  fetchUserProfileFromFirestore,
  saveUserProfileToFirestore,
  fetchGameProgressFromFirestore,
  saveGameProgressToFirestore,
  fetchJourneyEntriesFromFirestore,
  saveJourneyEntryToFirestore,
} from './lib/firestoreService';
import { INITIAL_GAME_PROGRESS, DEFAULT_USER_SETTINGS } from './lib/gameDDA';
import { triggerStreakFirework } from './lib/celebration';

const STORAGE_KEYS = {
  authSession: 'ceqhs_auth_session',
  portalRole: 'ceqhs_portal_role',
  activeTenantId: 'ceqhs_active_tenant_id',
  notifications: 'ceqhs_notifications',
  entries: 'ceqhs_entries',
  gameProgress: 'ceqhs_game_progress',
  tenants: 'ceqhs_tenants',
  tenantUsers: 'ceqhs_tenant_users',
} as const;

const readStorageValue = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const readSessionValue = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const readPersistedString = (key: string) => {
  return readStorageValue(key) ?? readSessionValue(key) ?? null;
};

const readJsonStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = readStorageValue(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJsonStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const persistPortalRole = (role: 'ceqhs' | 'school_admin' | 'teacher') => {
  try {
    localStorage.setItem(STORAGE_KEYS.portalRole, role);
    sessionStorage.setItem(STORAGE_KEYS.portalRole, role);
  } catch {}
};

const persistActiveTenantId = (tenantId: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.activeTenantId, tenantId);
  } catch {}
};

const clearAuthSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.authSession);
    sessionStorage.removeItem(STORAGE_KEYS.authSession);
    localStorage.removeItem(STORAGE_KEYS.portalRole);
    sessionStorage.removeItem(STORAGE_KEYS.portalRole);
  } catch (e) {
    console.warn('Could not clear auth session', e);
  }
};

export default function App() {
  // App Access Authentication Gate (Username: admin, Password: password)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(readPersistedString(STORAGE_KEYS.authSession));
  });

  const [activePortalRole, setActivePortalRole] = useState<'ceqhs' | 'school_admin' | 'teacher'>(() => {
    const saved = readPersistedString(STORAGE_KEYS.portalRole);
    if (saved === 'ceqhs' || saved === 'school_admin' || saved === 'teacher') return saved;
    return 'ceqhs';
  });

  const [currentUserKey, setCurrentUserKey] = useState<string>('maya');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Active User Profile
  const [activeUser, setActiveUser] = useState<User>(() => {
    return MOCK_USERS.maya;
  });

  // Game Progress State with Dynamic Difficulty Adjustment (DDA)
  const [gameProgress, setGameProgress] = useState<GameProgressState>(() => {
    return readJsonStorage(STORAGE_KEYS.gameProgress, INITIAL_GAME_PROGRESS);
  });

  // Journey Entries
  const [entries, setEntries] = useState<JourneyEntry[]>(() => {
    return readJsonStorage(STORAGE_KEYS.entries, INITIAL_ENTRIES);
  });

  const [checkpoints, setCheckpoints] = useState<CEQHSReviewCheckpoint[]>(CEQHS_REVIEW_CHECKPOINTS);

  // Multi-Tenant Platform State
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    return readJsonStorage(STORAGE_KEYS.tenants, INITIAL_TENANTS);
  });

  const [tenantUsers, setTenantUsers] = useState<TenantUser[]>(() => {
    return readJsonStorage(STORAGE_KEYS.tenantUsers, INITIAL_TENANT_USERS);
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return readPersistedString(STORAGE_KEYS.activeTenantId) || (INITIAL_TENANTS[0]?.id || '');
  });

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    return readJsonStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
  });

  const handleResetAllData = () => {
    setEntries(INITIAL_ENTRIES);
    setGameProgress(INITIAL_GAME_PROGRESS);
    setCheckpoints(CEQHS_REVIEW_CHECKPOINTS);
    setTenants(INITIAL_TENANTS);
    setTenantUsers(INITIAL_TENANT_USERS);
    setNotifications([]);
    setActiveTenantId(INITIAL_TENANTS[0]?.id || '');
    setCurrentUserKey('maya');
    setCurrentTab('home');
    setSelectedThemeIdForView('empathetic-discipline');
    setActiveUser(MOCK_USERS.maya);
    setActivePortalRole('ceqhs');
    setIsAuthenticated(true);
    persistActiveTenantId(INITIAL_TENANTS[0]?.id || '');
    persistPortalRole('ceqhs');
  };

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  // Capture modal state
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [captureInitialType, setCaptureInitialType] = useState<EntryType>('moment');
  const [captureInitialThemeId, setCaptureInitialThemeId] = useState<string | undefined>(undefined);
  const [captureInitialPrompt, setCaptureInitialPrompt] = useState<string | undefined>(undefined);
  const [captureInitialTitle, setCaptureInitialTitle] = useState<string | undefined>(undefined);
  const [captureInitialCompetency, setCaptureInitialCompetency] = useState<string | undefined>(undefined);
  const [captureInitialGoalId, setCaptureInitialGoalId] = useState<string | undefined>(undefined);
  const [selectedThemeIdForView, setSelectedThemeIdForView] = useState<string>('empathetic-discipline');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Fetch or create user profile in Firestore
        const profile = await fetchUserProfileFromFirestore(user.uid);
        if (profile) {
          setActiveUser(profile);
        } else {
          const newProfile: User = {
            id: user.uid,
            name: user.displayName || 'Educator',
            email: user.email || '',
            role: 'educator',
            schoolId: 'sch-st-jude',
            schoolName: 'St. Jude Academy',
            academicYear: '2026–27',
            title: 'Middle School Educator',
            avatarUrl: user.photoURL || undefined,
            settings: DEFAULT_USER_SETTINGS,
            intention: 'Hold the curious pause before correcting.',
          };
          setActiveUser(newProfile);
          await saveUserProfileToFirestore(newProfile);
        }

        // Fetch user game progress from Firestore
        const savedProgress = await fetchGameProgressFromFirestore(user.uid);
        if (savedProgress) {
          setGameProgress(savedProgress);
        } else {
          const initUserProgress: GameProgressState = {
            ...INITIAL_GAME_PROGRESS,
            userId: user.uid,
          };
          setGameProgress(initUserProgress);
          await saveGameProgressToFirestore(initUserProgress);
        }

        // Fetch cloud journey entries
        const cloudEntries = await fetchJourneyEntriesFromFirestore(user.uid);
        if (cloudEntries && cloudEntries.length > 0) {
          setEntries((prev) => {
            const existingIds = new Set(cloudEntries.map((c) => c.id));
            const merged = [...cloudEntries, ...prev.filter((p) => !existingIds.has(p.id))];
            return merged;
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save entries to localStorage & Firestore if signed in
  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.entries, entries);
  }, [entries]);

  // Save game progress to localStorage
  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.gameProgress, gameProgress);
  }, [gameProgress]);

  const handleUpdateGameProgress = (newProgress: GameProgressState) => {
    setGameProgress(newProgress);
    if (firebaseUser) {
      saveGameProgressToFirestore({
        ...newProgress,
        userId: firebaseUser.uid,
      });
    }
  };

  const handleUpdateUserProfile = (updated: User) => {
    setActiveUser(updated);
  };

  const handleSwitchDemoUser = (userKey: string) => {
    setCurrentUserKey(userKey);
    const selected = MOCK_USERS[userKey] || MOCK_USERS.maya;
    setActiveUser(selected);
  };

  const handleOpenCapture = (
    type: EntryType = 'moment',
    themeId?: string,
    prompt?: string,
    title?: string,
    competency?: string,
    goalId?: string
  ) => {
    setCaptureInitialType(type);
    setCaptureInitialThemeId(themeId);
    setCaptureInitialPrompt(prompt);
    setCaptureInitialTitle(title);
    setCaptureInitialCompetency(competency);
    setCaptureInitialGoalId(goalId);
    setIsCaptureModalOpen(true);
  };

  const handleSaveEntry = async (newEntry: JourneyEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
    if (firebaseUser) {
      await saveJourneyEntryToFirestore(firebaseUser.uid, newEntry);
    }
    // Celebrate daily reflection consistency!
    triggerStreakFirework();
  };

  const handleToggleDossierInclusion = (entryId: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, includedInDossier: !e.includedInDossier } : e
      )
    );
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedThemeIdForView(themeId);
    setCurrentTab('themes');
  };

  const handleAddReviewFeedback = (notes: string) => {
    const newCheckpoint: CEQHSReviewCheckpoint = {
      id: `chk-${Date.now()}`,
      date: 'Today',
      reviewerName: `${activeUser.name} (CEQHS Anchor Team)`,
      milestone: 'Ongoing Developmental Check-in',
      status: 'Completed',
      stage: 'Reflect',
      notes: notes,
      strengthsObserved: ['Strong intentional pause demonstrated in recent advisory debriefs'],
      inquiriesForSchool: ['What is the faculty noticing about peer-to-peer restorative culture?'],
    };
    setCheckpoints((prev) => [newCheckpoint, ...prev]);

    // Dispatch feedback notification to the school cohort
    const feedbackNotif: AppNotification = {
      id: `notif-fb-${Date.now()}`,
      type: 'dossier_feedback',
      title: 'New Facilitator Review Feedback',
      message: `${activeUser.name} left inquiry feedback on ${activeTenant?.name || 'Oakridge Secondary'}'s living dossier.`,
      timestamp: 'Just now',
      read: false,
      recipientRole: 'coordinator',
      tenantId: activeTenantId,
      feedbackAuthor: activeUser.name,
      feedbackQuote: notes,
      actionLabel: 'Review Feedback',
      actionTab: 'dossier',
    };
    setNotifications((prev) => [feedbackNotif, ...prev]);
  };

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  // Handle Tenant selection
  const handleSelectTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
    persistActiveTenantId(tenantId);
    const tenant = tenants.find((t) => t.id === tenantId);
    if (tenant) {
      setActiveUser((prev) => ({
        ...prev,
        schoolId: tenant.id,
        schoolName: tenant.name,
      }));
    }
  };

  // Handle Tenant creation
  const handleCreateTenant = (newTenantData: Omit<Tenant, 'id' | 'createdAt' | 'pillars' | 'dossierProgress'>) => {
    const newId = `tenant-${Date.now()}`;
    const newTenant: Tenant = {
      ...newTenantData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      dossierProgress: 15,
      pillars: [
        { id: 'relational-safety', name: 'Relational Safety & Micro-Pauses', completedItems: 2, totalRequired: 10 },
        { id: 'restorative-circles', name: 'Restorative Circles & Regulated Dialogue', completedItems: 1, totalRequired: 8 },
        { id: 'student-voice', name: 'Authentic Student Voice & Listening', completedItems: 1, totalRequired: 8 },
        { id: 'emotional-agility', name: 'Educator Emotional Agility & Self-Care', completedItems: 1, totalRequired: 6 },
      ],
    };
    const updated = [...tenants, newTenant];
    setTenants(updated);
    writeJsonStorage(STORAGE_KEYS.tenants, updated);

    // Also automatically create the lead school admin user for this new tenant
    const adminUser: TenantUser = {
      id: `user-${Date.now()}-admin`,
      tenantId: newId,
      tenantName: newTenant.name,
      name: newTenant.leadAdminName,
      email: newTenant.leadAdminEmail,
      role: 'school_admin',
      title: 'Principal & School Administrator',
      department: 'School Leadership',
      competencyFocus: 'Give Yourself (Purpose & Climate)',
      joinedDate: new Date().toISOString().split('T')[0],
      activeEntriesCount: 1,
      avatarInitials: newTenant.leadAdminName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    const updatedUsers = [...tenantUsers, adminUser];
    setTenantUsers(updatedUsers);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updatedUsers);

    // Auto-select newly created tenant
    handleSelectTenant(newId);
  };

  // Handle User creation for Tenant
  const handleCreateTenantUser = (newUserData: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>) => {
    const tenant = tenants.find((t) => t.id === newUserData.tenantId);
    const initialStatus =
      newUserData.status ||
      (newUserData.role === 'teacher' ? 'pending_approval' : 'active');

    const newUser: TenantUser = {
      ...newUserData,
      status: initialStatus,
      requestedAt: initialStatus === 'pending_approval' ? 'Today' : undefined,
      id: `user-${Date.now()}`,
      tenantName: tenant ? tenant.name : 'School Tenant',
      joinedDate: new Date().toISOString().split('T')[0],
      activeEntriesCount: 0,
      avatarInitials: newUserData.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    const updated = [...tenantUsers, newUser];
    setTenantUsers(updated);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updated);
  };

  // Approve & Open Teacher Account from School Dashboard
  const handleApproveTeacherUser = (userId: string) => {
    const teacher = tenantUsers.find((u) => u.id === userId);
    const tenant = tenants.find((t) => t.id === (teacher?.tenantId || activeTenantId)) || tenants[0];

    const updated = tenantUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: 'active' as const,
          approvedAt: new Date().toISOString().split('T')[0],
          approvedBy: activeUser.name || 'Arthur Vance (Coordinator)',
        };
      }
      return u;
    });
    setTenantUsers(updated);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updated);

    if (teacher) {
      const newNotif: AppNotification = {
        id: `notif-approved-${Date.now()}`,
        type: 'account_approved',
        title: `Account Activated: ${teacher.name}`,
        message: `Account for ${teacher.name} (${teacher.email}) is OPEN. Welcome email and credentials sent.`,
        timestamp: 'Just now',
        read: false,
        recipientEmail: teacher.email,
        tenantId: teacher.tenantId,
        simulatedEmail: {
          id: `email-${Date.now()}`,
          subject: `Welcome to ${tenant.name} — Your CEQHS Educator Account is Activated`,
          fromName: activeUser.name || 'Arthur Vance',
          fromEmail: activeUser.email || 'coordinator@oakridge.edu',
          toName: teacher.name,
          toEmail: teacher.email,
          schoolName: tenant.name,
          sentAt: 'Just now',
          previewSnippet: `Your educator account is active. Log in with your email to begin your Living Journey.`,
          bodyText: `Your account for the CEQHS Living Journey is ready. We are excited to have you document classroom pauses, student moments, and relational safety practices this term.`,
          temporaryPassword: 'password',
          competencyFocus: teacher.competencyFocus || 'Know Yourself (Emotional Literacy)',
        },
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Bulk Teacher Enrollment via CSV
  const handleBulkEnrollTeachers = (
    newTeachersData: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>[],
    autoActivate: boolean,
    sendWelcomeEmail: boolean
  ) => {
    const tenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];
    const createdUsers: TenantUser[] = newTeachersData.map((data, idx) => ({
      ...data,
      id: `user-bulk-${Date.now()}-${idx}`,
      tenantName: tenant.name,
      joinedDate: new Date().toISOString().split('T')[0],
      activeEntriesCount: 0,
      avatarInitials: data.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      status: autoActivate ? ('active' as const) : ('pending_approval' as const),
      approvedAt: autoActivate ? new Date().toISOString().split('T')[0] : undefined,
      approvedBy: autoActivate ? activeUser.name || 'Arthur Vance' : undefined,
    }));

    const updatedUsers = [...tenantUsers, ...createdUsers];
    setTenantUsers(updatedUsers);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updatedUsers);

    const newNotifications: AppNotification[] = [];

    // Summary notification
    newNotifications.push({
      id: `notif-bulk-${Date.now()}`,
      type: 'bulk_enrolled',
      title: `Bulk Enrollment: ${createdUsers.length} Educators Provisioned`,
      message: `${createdUsers.length} educators were provisioned for ${tenant.name}. Accounts are ${
        autoActivate ? 'active & open' : 'queued for review'
      }.`,
      timestamp: 'Just now',
      read: false,
      recipientRole: 'coordinator',
      tenantId: activeTenantId,
    });

    if (sendWelcomeEmail) {
      createdUsers.forEach((teacher) => {
        newNotifications.push({
          id: `notif-email-${teacher.id}`,
          type: 'account_approved',
          title: `Welcome Dispatch: ${teacher.name}`,
          message: `Simulated welcome email sent to ${teacher.email} with sign-in credentials and EQ guidance.`,
          timestamp: 'Just now',
          read: false,
          recipientEmail: teacher.email,
          tenantId: activeTenantId,
          simulatedEmail: {
            id: `email-${teacher.id}`,
            subject: `Welcome to ${tenant.name} — Your CEQHS Educator Account is Activated`,
            fromName: activeUser.name || 'Arthur Vance',
            fromEmail: activeUser.email || 'coordinator@oakridge.edu',
            toName: teacher.name,
            toEmail: teacher.email,
            schoolName: tenant.name,
            sentAt: 'Just now',
            previewSnippet: `Your educator account for ${tenant.name} is now open.`,
            bodyText: `Welcome to the ${tenant.name} faculty cohort for the CEQHS Living Journey. Your department (${
              teacher.department || 'General Faculty'
            }) is focusing on ${
              teacher.competencyFocus || 'Know Yourself'
            }. You may log in directly with your email to start documenting your classroom moments.`,
            temporaryPassword: 'password',
            competencyFocus: teacher.competencyFocus,
          },
        });
      });
    }

    setNotifications((prev) => [...newNotifications, ...prev]);
  };

  const handleSuspendTeacherUser = (userId: string) => {
    const updated = tenantUsers.map((u) => {
      if (u.id === userId) {
        const nextStatus: 'active' | 'suspended' =
          u.status === 'suspended' ? 'active' : 'suspended';
        return {
          ...u,
          status: nextStatus,
        };
      }
      return u;
    });
    setTenantUsers(updated);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updated);
  };

  const handleRejectTeacherUser = (userId: string) => {
    const updated = tenantUsers.filter((u) => u.id !== userId);
    setTenantUsers(updated);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updated);
  };

  // Launch directly into an Educator's workspace from the school dashboard
  const handleLaunchTeacherWorkspace = (targetTeacher: TenantUser) => {
    // If account was pending, open it immediately
    if (targetTeacher.status === 'pending_approval') {
      handleApproveTeacherUser(targetTeacher.id);
    }
    setActiveTenantId(targetTeacher.tenantId);
    persistActiveTenantId(targetTeacher.tenantId);
    setActivePortalRole('teacher');
    persistPortalRole('teacher');

    setActiveUser({
      id: targetTeacher.id,
      name: targetTeacher.name,
      email: targetTeacher.email,
      role: 'educator',
      schoolId: targetTeacher.tenantId,
      schoolName: targetTeacher.tenantName,
      academicYear: activeTenant?.academicYear || '2026–27',
      title: targetTeacher.title,
      settings: DEFAULT_USER_SETTINGS,
    });
    setCurrentTab('home');
  };

  // Impersonate / switch to a specific Tenant User
  const handleImpersonateTenantUser = (targetUser: TenantUser) => {
    setActiveTenantId(targetUser.tenantId);
    persistActiveTenantId(targetUser.tenantId);

    const appRole = targetUser.role === 'school_admin' ? 'admin' : targetUser.role === 'coordinator' ? 'coordinator' : 'educator';
    setActiveUser((prev) => ({
      ...prev,
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: appRole,
      title: targetUser.title,
      schoolId: targetUser.tenantId,
      schoolName: targetUser.tenantName,
    }));
    setCurrentUserKey(targetUser.id);
  };

  const currentTheme = THEMES.find((t) => t.id === selectedThemeIdForView) || THEMES[0];
  const userSettings = activeUser.settings || DEFAULT_USER_SETTINGS;

  const handleLoginSuccess = (
    _user: string,
    role?: 'ceqhs' | 'school_admin' | 'teacher',
    tenantId?: string,
    registeredUser?: any
  ) => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem(STORAGE_KEYS.authSession, 'active');
      sessionStorage.setItem(STORAGE_KEYS.authSession, 'active');
    } catch {}

    if (registeredUser) {
      setActiveUser({
        id: `user-${Date.now()}`,
        name: registeredUser.name,
        email: registeredUser.email,
        role:
          registeredUser.role === 'school_admin'
            ? 'admin'
            : registeredUser.role === 'admin'
            ? 'admin'
            : 'educator',
        schoolId: registeredUser.tenantId || 'tenant-a-oakridge',
        schoolName:
          tenants.find((t) => t.id === registeredUser.tenantId)?.name ||
          'Oakridge Secondary School',
        academicYear: '2026–27',
        title: registeredUser.title,
        settings: DEFAULT_USER_SETTINGS,
      });
      if (registeredUser.tenantId) {
        setActiveTenantId(registeredUser.tenantId);
        persistActiveTenantId(registeredUser.tenantId);
      }
      setCurrentTab(
        registeredUser.role === 'school_admin'
          ? 'school'
          : registeredUser.role === 'admin'
          ? 'tenants'
          : 'home'
      );
      return;
    }

    if (tenantId) {
      setActiveTenantId(tenantId);
      persistActiveTenantId(tenantId);
    }

    const currentSchoolTenant =
      tenants.find((t) => t.id === (tenantId || activeTenantId)) || tenants[0];

    if (role === 'ceqhs') {
      const isSaugat = !_user || _user.toLowerCase().includes('saugat') || _user.toLowerCase().includes('admin') || _user.toLowerCase().includes('ceqhs') || _user.toLowerCase().includes('swataha') || _user.toLowerCase().includes('owner');
      const resolvedName = isSaugat ? 'Saugat Singh' : (_user.includes('@') ? _user.split('@')[0] : _user);
      const resolvedEmail = isSaugat ? 'saugat.swataha@gmail.com' : (_user.includes('@') ? _user : 'saugat.swataha@gmail.com');

      setActiveUser({
        id: 'user-saugat-singh',
        name: resolvedName,
        email: resolvedEmail,
        role: 'admin',
        schoolId: 'ceqhs-central',
        schoolName: 'CEQHS Global Learning Consortium',
        academicYear: '2026–27',
        title: 'Founder & Lead Program Architect',
        settings: DEFAULT_USER_SETTINGS,
      });
      setCurrentTab('tenants');
    } else if (role === 'school_admin') {
      const adminUser = tenantUsers.find(
        (u) =>
          u.tenantId === currentSchoolTenant.id && u.role === 'school_admin'
      );
      setActiveUser({
        id: adminUser ? adminUser.id : 'user-admin-school',
        name: adminUser ? adminUser.name : currentSchoolTenant.leadAdminName,
        email: adminUser ? adminUser.email : currentSchoolTenant.leadAdminEmail,
        role: 'admin',
        schoolId: currentSchoolTenant.id,
        schoolName: currentSchoolTenant.name,
        academicYear: currentSchoolTenant.academicYear,
        title: adminUser
          ? adminUser.title
          : 'Principal & School Administrator',
        settings: DEFAULT_USER_SETTINGS,
      });
      setCurrentTab('school');
    } else if (role === 'teacher') {
      const teacherUser = tenantUsers.find(
        (u) =>
          u.tenantId === currentSchoolTenant.id && u.role === 'educator'
      );
      setActiveUser({
        id: teacherUser ? teacherUser.id : 'user-teacher',
        name: teacherUser ? teacherUser.name : 'Maya Lin',
        email: teacherUser ? teacherUser.email : 'maya.lin@oakridge.edu',
        role: 'educator',
        schoolId: currentSchoolTenant.id,
        schoolName: currentSchoolTenant.name,
        academicYear: currentSchoolTenant.academicYear,
        title: teacherUser ? teacherUser.title : 'Middle School Educator',
        settings: DEFAULT_USER_SETTINGS,
      });
      setCurrentTab('home');
    }

    const effectiveRole = role || 'ceqhs';
    setActivePortalRole(effectiveRole);
    persistPortalRole(effectiveRole);
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        tenants={tenants}
        tenantUsers={tenantUsers}
        onRegisterUser={handleCreateTenantUser}
        onApproveUser={handleApproveTeacherUser}
      />
    );
  }

  // 1. CEQHS USER DASHBOARD EXPERIENCE
  if (activePortalRole === 'ceqhs') {
    return (
      <CeqhsUserPortal
        onSignOut={handleLogout}
        onSwitchToSchoolAdmin={(tenantId) => {
          handleSelectTenant(tenantId);
          setActivePortalRole('school_admin');
          setCurrentTab('school');
          persistPortalRole('school_admin');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#252525] flex flex-col lg:flex-row antialiased selection:bg-[#EAF0EB] selection:text-[#252525]">
      {/* Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentUser={activeUser}
        onSwitchUser={handleSwitchDemoUser}
        allUsers={MOCK_USERS}
        onOpenCaptureModal={() => handleOpenCapture('moment')}
        firebaseUser={firebaseUser}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        onSwitchToCeqhsPortal={() => {
          setActivePortalRole('ceqhs');
          persistPortalRole('ceqhs');
        }}
        activeTenantName={activeTenant?.name}
        activeTenantCode={activeTenant?.code}
        unreadNotificationCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-12 overflow-x-hidden">
        {/* Tab 1: HOME */}
        {currentTab === 'home' && (
          <EducatorDashboard
            currentUser={activeUser}
            phases={JOURNEY_PHASES}
            currentTheme={currentTheme}
            entries={entries}
            calendarEvents={CALENDAR_EVENTS}
            onOpenCapture={handleOpenCapture}
            onSelectTheme={handleSelectTheme}
            onNavigateTab={setCurrentTab}
            gameProgress={gameProgress}
          />
        )}

        {/* Tab 2: DYNAMIC DIFFICULTY ADJUSTMENT GAME SIMULATOR */}
        {currentTab === 'simulator' && (
          <DDAGameSimulator
            gameProgress={gameProgress}
            onUpdateGameProgress={handleUpdateGameProgress}
            userSettings={userSettings}
            onOpenSettings={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Tab 2.5: ACHIEVEMENTS & MILESTONES LEDGER */}
        {currentTab === 'achievements' && (
          <Achievements
            currentUser={activeUser}
            gameProgress={gameProgress}
            onNavigateToSimulator={() => setCurrentTab('simulator')}
          />
        )}

        {/* Tab 3: MY JOURNEY */}
        {currentTab === 'journey' && (
          <MyJourneyTimeline
            entries={entries}
            currentUser={activeUser}
            onOpenCapture={handleOpenCapture}
            onToggleDossierInclusion={handleToggleDossierInclusion}
            beforeNowShifts={BEFORE_NOW_SHIFTS}
          />
        )}

        {/* Tab 4: MOMENTS */}
        {currentTab === 'moments' && (
          <MomentsThatMattered
            entries={entries}
            currentUser={activeUser}
            onOpenCapture={(cat?: MomentCategory) => handleOpenCapture('moment')}
            onToggleDossierInclusion={handleToggleDossierInclusion}
          />
        )}

        {/* Tab 5: THEMES */}
        {currentTab === 'themes' && (
          <ThemesLibrary
            themes={THEMES}
            selectedThemeId={selectedThemeIdForView}
            onOpenCaptureForTheme={(tId, type) => handleOpenCapture(type, tId)}
          />
        )}

        {/* Tab 6: CALENDAR */}
        {currentTab === 'calendar' && (
          <JourneyCalendar events={CALENDAR_EVENTS} />
        )}

        {/* Tab 7: RESOURCES */}
        {currentTab === 'resources' && (
          <ResourceLibrary resources={RESOURCE_LIBRARY} />
        )}

        {/* Tab 8: DOSSIER */}
        {currentTab === 'dossier' && (
          <DossierView
            chapters={DOSSIER_CHAPTERS}
            entries={entries}
            beforeNowShifts={BEFORE_NOW_SHIFTS}
            signals={SCHOOL_SIGNALS}
            currentUser={activeUser}
            activeTenant={activeTenant}
          />
        )}

        {/* Tab 8.5: TENANT & USER MANAGEMENT (DOSSIER DEVELOPMENT) */}
        {currentTab === 'tenants' && (
          <TenantManagementHub
            tenants={tenants}
            tenantUsers={tenantUsers}
            activeTenantId={activeTenantId}
            onSelectTenant={handleSelectTenant}
            onCreateTenant={handleCreateTenant}
            onCreateUser={handleCreateTenantUser}
            onNavigateToDossier={(tenantId) => {
              handleSelectTenant(tenantId);
              setCurrentTab('dossier');
            }}
            onImpersonateUser={handleImpersonateTenantUser}
            currentUser={activeUser}
          />
        )}

        {/* Tab 8.8: IMPACT & EVIDENCE PORTAL (CEQHS METRICS MANUAL) */}
        {currentTab === 'impact-evidence' && (
          <ImpactEvidencePortal
            currentUser={activeUser}
            activeTenant={activeTenant}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* Tab 9: SCHOOL COORDINATOR */}
        {currentTab === 'school' && (
          <SchoolCoordinatorDashboard
            currentUser={activeUser}
            signals={SCHOOL_SIGNALS}
            entries={entries}
            phases={JOURNEY_PHASES}
            onNavigateTab={setCurrentTab}
            tenantUsers={tenantUsers}
            onApproveTeacher={handleApproveTeacherUser}
            onSuspendTeacher={handleSuspendTeacherUser}
            onRejectTeacher={handleRejectTeacherUser}
            onLaunchTeacher={handleLaunchTeacherWorkspace}
            onAddNewTeacher={handleCreateTenantUser}
            onBulkEnrollTeachers={handleBulkEnrollTeachers}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            activeTenant={activeTenant}
          />
        )}

        {/* Tab 10: CEQHS REVIEW WORKSPACE */}
        {currentTab === 'ceqhs-review' && (
          <CEQHSReviewWorkspace
            currentUser={activeUser}
            checkpoints={checkpoints}
            entries={entries}
            onAddReviewFeedback={handleAddReviewFeedback}
          />
        )}
      </main>

      {/* Universal Quick Capture Dialog */}
      <CaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onSaveEntry={handleSaveEntry}
        currentUser={activeUser}
        themes={THEMES}
        initialType={captureInitialType}
        initialThemeId={captureInitialThemeId}
        initialPrompt={captureInitialPrompt}
        initialTitle={captureInitialTitle}
        initialCompetency={captureInitialCompetency}
        initialGoalId={captureInitialGoalId}
      />

      {/* User Profile & Firebase Auth / Cloud Persistence Modal */}
      <AuthAndProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={activeUser}
        firebaseUser={firebaseUser}
        gameProgress={gameProgress}
        onUpdateUser={handleUpdateUserProfile}
        onResetAllData={handleResetAllData}
      />

      {/* Notification Center & Simulated Email Dispatches */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setIsNotificationsOpen(false);
        }}
        currentRole={activeUser.role}
        currentEmail={activeUser.email}
      />
    </div>
  );
}
