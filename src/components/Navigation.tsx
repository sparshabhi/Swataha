import React, { useState } from 'react';
import {
  Home,
  BookMarked,
  Sparkles,
  Compass,
  Calendar,
  FolderOpen,
  BookOpen,
  School,
  ShieldCheck,
  Plus,
  ChevronDown,
  UserCheck,
  Menu,
  X,
  HeartHandshake,
  Gamepad2,
  Cloud,
  User as UserIcon,
  Award,
  LogOut,
  Building2,
  Bell,
  BarChart3,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { FirebaseUser } from '../lib/firebase';
import { CeqhsLogo } from './CeqhsLogo';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  onSwitchUser: (userKey: string) => void;
  allUsers: Record<string, User>;
  onOpenCaptureModal: () => void;
  firebaseUser: FirebaseUser | null;
  onOpenProfileModal: () => void;
  onLogout?: () => void;
  onSwitchToCeqhsPortal?: () => void;
  activeTenantName?: string;
  activeTenantCode?: string;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenCaptureModal,
  firebaseUser,
  onOpenProfileModal,
  onLogout,
  onSwitchToCeqhsPortal,
  activeTenantName,
  activeTenantCode,
  unreadNotificationCount = 0,
  onOpenNotifications,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, badge: undefined },
    { id: 'simulator', label: 'Dilemma Challenge', icon: Gamepad2, badge: 'DDA' },
    { id: 'achievements', label: 'Achievements', icon: Award, badge: undefined },
    { id: 'journey', label: 'My Journey', icon: BookMarked, badge: undefined },
    { id: 'moments', label: 'Moments', icon: Sparkles, badge: 'Core' },
    { id: 'themes', label: 'Themes', icon: Compass, badge: undefined },
    { id: 'calendar', label: 'Calendar', icon: Calendar, badge: undefined },
    { id: 'resources', label: 'Resources', icon: FolderOpen, badge: undefined },
    { id: 'dossier', label: 'Our Dossier', icon: BookOpen, badge: 'Living' },
  ];

  const adminItems = [
    { id: 'impact-evidence', label: 'Impact & Evidence', icon: BarChart3, role: 'all', badge: 'Gr 1–5' },
    { id: 'tenants', label: 'Tenants & Users', icon: Building2, role: 'coordinator', badge: 'Platform' },
    { id: 'school', label: 'School Dashboard', icon: School, role: 'coordinator' },
    { id: 'ceqhs-review', label: 'CEQHS Review', icon: ShieldCheck, role: 'admin' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#F4F1EA] border-r border-stone-200 h-screen sticky top-0 shrink-0 select-none">
        {/* Brand Header with Official Logo */}
        <div className="p-4 border-b border-stone-200/80 bg-[#EFECE4]">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="https://ibb.co/8nxMTMnN"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png') {
                  target.src = 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png';
                } else if (target.src !== '/ceqhs-logo.png') {
                  target.src = '/ceqhs-logo.png';
                }
              }}
              alt="CEQHS Official Logo"
              style={{
                height: '55px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
                borderRadius: '0',
              }}
            />
            <div>
              <span className="font-editorial text-lg font-bold text-[#252525] tracking-tight block leading-tight">
                CEQHS Platform
              </span>
              <span className="text-[10px] text-[#4A6B53] font-semibold tracking-wide block">
                Learn · Practise · Reflect · Evidence · Grow
              </span>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-stone-200/90 flex items-center justify-between text-xs text-stone-600">
            <div className="truncate font-semibold text-stone-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span className="truncate">{activeTenantName || currentUser.schoolName}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-sm bg-amber-100/80 text-amber-900 border border-amber-200/60 text-[10px] font-mono font-bold shrink-0">
              {activeTenantCode || 'TENANT-A'}
            </span>
          </div>
        </div>

        {/* Quick Add & Notifications CTA */}
        <div className="p-4 border-b border-stone-200/70 flex items-center gap-2">
          <button
            onClick={onOpenCaptureModal}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#4A6B53] text-white text-sm font-medium hover:bg-[#3c5743] shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Entry</span>
          </button>
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-xl border border-stone-300/80 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 transition-all shadow-2xs cursor-pointer shrink-0"
              title="Notifications & Dispatches"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#F4F1EA]">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-stone-400">
            Personal Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#EAF0EB] text-[#252525] font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#4A6B53]' : 'text-stone-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-[#4A6B53]/20 text-[#4A6B53]'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-semibold tracking-wider uppercase text-stone-400">
            Collective & Review
          </div>
          {adminItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#FAF3E7] text-[#252525] font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#C88A2E]' : 'text-stone-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-[#C88A2E]/20 text-[#C88A2E] font-bold'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Identity & Persona Switcher */}
        <div className="p-3 border-t border-stone-200 bg-[#EFECE4] relative space-y-2">
          {/* Profile & Cloud Auth Button */}
          <button
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/80 hover:border-stone-300 hover:bg-stone-50 transition-all text-left shadow-2xs group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#EAF0EB] text-[#4A6B53] font-bold text-xs flex items-center justify-center shrink-0 border border-[#4A6B53]/20">
                {firebaseUser?.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#4A6B53]" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-stone-900 truncate flex items-center gap-1.5">
                  <span>Profile & Sync</span>
                  {firebaseUser && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {firebaseUser ? 'Cloud Active' : 'Sign In / Local'}
                </div>
              </div>
            </div>
            <Cloud className="w-4 h-4 text-stone-400 group-hover:text-[#4A6B53] shrink-0 transition-colors" />
          </button>

          <div className="text-[10px] uppercase font-semibold text-stone-400 px-2 pt-1 flex items-center justify-between">
            <span>Demo Persona</span>
            <span className="text-[9px] text-[#4A6B53] font-bold">Switch View</span>
          </div>

          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/70 border border-stone-200/60 hover:border-stone-300 hover:bg-white transition-all text-left shadow-2xs"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 font-semibold text-[11px] flex items-center justify-center shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-stone-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-500 capitalize truncate">
                  {currentUser.role === 'admin'
                    ? 'CEQHS Reviewer'
                    : currentUser.role === 'coordinator'
                    ? 'School Coordinator'
                    : 'Educator'}
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
          </button>

          {/* Role Switcher Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-white border border-stone-300 rounded-xl shadow-lg p-1.5 space-y-1 z-30">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Select View Experience
              </div>
              {(Object.entries(allUsers) as [string, User][]).map(([key, u]) => (
                <button
                  key={key}
                  onClick={() => {
                    onSwitchUser(key);
                    setIsRoleDropdownOpen(false);
                    if (u.role === 'coordinator') onSelectTab('school');
                    else if (u.role === 'admin') onSelectTab('ceqhs-review');
                    else onSelectTab('home');
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                    currentUser.id === u.id
                      ? 'bg-[#EAF0EB] text-[#4A6B53] font-semibold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                  <div>
                    <div className="font-medium leading-tight">{u.name}</div>
                    <div className="text-[10px] text-stone-500">{u.title}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {onSwitchToCeqhsPortal && (
            <button
              onClick={onSwitchToCeqhsPortal}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold transition-all shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CEQHS Dashboard</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full mt-1.5 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-stone-200/80 bg-white/50 hover:bg-white text-stone-600 hover:text-red-700 text-xs font-medium transition-colors shadow-2xs"
              title="Lock and Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#F4F1EA] border-b border-stone-200 sticky top-0 z-40">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://ibb.co/8nxMTMnN"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png') {
                target.src = 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png';
              } else if (target.src !== '/ceqhs-logo.png') {
                target.src = '/ceqhs-logo.png';
              }
            }}
            alt="CEQHS Official Logo"
            style={{
              height: '55px',
              width: 'auto',
              objectFit: 'contain',
              flexShrink: 0,
              borderRadius: '0',
            }}
          />
          <div>
            <div className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="font-editorial text-base font-bold text-stone-900 leading-none block">
                CEQHS
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {activeTenantCode || 'TENANT-A'}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 truncate block max-w-[150px]">
              {activeTenantName || currentUser.schoolName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 text-stone-600 rounded-lg hover:bg-stone-200"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#F4F1EA]" />
              )}
            </button>
          )}
          <button
            onClick={onOpenCaptureModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A6B53] text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-stone-600 rounded-lg hover:bg-stone-200"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#252525]/30 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-[#F8F7F3] rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4 border-t border-stone-300">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-editorial text-lg text-stone-900">Explore Platform</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-stone-500 rounded-lg hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile & Cloud Auth Button for Mobile */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenProfileModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 text-left shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EAF0EB] text-[#4A6B53] font-bold text-xs flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-[#4A6B53]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span>User Profile & Persistence</span>
                    {firebaseUser && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {firebaseUser ? `Connected: ${firebaseUser.email}` : 'Sign in to sync with Cloud Firestore'}
                  </div>
                </div>
              </div>
              <Cloud className="w-4 h-4 text-[#4A6B53]" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-sm font-medium ${
                      currentTab === item.id
                        ? 'bg-[#EAF0EB] border-[#4A6B53] text-stone-900 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#4A6B53]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-500 mb-2">School & Review</div>
              <div className="grid grid-cols-2 gap-2">
                {adminItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-medium ${
                      currentTab === item.id
                        ? 'bg-[#FAF3E7] border-[#C88A2E] text-stone-900 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Switch User */}
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-semibold text-stone-500 mb-2">Switch User View</div>
              <div className="space-y-1.5">
                {(Object.entries(allUsers) as [string, User][]).map(([key, u]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onSwitchUser(key);
                      setIsMobileMenuOpen(false);
                      if (u.role === 'coordinator') onSelectTab('school');
                      else if (u.role === 'admin') onSelectTab('ceqhs-review');
                      else onSelectTab('home');
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between text-xs ${
                      currentUser.id === u.id
                        ? 'bg-[#EAF0EB] border-[#4A6B53] text-stone-900 font-semibold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[10px] text-stone-500">{u.title}</div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-stone-500">{u.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Log Out */}
            {onLogout && (
              <div className="pt-3 border-t border-stone-200">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full p-2.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-50 text-red-700 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out (Lock App)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#F4F1EA] border-t border-stone-200 px-3 py-2 flex items-center justify-around z-40">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentTab === 'home' ? 'text-[#4A6B53] font-semibold' : 'text-stone-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onSelectTab('journey')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentTab === 'journey' ? 'text-[#4A6B53] font-semibold' : 'text-stone-500'
          }`}
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[10px]">Journey</span>
        </button>

        {/* Floating Center Plus Action */}
        <button
          onClick={onOpenCaptureModal}
          className="w-11 h-11 -mt-5 rounded-full bg-[#4A6B53] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          aria-label="Add to Journey"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onSelectTab('moments')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentTab === 'moments' ? 'text-[#4A6B53] font-semibold' : 'text-stone-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">Moments</span>
        </button>

        <button
          onClick={() => onSelectTab('dossier')}
          className={`flex flex-col items-center gap-0.5 text-xs ${
            currentTab === 'dossier' ? 'text-[#4A6B53] font-semibold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px]">Dossier</span>
        </button>
      </nav>
    </>
  );
};
