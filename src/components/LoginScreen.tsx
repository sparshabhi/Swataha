import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Clock,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Lock,
  Unlock,
  UserCheck,
  Building2,
} from 'lucide-react';
import { CeqhsLogo } from './CeqhsLogo';
import { Tenant, TenantUser } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (
    username: string,
    role?: 'ceqhs' | 'school_admin' | 'teacher',
    tenantId?: string,
    registeredUser?: any
  ) => void;
  tenants?: Tenant[];
  tenantUsers?: TenantUser[];
  onRegisterUser?: (userData: any) => void;
  onApproveUser?: (userId: string) => void;
}

export type CeqhsRoleSelection = 'educator' | 'school_leader' | 'ceqhs_admin';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  tenants = [],
  tenantUsers = [],
  onRegisterUser,
  onApproveUser,
}) => {
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Registration selection state
  const [selectedRegRole, setSelectedRegRole] = useState<CeqhsRoleSelection>('educator');

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTenantId, setRegTenantId] = useState(tenants[0]?.id || 'tenant-a-oakridge');
  const [regPassword, setRegPassword] = useState('password');
  const [regSuccess, setRegSuccess] = useState(false);
  const [registeredPendingNotice, setRegisteredPendingNotice] = useState<{
    name: string;
    email: string;
    schoolName: string;
    tenantId: string;
  } | null>(null);

  // Pending user blocking modal state
  const [pendingApprovalUser, setPendingApprovalUser] = useState<TenantUser | null>(null);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);

  // Email validation check
  const isEmailEmpty = !email.trim();
  const showEmailRequired = touchedEmail && isEmailEmpty;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedEmail(true);
    setLoginError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail) {
      return;
    }

    if (!trimmedPass) {
      setLoginError('Password is required.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Determine role from email or defaults
      let determinedRole: 'ceqhs' | 'school_admin' | 'teacher' = 'teacher';
      let targetTenantId: string = tenants[0]?.id || 'tenant-a-oakridge';

      if (
        trimmedEmail.includes('admin') ||
        trimmedEmail.includes('ceqhs') ||
        trimmedEmail.includes('assessor') ||
        trimmedEmail.includes('swataha') ||
        trimmedEmail.includes('saugat') ||
        trimmedEmail.includes('singh')
      ) {
        determinedRole = 'ceqhs';
      } else if (
        trimmedEmail.includes('vance') ||
        trimmedEmail.includes('principal') ||
        trimmedEmail.includes('leader')
      ) {
        determinedRole = 'school_admin';
      } else {
        determinedRole = 'teacher';
      }

      // Check tenantUsers for existing account match
      const matchingUser = tenantUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (matchingUser) {
        // Enforce School Coordinator Gate: Pending teachers cannot log in until opened
        if (matchingUser.role === 'teacher' && matchingUser.status === 'pending_approval') {
          setIsLoading(false);
          setPendingApprovalUser(matchingUser);
          return;
        }

        determinedRole =
          matchingUser.role === 'school_admin'
            ? 'school_admin'
            : matchingUser.role === 'admin'
            ? 'ceqhs'
            : 'teacher';
        targetTenantId = matchingUser.tenantId;
      }

      const sessionData = {
        user: trimmedEmail,
        role: determinedRole,
        tenantId: determinedRole !== 'ceqhs' ? targetTenantId : undefined,
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem('ceqhs_auth_session', JSON.stringify(sessionData));
        localStorage.setItem('ceqhs_portal_role', determinedRole);
      } catch (err) {
        console.warn('Session save notice', err);
      }

      setIsLoading(false);
      onLoginSuccess(trimmedEmail, determinedRole, targetTenantId);
    }, 300);
  };

  // Quick fill helper for testers
  const handleQuickFill = (
    role: 'educator' | 'pending_teacher' | 'school_leader' | 'ceqhs_admin'
  ) => {
    setTouchedEmail(true);
    setLoginError(null);
    if (role === 'educator') {
      setEmail('maya.lin@oakridge.edu');
      setPassword('password');
    } else if (role === 'pending_teacher') {
      setEmail('hannah.wells@oakridge.edu');
      setPassword('password');
    } else if (role === 'school_leader') {
      setEmail('arthur.vance@oakridge.edu');
      setPassword('password');
    } else {
      setEmail('saugat.swataha@gmail.com');
      setPassword('password');
    }
  };

  const handleOpenRegister = () => {
    setRegisteredPendingNotice(null);
    setRegSuccess(false);
    setIsRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const schoolObj = tenants.find((t) => t.id === regTenantId);
    const schoolName = schoolObj?.name || 'Partner High School';

    if (selectedRegRole === 'educator') {
      const registeredTeacher = {
        name: regName.trim(),
        email: regEmail.trim(),
        role: 'educator',
        tenantId: regTenantId,
        title: 'Classroom Educator',
        status: 'pending_approval' as const,
        requestedAt: 'Today',
      };

      if (onRegisterUser) {
        onRegisterUser(registeredTeacher);
      }

      setRegisteredPendingNotice({
        name: regName.trim(),
        email: regEmail.trim(),
        schoolName,
        tenantId: regTenantId,
      });
      return;
    }

    const mappedRole =
      selectedRegRole === 'ceqhs_admin'
        ? 'school_admin'
        : selectedRegRole === 'school_leader'
        ? 'school_admin'
        : 'teacher';

    const registeredUser = {
      name: regName.trim(),
      email: regEmail.trim(),
      role: 'school_admin',
      tenantId: regTenantId,
      title:
        selectedRegRole === 'school_leader'
          ? 'Principal & School Coordinator'
          : 'CEQHS Quality Reviewer',
      status: 'active' as const,
    };

    if (onRegisterUser) {
      onRegisterUser(registeredUser);
    }

    setRegSuccess(true);
    setTimeout(() => {
      setIsRegisterModalOpen(false);
      setRegSuccess(false);
      onLoginSuccess(regEmail, mappedRole, regTenantId, registeredUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-[#252525] flex flex-col font-sans selection:bg-[#EAF0EB]">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP NAVBAR (CEQHS Original Branding)              */}
      {/* ---------------------------------------------------- */}
      <header className="w-full bg-white border-b border-stone-200">
        <div className="max-w-[960px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* CEQHS Official Brand Identity */}
          <div className="flex items-center gap-3">
            <CeqhsLogo size={40} />
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-editorial text-lg font-bold tracking-tight text-[#1B3626]">
                  CEQHS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EAF0EB] text-[#4A6B53]">
                  Living Journal
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium tracking-tight">
                Continuous Emotional Quality in High Schools
              </span>
            </div>
          </div>

          {/* Right Language Selector */}
          <div className="relative">
            <select
              aria-label="Select language"
              className="text-xs text-stone-700 bg-white border border-stone-300 rounded px-3 py-1.5 pr-8 appearance-none focus:outline-none focus:border-[#4A6B53] cursor-pointer shadow-2xs"
              defaultValue="en"
            >
              <option value="en">Select language</option>
              <option value="en-gb">English (UK)</option>
              <option value="en-us">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none"
            />
          </div>
        </div>

        {/* CEQHS Developmental Color Ribbon (Sage, Amber, Ocean, Teal, Forest) */}
        <div className="w-full h-[5px] flex">
          <div className="flex-1 bg-[#4A6B53]" title="Emotional Regulation" />
          <div className="flex-1 bg-[#D97706]" title="Empathy & Connection" />
          <div className="flex-1 bg-[#2563EB]" title="Classroom Dialogue" />
          <div className="flex-1 bg-[#0D9488]" title="Reflective Practice" />
          <div className="flex-1 bg-[#1B3626]" title="Institutional Quality" />
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN CONTAINER (Clean Two-Column Layout)          */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 w-full max-w-[960px] mx-auto px-4 py-8">
        {/* Banner: Panoramic school learning photo + Callout */}
        <div className="w-full mb-10 rounded-sm overflow-hidden shadow-xs border border-stone-200">
          <div className="relative w-full h-[180px] sm:h-[200px] flex items-center bg-stone-900">
            {/* Background Image: Educators & high school learners engaged in dialogue */}
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80"
              alt="Educators and students collaborating in school"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />

            {/* Right-aligned CEQHS Callout Box */}
            <div
              onClick={() => setIsStoryModalOpen(true)}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[350px] md:w-[390px] bg-[#234E37] hover:bg-[#1B3E2B] transition-colors cursor-pointer text-white p-6 flex flex-col justify-center shadow-lg group select-none"
              style={{
                clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)',
              }}
            >
              {/* Watermark in top right */}
              <div className="absolute right-4 top-4 text-white/25 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 pointer-events-none font-editorial">
                <span>CEQHS PORTAL</span>
              </div>

              <div className="pl-6 sm:pl-8">
                <h3 className="text-xl sm:text-2xl font-editorial font-bold leading-tight group-hover:translate-x-0.5 transition-transform">
                  Share your CEQHS story!
                </h3>
                <p className="mt-2 text-sm sm:text-base font-semibold underline underline-offset-2 flex items-center gap-1.5 text-white/95">
                  Click here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* ==================================================== */}
          {/* LEFT COLUMN: Login                                   */}
          {/* ==================================================== */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">Login</h2>

            <form onSubmit={handleLoginSubmit} noValidate>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  onBlur={() => setTouchedEmail(true)}
                  className={`w-full px-3 py-2 text-sm bg-white border rounded focus:outline-none transition-colors ${
                    showEmailRequired
                      ? 'border-red-500 focus:border-red-600'
                      : 'border-stone-300 focus:border-[#4A6B53]'
                  }`}
                  placeholder=""
                />
                {showEmailRequired && (
                  <p className="text-red-600 text-xs mt-1 font-normal">
                    Required field
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 pr-10 text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* General Login Error */}
              {loginError && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Forgot your password? link */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-[#2F6A4F] hover:underline focus:outline-none font-medium"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-[#4A6B53] hover:bg-[#3D5B45] active:bg-[#314B38] text-white font-medium py-2.5 px-4 rounded text-sm transition-colors text-center shadow-2xs focus:outline-none cursor-pointer"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>

              {/* Quick Demo Pre-fill Links for evaluators */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col gap-2 text-[11px] text-stone-500">
                <span className="font-semibold text-stone-700">Quick demo credentials:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('educator')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                    title="Active educator: logs in directly"
                  >
                    Educator (Maya Lin - Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('pending_teacher')}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium transition-colors flex items-center gap-1"
                    title="Self-registered teacher: awaiting school coordinator opening"
                  >
                    <Clock size={11} className="text-amber-600" />
                    <span>Pending Teacher (Hannah Wells)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('school_leader')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                    title="School Coordinator: opens teacher accounts & curates dossier"
                  >
                    School Leader (Arthur Vance)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('ceqhs_admin')}
                    className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded font-medium transition-colors"
                    title="Sign in as Saugat Singh, Founder & Lead Architect"
                  >
                    CEQHS Lead (Saugat Singh)
                  </button>
                </div>
              </div>
            </form>

            {/* Mobile App Download Note */}
            <p className="text-stone-600 text-xs text-center mt-8 leading-relaxed">
              You can also download our{' '}
              <span className="font-semibold text-stone-800">Educator App</span> to
              access the CEQHS Living Journal anytime, anywhere.
            </p>

            {/* App Store & Google Play Badges */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {/* App Store Badge */}
              <div className="flex flex-col items-center">
                <a
                  href="#app-store"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveInfoModal('ios');
                  }}
                  className="bg-black hover:bg-stone-800 text-white rounded-md px-3 py-1.5 flex items-center gap-2 transition-colors shadow-2xs"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.65-7.79-11.84-14.26-6.17-9.57-11.01-20.73-14.52-33.48-3.51-12.75-5.27-24.51-5.27-35.29 0-14.44 3.73-26.4 11.2-35.88 7.46-9.48 16.9-14.31 28.32-14.49 4.81 0 10.36 1.34 16.64 4.02 6.28 2.68 10.22 4.09 11.83 4.22 1.39-.24 5.48-1.74 12.28-4.5 6.79-2.76 12.44-3.95 16.94-3.57 12.63.76 22.84 5.39 30.62 13.9-11.02 6.64-16.39 15.75-16.12 27.33.24 9.17 3.79 16.91 10.66 23.23 6.87 6.32 14.86 10.02 23.97 11.11-2.02 6.23-4.44 12.2-7.24 17.9zm-38.35-103.5c0-6.73 2.45-12.98 7.34-18.75 4.9-5.77 11.06-9.39 18.49-10.87.24 1.13.36 2.15.36 3.06 0 6.6-2.6 13.01-7.81 19.22-5.2 6.21-11.45 9.77-18.74 10.68-.12-1.01-.24-2.12-.24-3.34z" />
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[9px] block text-stone-300">Download on the</span>
                    <span className="text-xs font-semibold text-white tracking-tight">
                      App Store
                    </span>
                  </div>
                </a>
                <span className="text-[10px] text-stone-500 mt-1">for iOS</span>
              </div>

              {/* Google Play Badge */}
              <div className="flex flex-col items-center">
                <a
                  href="#google-play"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveInfoModal('android');
                  }}
                  className="bg-black hover:bg-stone-800 text-white rounded-md px-3 py-1.5 flex items-center gap-2 transition-colors shadow-2xs"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5" viewBox="0 0 512 512">
                    <path
                      fill="#00F076"
                      d="M24.7 15.4C17.6 22.9 13.5 34.3 13.5 48.7v414.6c0 14.4 4.1 25.8 11.2 33.3l1.8 1.8 232.2-232.2v-5.6L26.5 13.6l-1.8 1.8z"
                    />
                    <path
                      fill="#FF3A44"
                      d="M336.1 313.5l-77.4-77.4v-5.6l77.4-77.4 1.8 1 91.8 52.2c26.2 14.9 26.2 39.2 0 54.1l-91.8 52.2-1.8.9z"
                    />
                    <path
                      fill="#00E6FF"
                      d="M258.7 236.1L24.7 498.4c8.7 9.2 23.2 10.3 39.4 1.1l273.8-155.6-79.2-79.2v-28.6z"
                    />
                    <path
                      fill="#FFD400"
                      d="M258.7 275.9l79.2-79.2L64.1 41.1c-16.2-9.2-30.7-8.1-39.4 1.1l234 233.7z"
                    />
                  </svg>
                  <div className="text-left leading-none">
                    <span className="text-[9px] block text-stone-300 uppercase tracking-wider">
                      GET IT ON
                    </span>
                    <span className="text-xs font-semibold text-white tracking-tight">
                      Google Play
                    </span>
                  </div>
                </a>
                <span className="text-[10px] text-stone-500 mt-1">for Android</span>
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: Not Registered?                        */}
          {/* ==================================================== */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">
              Not Registered?
            </h2>

            <p className="text-stone-700 text-xs sm:text-sm mb-4">
              Register a new account as:
            </p>

            {/* Radio Options List */}
            <div className="space-y-3.5">
              {/* Option 1: Educator / Teacher */}
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="radio"
                  name="registration_role"
                  value="educator"
                  checked={selectedRegRole === 'educator'}
                  onChange={() => setSelectedRegRole('educator')}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    selectedRegRole === 'educator'
                      ? 'border-[#4A6B53] bg-white'
                      : 'border-stone-400 group-hover:border-stone-600 bg-white'
                  }`}
                >
                  {selectedRegRole === 'educator' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" />
                  )}
                </div>
                <span className="text-sm font-normal text-stone-800 group-hover:text-stone-900">
                  Educator / Teacher
                </span>
              </label>

              {/* Option 2: School Leader / Coordinator */}
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="radio"
                  name="registration_role"
                  value="school_leader"
                  checked={selectedRegRole === 'school_leader'}
                  onChange={() => setSelectedRegRole('school_leader')}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    selectedRegRole === 'school_leader'
                      ? 'border-[#4A6B53] bg-white'
                      : 'border-stone-400 group-hover:border-stone-600 bg-white'
                  }`}
                >
                  {selectedRegRole === 'school_leader' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" />
                  )}
                </div>
                <span className="text-sm font-normal text-stone-800 group-hover:text-stone-900">
                  School Leader / Coordinator
                </span>
              </label>

              {/* Option 3: CEQHS Staff / Assessor */}
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="radio"
                  name="registration_role"
                  value="ceqhs_admin"
                  checked={selectedRegRole === 'ceqhs_admin'}
                  onChange={() => setSelectedRegRole('ceqhs_admin')}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    selectedRegRole === 'ceqhs_admin'
                      ? 'border-[#4A6B53] bg-white'
                      : 'border-stone-400 group-hover:border-stone-600 bg-white'
                  }`}
                >
                  {selectedRegRole === 'ceqhs_admin' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4A6B53]" />
                  )}
                </div>
                <span className="text-sm font-normal text-stone-800 group-hover:text-stone-900">
                  CEQHS Staff / Assessor
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={handleOpenRegister}
              className="w-full mt-8 bg-[#1B3626] hover:bg-[#2F4837] active:bg-[#152B1E] text-white font-medium py-2.5 px-4 rounded text-sm transition-colors text-center shadow-2xs focus:outline-none cursor-pointer"
            >
              Register
            </button>

            {/* Explanatory helper box */}
            <div className="mt-8 p-3.5 bg-stone-50 border border-stone-200 rounded text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-800 block mb-1">
                Account Types Guide:
              </span>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  <strong className="text-stone-700">Educator / Teacher:</strong> Individual
                  Living Journal for logging moments that mattered, classroom practices,
                  reflections, and competency evidence.
                </li>
                <li>
                  <strong className="text-stone-700">School Leader:</strong> Oversees
                  institutional milestones, teacher participation, school signals, and
                  dossier compilation.
                </li>
                <li>
                  <strong className="text-stone-700">CEQHS Staff:</strong> Reviews
                  school dossiers, verifies institutional evidence, and evaluates
                  accreditation readiness.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ---------------------------------------------------- */}
      {/* 3. FOOTER (CEQHS Branding)                           */}
      {/* ---------------------------------------------------- */}
      <footer className="w-full bg-[#EAEAEA] border-t border-stone-300 py-6 px-4 mt-auto">
        <div className="max-w-[960px] mx-auto flex flex-col items-center justify-center text-center text-xs text-stone-600 space-y-1.5">
          <p>
            © Copyright CEQHS · Continuous Emotional Quality in High Schools
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveInfoModal('terms')}
              className="text-[#2F6A4F] hover:underline"
            >
              Terms &amp; Conditions
            </button>
            <span className="text-stone-400">·</span>
            <button
              type="button"
              onClick={() => setActiveInfoModal('guides')}
              className="text-[#2F6A4F] hover:underline"
            >
              User Guides
            </button>
            <span className="text-stone-400">·</span>
            <button
              type="button"
              onClick={() => setActiveInfoModal('privacy')}
              className="text-[#2F6A4F] hover:underline"
            >
              Privacy Policy
            </button>
            <span className="text-stone-400">·</span>
            <button
              type="button"
              onClick={() => setActiveInfoModal('accreditation')}
              className="text-[#2F6A4F] hover:underline"
            >
              Accreditation Standards
            </button>
          </div>

          <div className="pt-2 text-[10px] text-stone-400 flex items-center justify-center gap-4">
            <span>API version: 2.28.0</span>
            <span>Web version: 2.28.0</span>
          </div>
        </div>
      </footer>

      {/* ==================================================== */}
      {/* MODALS                                               */}
      {/* ==================================================== */}

      {/* 1. Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-stone-800 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-stone-900 mb-1">
              Register as{' '}
              {selectedRegRole === 'educator'
                ? 'Educator / Teacher'
                : selectedRegRole === 'school_leader'
                ? 'School Leader / Coordinator'
                : 'CEQHS Staff / Assessor'}
            </h3>
            <p className="text-xs text-stone-500 mb-5">
              Create your CEQHS account to record classroom practices, reflections, and growth.
            </p>

            {registeredPendingNotice ? (
              <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                  <Clock size={28} className="text-amber-700 animate-pulse" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Awaiting School Coordinator Approval
                  </span>
                  <h4 className="text-lg font-editorial font-bold text-stone-900 mt-2">
                    Registration Received!
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-stone-900">{registeredPendingNotice.name}</strong>. Your educator profile is queued for <strong className="text-stone-900">{registeredPendingNotice.schoolName}</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-left text-xs text-amber-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-amber-900">
                    <KeyRound size={14} className="text-amber-700" />
                    <span>Campus Access Governance</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700">
                    To maintain school cohort verification, new teachers cannot log in as educators until their account is opened from the <strong>School Dashboard</strong> by their School Coordinator (Arthur Vance).
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      setRegisteredPendingNotice(null);
                      // Switch to school leader Arthur Vance for this tenant so tester can approve immediately!
                      onLoginSuccess(
                        'arthur.vance@oakridge.edu',
                        'school_admin',
                        registeredPendingNotice.tenantId
                      );
                    }}
                    className="w-full bg-[#1B3626] hover:bg-[#2F4837] text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Switch to School Dashboard (Review &amp; Open Account)</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterModalOpen(false);
                      setRegisteredPendingNotice(null);
                    }}
                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : regSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 size={42} className="mx-auto text-emerald-600 mb-2" />
                <h4 className="text-base font-semibold text-stone-900">
                  Account Created Successfully!
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Logging you into the platform now...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@school.edu"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Partner High School
                  </label>
                  <select
                    value={regTenantId}
                    onChange={(e) => setRegTenantId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:border-[#4A6B53]"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1B3626] hover:bg-[#2F4837] text-white font-medium py-2.5 rounded text-sm transition-colors cursor-pointer"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Pending Approval Blocking Modal */}
      {pendingApprovalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-stone-900 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setPendingApprovalUser(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-3.5">
              <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                <Lock size={26} className="text-amber-700" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Account Locked · Awaiting Opening
                </span>
                <h3 className="text-xl font-editorial font-bold text-stone-900 mt-2">
                  Account Not Yet Opened by School
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  The account for <strong className="text-stone-900">{pendingApprovalUser.name}</strong> ({pendingApprovalUser.email}) is registered with <strong className="text-stone-900">{pendingApprovalUser.tenantName}</strong>, but has not yet been opened in the School Dashboard.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-left text-xs text-stone-700 space-y-1.5">
                <span className="font-semibold text-stone-900 block">
                  Campus Verification Required:
                </span>
                <p className="text-[11px] leading-relaxed text-stone-600">
                  School coordinators open teacher accounts from the <em>School Dashboard &rarr; Teacher Accounts &amp; Access Approvals</em> section. Once opened, educators can log in directly.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const tenantId = pendingApprovalUser.tenantId;
                    setPendingApprovalUser(null);
                    onLoginSuccess(
                      'arthur.vance@oakridge.edu',
                      'school_admin',
                      tenantId
                    );
                  }}
                  className="w-full bg-[#1B3626] hover:bg-[#2F4837] text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound size={14} />
                  <span>Log in as School Coordinator (Arthur Vance) to Open</span>
                </button>

                {onApproveUser && (
                  <button
                    type="button"
                    onClick={() => {
                      onApproveUser(pendingApprovalUser.id);
                      const targetUser = pendingApprovalUser;
                      setPendingApprovalUser(null);
                      // Instantly log in as this educator
                      onLoginSuccess(targetUser.email, 'teacher', targetUser.tenantId);
                    }}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Unlock size={14} className="text-emerald-700" />
                    <span>Demo Shortcut: Approve &amp; Sign In Now</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setPendingApprovalUser(null)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-stone-800 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSubmitted(false);
              }}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-stone-900 mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your registered school email and we will send you a reset link.
            </p>

            {forgotSubmitted ? (
              <div className="py-4 text-center">
                <CheckCircle2 size={36} className="mx-auto text-emerald-600 mb-2" />
                <p className="text-xs font-medium text-stone-700">
                  If an account exists for {forgotEmail || 'this email'}, a password
                  reset link has been sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your-email@school.edu"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#4A6B53] hover:bg-[#3D5B45] text-white py-2 rounded text-xs font-medium"
                  >
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3. Share Your CEQHS Story Modal */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-stone-800 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#4A6B53]">
                Living Evidence
              </span>
            </div>
            <h3 className="text-xl font-editorial font-bold text-stone-900 mb-2">
              Share your CEQHS Journey Story!
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Every moment of emotional regulation, authentic dialogue, and relational
              trust in your classroom enriches our global research in school emotional
              quality.
            </p>

            <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 mb-4 text-xs text-stone-700 space-y-2">
              <p className="font-semibold text-stone-900">
                &ldquo;By practicing the 90-second pause before difficult class
                transitions, our 10th graders shifted from defensive tension to genuine
                inquiry. The Living Journal made this transformation visible to our
                entire department.&rdquo;
              </p>
              <p className="text-stone-500 text-[11px]">
                — Maya Lin, Humanities Educator at Oakridge High School
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Classroom Moment or Reflection Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Share how emotional quality transformed a moment in your school..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Thank you for sharing your reflection! Your submission will be included in the CEQHS Research Dossier.');
                    setIsStoryModalOpen(false);
                  }}
                  className="px-4 py-2 bg-[#1B3626] hover:bg-[#2F4837] text-white rounded text-xs font-medium"
                >
                  Submit Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Terms / Privacy / Guides modal */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-stone-800 relative">
            <button
              onClick={() => setActiveInfoModal(null)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-stone-900 mb-2 capitalize">
              {activeInfoModal === 'terms'
                ? 'CEQHS Terms & Conditions'
                : activeInfoModal === 'guides'
                ? 'User Guides & Accreditation Resources'
                : activeInfoModal === 'privacy'
                ? 'Privacy & Safeguarding Policy'
                : activeInfoModal === 'accreditation'
                ? 'CEQHS Accreditation Standards'
                : activeInfoModal === 'ios'
                ? 'Educator App for iOS'
                : 'Educator App for Android'}
            </h3>

            <div className="text-xs text-stone-600 leading-relaxed space-y-2 mb-4">
              {activeInfoModal === 'terms' && (
                <p>
                  Access to the CEQHS Living Journal is governed by licensed
                  institutional partner agreements. All classroom artifacts, reflections,
                  and student developmental indicators are treated as confidential
                  educational records.
                </p>
              )}
              {activeInfoModal === 'guides' && (
                <p>
                  Comprehensive onboarding and implementation guides are available for
                  teachers, school coordinators, and quality review committees across all
                  10 accreditation milestones.
                </p>
              )}
              {activeInfoModal === 'privacy' && (
                <p>
                  CEQHS strictly enforces student data safeguarding, FERPA/GDPR
                  compliance, and cryptographic hashing on all observational media. No
                  identifiable student information is shared externally without parental
                  consent.
                </p>
              )}
              {activeInfoModal === 'accreditation' && (
                <p>
                  CEQHS accreditation measures continuous emotional quality through a
                  10-chapter living dossier, triangulating teacher reflections, survey
                  sentiment shifts, and verified classroom artifacts.
                </p>
              )}
              {(activeInfoModal === 'ios' || activeInfoModal === 'android') && (
                <p>
                  The mobile companion app enables teachers to log moments that mattered,
                  record audio reflections, and upload classroom artifacts directly from
                  their mobile device.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveInfoModal(null)}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
