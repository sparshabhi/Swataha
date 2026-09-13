import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  LogIn,
  LogOut,
  Shield,
  Cloud,
  CheckCircle2,
  Sparkles,
  Settings,
  Award,
  AlertCircle,
  School,
  Flame,
  Clock,
  Sliders,
  Compass,
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  FirebaseUser,
} from '../lib/firebase';
import { User, UserSettings, GameProgressState } from '../types';
import { saveUserProfileToFirestore } from '../lib/firestoreService';

interface AuthAndProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  firebaseUser: FirebaseUser | null;
  gameProgress: GameProgressState;
  onUpdateUser: (updated: User) => void;
}

export const AuthAndProfileModal: React.FC<AuthAndProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  firebaseUser,
  gameProgress,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'achievements' | 'auth'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form states for profile
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [schoolName, setSchoolName] = useState(currentUser.schoolName);
  const [role, setRole] = useState(currentUser.role);
  const [academicYear, setAcademicYear] = useState(currentUser.academicYear);
  const [intention, setIntention] = useState(currentUser.intention || '');

  // Settings
  const [settings, setSettings] = useState<UserSettings>(
    currentUser.settings || {
      soundEnabled: true,
      timerMode: 'adaptive',
      ddaSensitivity: 'standard',
      preferredContext: 'whole_school',
      autoAdvance: false,
      themePreference: 'warm_ivory',
    }
  );

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const updatedProfile: User = {
        ...currentUser,
        id: user.uid,
        name: user.displayName || currentUser.name,
        email: user.email || currentUser.email,
        avatarUrl: user.photoURL || currentUser.avatarUrl,
      };
      onUpdateUser(updatedProfile);
      await saveUserProfileToFirestore(updatedProfile);
      setSaveMessage('Signed in with Google and synchronized profile!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setAuthError(err.message || 'Google Sign-In failed. Please check network/credentials.');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      let user: FirebaseUser;
      if (authMode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        user = cred.user;
      }

      const updatedProfile: User = {
        ...currentUser,
        id: user.uid,
        email: user.email || email,
        name: name || user.displayName || 'Educator',
      };
      onUpdateUser(updatedProfile);
      await saveUserProfileToFirestore(updatedProfile);
      setSaveMessage(authMode === 'register' ? 'Account created and saved!' : 'Logged in successfully!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      setAuthError(err.message || 'Authentication error.');
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setSaveMessage('Signed out securely.');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err) {
      console.error('Sign Out Error', err);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    const updatedUser: User = {
      ...currentUser,
      name,
      title,
      schoolName,
      role,
      academicYear,
      intention,
      settings,
    };
    onUpdateUser(updatedUser);

    const success = await saveUserProfileToFirestore(updatedUser);
    setIsSaving(false);
    if (success) {
      setSaveMessage('Profile & preferences saved to Firestore!');
    } else {
      setSaveMessage('Saved locally (Offline/Guest mode)');
    }
    setTimeout(() => setSaveMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252525]/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-2xl border border-stone-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F4F1EA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A6B53] text-white flex items-center justify-center shadow-xs">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-2xl text-[#252525] font-normal leading-tight">
                User Profile & Persistence
              </h2>
              <p className="text-xs text-stone-500">
                Manage your credentials, DDA settings, and Firestore synchronization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-stone-200 bg-white gap-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Educator Profile', icon: UserIcon },
            { id: 'settings', label: 'DDA & Game Settings', icon: Sliders },
            { id: 'achievements', label: 'Achievements', icon: Award },
            { id: 'auth', label: 'Account & Sync', icon: Cloud },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#4A6B53] text-[#4A6B53]'
                    : 'border-transparent text-stone-500 hover:text-stone-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {saveMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#EAF0EB] border border-[#4A6B53]/30 text-xs text-[#4A6B53] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-stone-800">
          {/* TAB 1: EDUCATOR PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Professional Title / Role
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    School / Campus Name
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Platform Perspective Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                  >
                    <option value="educator">Educator (Classroom Teacher)</option>
                    <option value="coordinator">School Coordinator / Leader</option>
                    <option value="admin">CEQHS Reviewer / Anchor Facilitator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Annual Human Skills Intention
                </label>
                <textarea
                  rows={3}
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="e.g., Hold the curious pause before correcting; listen with my whole body..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                />
              </div>

              {/* Cloud Sync Status Indicator */}
              <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#4A6B53]" />
                  <span className="font-medium text-stone-700">
                    {firebaseUser
                      ? `Connected to Firestore as ${firebaseUser.email}`
                      : 'Running in Local Mode (Sign in to sync across devices)'}
                  </span>
                </div>
                {firebaseUser && (
                  <span className="text-[10px] uppercase font-bold text-[#4A6B53] bg-[#EAF0EB] px-2 py-0.5 rounded-sm">
                    Synced
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DDA & GAME SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-editorial text-xl text-stone-900 font-normal">
                  Dynamic Difficulty Adjustment (DDA) Engine
                </h3>
                <p className="text-xs text-stone-500">
                  The system continuously tunes scenario complexity and pause windows to match your flow channel.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  DDA Adaptation Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gentle', label: 'Gentle', desc: 'Gradual difficulty shifts' },
                    { id: 'standard', label: 'Standard', desc: 'Balanced real-time tuning' },
                    { id: 'aggressive', label: 'Responsive', desc: 'Rapid calibration' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, ddaSensitivity: lvl.id as any })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.ddaSensitivity === lvl.id
                          ? 'border-[#4A6B53] bg-[#EAF0EB] text-[#252525]'
                          : 'border-stone-200 bg-[#FAF9F5] text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{lvl.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Timer & Pacing Experience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'adaptive', label: 'Dynamic Timer', desc: 'Auto-adapts to your reaction pace' },
                    { id: 'zen', label: 'Zen Un-timed', desc: 'Unhurried contemplation' },
                    { id: 'timed', label: 'Fixed Blitz', desc: 'Constant 15s pressure' },
                  ].map((tm) => (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, timerMode: tm.id as any })
                      }
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.timerMode === tm.id
                          ? 'border-[#4A6B53] bg-[#EAF0EB] text-[#252525]'
                          : 'border-stone-200 bg-[#FAF9F5] text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="font-bold text-xs">{tm.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{tm.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-stone-900">
                    Somatic Co-regulation Audio Chimes
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Subtle acoustic bells during the Curious Pause breath window
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    setSettings({ ...settings, soundEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#4A6B53] cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-stone-900">
                    Auto-Advance to Next Scenario
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Automatically advance 4 seconds after reading pedagogical rationale
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoAdvance}
                  onChange={(e) =>
                    setSettings({ ...settings, autoAdvance: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#4A6B53] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS & GAME STATS */}
          {activeTab === 'achievements' && (
            <div className="space-y-5">
              {/* Performance Telemetry Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-center">
                  <div className="text-2xl font-editorial font-bold text-[#4A6B53]">
                    {gameProgress.dda.skillRating}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-0.5">
                    Skill Rating
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-center">
                  <div className="text-2xl font-editorial font-bold text-[#C88A2E]">
                    Tier {gameProgress.dda.currentTier}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-0.5">
                    Challenge Tier
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-center">
                  <div className="text-2xl font-editorial font-bold text-stone-900">
                    {gameProgress.dda.rollingSuccessRate}%
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-0.5">
                    Rolling Accuracy
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-center">
                  <div className="text-2xl font-editorial font-bold text-stone-900">
                    {gameProgress.dda.bestStreak}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mt-0.5">
                    Best Streak
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 block">
                  Earned Milestones & Badges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gameProgress.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        ach.unlocked
                          ? 'bg-[#FAF3E7] border-[#C88A2E]/40 text-stone-900'
                          : 'bg-white border-stone-200 text-stone-400 opacity-60'
                      }`}
                    >
                      <div className="text-2xl shrink-0 p-1.5 rounded-lg bg-stone-100">
                        {ach.icon}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {ach.title}
                          </span>
                          {ach.unlocked && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 uppercase">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-snug">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT & CLOUD SYNC */}
          {activeTab === 'auth' && (
            <div className="space-y-5">
              {firebaseUser ? (
                <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#EAF0EB] text-[#4A6B53] font-bold text-lg flex items-center justify-center border border-[#4A6B53]/30">
                      {firebaseUser.photoURL ? (
                        <img
                          src={firebaseUser.photoURL}
                          alt={firebaseUser.displayName || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        firebaseUser.email?.[0].toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {firebaseUser.displayName || 'Authenticated Educator'}
                      </div>
                      <div className="text-xs text-stone-500">{firebaseUser.email}</div>
                      <div className="text-[11px] text-[#4A6B53] font-semibold mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Cloud Firestore synchronization active</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      UID: <code className="text-[11px] text-stone-700">{firebaseUser.uid}</code>
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-300 transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Google Sign-in Hero */}
                  <div className="p-6 rounded-2xl bg-[#EAF0EB] border border-[#4A6B53]/30 space-y-3 text-center">
                    <Cloud className="w-8 h-8 text-[#4A6B53] mx-auto" />
                    <h3 className="font-editorial text-2xl text-stone-900 font-normal">
                      Connect with Google
                    </h3>
                    <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                      Securely identify yourself to synchronize your game skill progress, DDA flow history, and CEQHS journey records directly with Cloud Firestore.
                    </p>

                    <button
                      onClick={handleGoogleSignIn}
                      className="mt-3 px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2.5 mx-auto shadow-xs active:scale-[0.99]"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google Sign-In</span>
                    </button>
                  </div>

                  {/* Alternative Email/Password Form */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                        Or use Email & Password
                      </span>
                      <div className="text-xs">
                        <button
                          type="button"
                          onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                          className="text-[#4A6B53] font-semibold hover:underline"
                        >
                          {authMode === 'login' ? 'Need an account? Register' : 'Already have account? Login'}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="educator@school.edu"
                          className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
                        />
                      </div>

                      {authError && (
                        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{authError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-black transition-colors"
                      >
                        {authMode === 'register' ? 'Register Account' : 'Log In'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-[#F4F1EA] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile & Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
