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

type AppToast = {
  id: number;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
};

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
  const [toast, setToast] = useState<AppToast | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(false);

  const showToast = (type: AppToast['type'], title: string, message: string) => {
    const nextToast = { id: Date.now(), type, title, message };
    setToast(nextToast);
    window.setTimeout(() => {
      setToast((current) => (current?.id === nextToast.id ? null : current));
    }, 3000);
  };

  const transitionToTab = (nextTab: string) => {
    setIsAppLoading(true);
    setCurrentTab(nextTab);
    window.setTimeout(() => setIsAppLoading(false), 200);
  };

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
    transitionToTab('home');
    setSelectedThemeIdForView('empathetic-discipline');
    setActiveUser(MOCK_USERS.maya);
    setActivePortalRole('ceqhs');
    setIsAuthenticated(true);
    persistActiveTenantId(INITIAL_TENANTS[0]?.id || '');
    persistPortalRole('ceqhs');
    showToast('success', 'Data reset', 'The app data has been restored to the default state.');
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
    showToast('info', 'User switched', `${selected.name} is now active.`);
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
    triggerStreakFirework();
    showToast('success', 'Entry saved', 'Your reflection has been added to your living journey.');
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
    transitionToTab('themes');
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
    showToast('info', 'Feedback saved', 'Your review note has been added to the dossier.');
  };

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  // Handle Tenant selection
  const handleSelectTenant = (tenantId: string) => {
    setIsAppLoading(true);
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
    window.setTimeout(() => setIsAppLoading(false), 180);
    showToast('info', 'Tenant updated', 'The active tenant context has been switched.');
  };

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

    handleSelectTenant(newId);
    showToast('success', 'Tenant created', `${newTenant.name} is ready for onboarding.`);
  };

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
    showToast('success', 'User saved', `${newUser.name} has been added to the tenant.`);
  };

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

    showToast('success', 'Teacher approved', teacher ? `${teacher.name} is now active.` : 'The teacher account is now active.');
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsAuthenticated(false);
    showToast('info', 'Signed out', 'You have been signed out successfully.');
  };

  const handleLoginSuccess = (
    _user: string,
    role?: 'ceqhs' | 'school_admin' | 'teacher',
    tenantId?: string,
    registeredUser?: any
  ) => {
    setIsAppLoading(true);
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
        role: registeredUser.role === 'school_admin' ? 'admin' : registeredUser.role === 'admin' ? 'admin' : 'educator',
        schoolId: registeredUser.tenantId || 'tenant-a-oakridge',
        schoolName: tenants.find((t) => t.id === registeredUser.tenantId)?.name || 'Oakridge Secondary School',
        academicYear: '2026–27',
        title: registeredUser.title,
        settings: DEFAULT_USER_SETTINGS,
      });
      if (registeredUser.tenantId) {
        setActiveTenantId(registeredUser.tenantId);
        persistActiveTenantId(registeredUser.tenantId);
      }
      setCurrentTab(registeredUser.role === 'school_admin' ? 'school' : registeredUser.role === 'admin' ? 'tenants' : 'home');
      setActivePortalRole(registeredUser.role === 'school_admin' ? 'school_admin' : registeredUser.role === 'admin' ? 'school_admin' : 'teacher');
      persistPortalRole(registeredUser.role === 'school_admin' ? 'school_admin' : registeredUser.role === 'admin' ? 'school_admin' : 'teacher');
      showToast('success', 'Welcome back', `Signed in as ${registeredUser.name}.`);
      window.setTimeout(() => setIsAppLoading(false), 180);
      return;
    }

    if (tenantId) {
      setActiveTenantId(tenantId);
      persistActiveTenantId(tenantId);
    }

    const currentSchoolTenant = tenants.find((t) => t.id === (tenantId || activeTenantId)) || tenants[0];

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
      const adminUser = tenantUsers.find((u) => u.tenantId === currentSchoolTenant.id && u.role === 'school_admin');
      setActiveUser({
        id: adminUser ? adminUser.id : 'user-admin-school',
        name: adminUser ? adminUser.name : currentSchoolTenant.leadAdminName,
        email: adminUser ? adminUser.email : currentSchoolTenant.leadAdminEmail,
        role: 'admin',
        schoolId: currentSchoolTenant.id,
        schoolName: currentSchoolTenant.name,
        academicYear: currentSchoolTenant.academicYear,
        title: adminUser ? adminUser.title : 'Principal & School Administrator',
        settings: DEFAULT_USER_SETTINGS,
      });
      setCurrentTab('school');
    } else if (role === 'teacher') {
      const teacherUser = tenantUsers.find((u) => u.tenantId === currentSchoolTenant.id && u.role === 'educator');
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
    showToast('success', 'Signed in', `Welcome ${_user || 'back'}.`);
    window.setTimeout(() => setIsAppLoading(false), 180);
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
    showToast('info', 'User status updated', 'The teacher status has been changed.');
  };

  const handleRejectTeacherUser = (userId: string) => {
    const updated = tenantUsers.filter((u) => u.id !== userId);
    setTenantUsers(updated);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, updated);
    showToast('info', 'Teacher rejected', 'The teacher record has been removed from the active cohort.');
  };

  // Launch directly into an Educator's workspace from the school dashboard
  const handleLaunchTeacherWorkspace = (targetTeacher: TenantUser) => {
    if (targetTeacher.status === 'pending_approval') {
      handleApproveTeacherUser(targetTeacher.id);
    }
    setIsAppLoading(true);
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
    window.setTimeout(() => setIsAppLoading(false), 180);
    showToast('success', 'Teacher workspace', `${targetTeacher.name}'s workspace is now open.`);
  };

  const handleImpersonateTenantUser = (targetUser: TenantUser) => {
    setIsAppLoading(true);
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
    window.setTimeout(() => setIsAppLoading(false), 180);
    showToast('info', 'Impersonating user', `Viewing ${targetUser.name}'s context.`);
  };

  const handleBulkEnrollTeachers = (teacherInputs: Array<{ name: string; email: string; role: string; tenantId: string }>) => {
    const nextUsers = teacherInputs.map((teacher, index) => ({
      id: `bulk-${Date.now()}-${index}`,
      tenantId: teacher.tenantId,
      tenantName: tenants.find((t) => t.id === teacher.tenantId)?.name || 'School Tenant',
      name: teacher.name,
      email: teacher.email,
      role: teacher.role === 'school_admin' ? 'school_admin' : 'teacher',
      status: 'pending_approval' as const,
      title: 'New Educator',
      department: 'Faculty',
      competencyFocus: 'Know Yourself (Emotional Literacy)',
      joinedDate: new Date().toISOString().split('T')[0],
      activeEntriesCount: 0,
      avatarInitials: teacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    }));

    setTenantUsers((prev) => [...prev, ...nextUsers]);
    writeJsonStorage(STORAGE_KEYS.tenantUsers, [...tenantUsers, ...nextUsers]);
    showToast('success', 'Bulk enrollment', `${nextUsers.length} teacher account(s) have been queued.`);
  };

  const currentTheme = THEMES.find((t) => t.id === selectedThemeIdForView) || THEMES[0];
  const userSettings = activeUser.settings || DEFAULT_USER_SETTINGS;

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          tenants={tenants}
          tenantUsers={tenantUsers}
          onRegisterUser={handleCreateTenantUser}
          onApproveUser={handleApproveTeacherUser}
        />
        {toast && (
          <div className="fixed right-4 top-4 z-50 max-w-sm rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-sky-500'}`} />
              <div>
                <div className="font-semibold text-slate-900">{toast.title}</div>
                <div className="text-sm text-slate-600">{toast.message}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 1. CEQHS USER DASHBOARD EXPERIENCE
  if (activePortalRole === 'ceqhs') {
    return (
      <>
        <CeqhsUserPortal
          onSignOut={handleLogout}
          onSwitchToSchoolAdmin={(tenantId) => {
            handleSelectTenant(tenantId);
            setActivePortalRole('school_admin');
            setCurrentTab('school');
            persistPortalRole('school_admin');
            showToast('info', 'School admin view', 'You are now in the school admin workspace.');
          }}
        />
        {toast && (
          <div className="fixed right-4 top-4 z-50 max-w-sm rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-sky-500'}`} />
              <div>
                <div className="font-semibold text-slate-900">{toast.title}</div>
                <div className="text-sm text-slate-600">{toast.message}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#F8F7F3] text-[#252525] flex flex-col lg:flex-row antialiased selection:bg-[#EAF0EB] selection:text-[#252525]">
        <Navigation
          currentTab={currentTab}
          onSelectTab={transitionToTab}
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
            showToast('info', 'CEQHS portal', 'You are back in the CEQHS portal.');
          }}
          activeTenantName={activeTenant?.name}
          activeTenantCode={activeTenant?.code}
          unreadNotificationCount={notifications.filter((n) => !n.read).length}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 pb-24 lg:pb-12 overflow-x-hidden">
          {currentTab === 'home' && (
            <EducatorDashboard
              currentUser={activeUser}
              phases={JOURNEY_PHASES}
              currentTheme={currentTheme}
              entries={entries}
              calendarEvents={CALENDAR_EVENTS}
              onOpenCapture={handleOpenCapture}
              onSelectTheme={handleSelectTheme}
              onNavigateTab={transitionToTab}
              gameProgress={gameProgress}
            />
          )}

          {currentTab === 'simulator' && (
            <DDAGameSimulator
              gameProgress={gameProgress}
              onUpdateGameProgress={handleUpdateGameProgress}
              userSettings={userSettings}
              onOpenSettings={() => setIsProfileModalOpen(true)}
            />
          )}

          {currentTab === 'achievements' && (
            <Achievements
              currentUser={activeUser}
              gameProgress={gameProgress}
              onNavigateToSimulator={() => transitionToTab('simulator')}
            />
          )}

          {currentTab === 'journey' && (
            <MyJourneyTimeline
              entries={entries}
              currentUser={activeUser}
              onOpenCapture={handleOpenCapture}
              onToggleDossierInclusion={handleToggleDossierInclusion}
              beforeNowShifts={BEFORE_NOW_SHIFTS}
            />
          )}

          {currentTab === 'moments' && (
            <MomentsThatMattered
              entries={entries}
              currentUser={activeUser}
              onOpenCapture={(cat?: MomentCategory) => handleOpenCapture('moment')}
              onToggleDossierInclusion={handleToggleDossierInclusion}
            />
          )}

          {currentTab === 'themes' && (
            <ThemesLibrary
              themes={THEMES}
              selectedThemeId={selectedThemeIdForView}
              onOpenCaptureForTheme={(tId, type) => handleOpenCapture(type, tId)}
            />
          )}

          {currentTab === 'calendar' && (
            <JourneyCalendar events={CALENDAR_EVENTS} />
          )}

          {currentTab === 'resources' && (
            <ResourceLibrary resources={RESOURCE_LIBRARY} />
          )}

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
                transitionToTab('dossier');
              }}
              onImpersonateUser={handleImpersonateTenantUser}
              currentUser={activeUser}
            />
          )}

          {currentTab === 'impact-evidence' && (
            <ImpactEvidencePortal
              currentUser={activeUser}
              activeTenant={activeTenant}
              onNavigateTab={transitionToTab}
            />
          )}

          {currentTab === 'school' && (
            <SchoolCoordinatorDashboard
              currentUser={activeUser}
              signals={SCHOOL_SIGNALS}
              entries={entries}
              phases={JOURNEY_PHASES}
              onNavigateTab={transitionToTab}
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

          {currentTab === 'ceqhs-review' && (
            <CEQHSReviewWorkspace
              currentUser={activeUser}
              checkpoints={checkpoints}
              entries={entries}
              onAddReviewFeedback={handleAddReviewFeedback}
            />
          )}
        </main>

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

        <AuthAndProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={activeUser}
          firebaseUser={firebaseUser}
          gameProgress={gameProgress}
          onUpdateUser={handleUpdateUserProfile}
          onResetAllData={handleResetAllData}
        />

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
            transitionToTab(tab);
            setIsNotificationsOpen(false);
          }}
          currentRole={activeUser.role}
          currentEmail={activeUser.email}
        />
      </div>

      {toast && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-sky-500'}`} />
            <div>
              <div className="font-semibold text-slate-900">{toast.title}</div>
              <div className="text-sm text-slate-600">{toast.message}</div>
            </div>
          </div>
        </div>
      )}

      {isAppLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/15 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-800" />
            <span className="text-sm font-medium text-slate-700">Loading workspace...</span>
          </div>
        </div>
      )}
    </>
  );
}
