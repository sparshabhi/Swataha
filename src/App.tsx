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
} from './types';
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
import { CaptureModal } from './components/CaptureModal';
import { DDAGameSimulator } from './components/DDAGameSimulator';
import { Achievements } from './components/Achievements';
import { AuthAndProfileModal } from './components/AuthAndProfileModal';
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

export default function App() {
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
    const saved = localStorage.getItem('ceqhs_game_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved game progress', e);
      }
    }
    return INITIAL_GAME_PROGRESS;
  });

  // Journey Entries
  const [entries, setEntries] = useState<JourneyEntry[]>(() => {
    const saved = localStorage.getItem('ceqhs_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved entries', e);
      }
    }
    return INITIAL_ENTRIES;
  });

  const [checkpoints, setCheckpoints] = useState<CEQHSReviewCheckpoint[]>(CEQHS_REVIEW_CHECKPOINTS);

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
    localStorage.setItem('ceqhs_entries', JSON.stringify(entries));
  }, [entries]);

  // Save game progress to localStorage
  useEffect(() => {
    localStorage.setItem('ceqhs_game_progress', JSON.stringify(gameProgress));
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
  };

  const currentTheme = THEMES.find((t) => t.id === selectedThemeIdForView) || THEMES[0];
  const userSettings = activeUser.settings || DEFAULT_USER_SETTINGS;

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
      />

      {/* User Profile & Firebase Auth / Cloud Persistence Modal */}
      <AuthAndProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={activeUser}
        firebaseUser={firebaseUser}
        gameProgress={gameProgress}
        onUpdateUser={handleUpdateUserProfile}
      />
    </div>
  );
}
