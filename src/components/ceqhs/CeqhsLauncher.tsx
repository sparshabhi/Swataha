import React from 'react';
import {
  LayoutDashboard,
  Building2,
  FileCheck2,
  Award,
  GraduationCap,
  BarChart3,
  HelpCircle,
  Users,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CeqhsLauncherProps {
  onNavigate: (route: string) => void;
  onClose?: () => void;
  pendingDossierCount?: number;
  pendingMilestoneCount?: number;
  openSupportCount?: number;
}

export const CeqhsLauncher: React.FC<CeqhsLauncherProps> = ({
  onNavigate,
  onClose,
  pendingDossierCount = 2,
  pendingMilestoneCount = 1,
  openSupportCount = 3,
}) => {
  const launcherTiles = [
    {
      id: 'overview',
      route: 'overview',
      title: 'Network Overview',
      category: 'Cross-Institutional Control',
      description: 'Network-level metrics, priority queue, active school health, and immediate team actions.',
      icon: LayoutDashboard,
      badge: null,
      accentColor: 'text-[#1B3626] bg-[#1B3626]/10 border-[#1B3626]/20',
    },
    {
      id: 'schools',
      route: 'schools',
      title: 'Partner Schools',
      category: 'Institutional Directory',
      description: 'Directory of onboarded school tenants, lead administrators, and persistent school workspaces.',
      icon: Building2,
      badge: '3 Active',
      accentColor: 'text-[#008DA5] bg-[#008DA5]/10 border-[#008DA5]/20',
    },
    {
      id: 'dossier-review',
      route: 'dossier-review',
      title: 'Dossier Review Queue',
      category: 'Living Evidence Audit',
      description: 'Review submitted evidence, classroom micro-pause logs, student voice, and request revisions.',
      icon: FileCheck2,
      badge: pendingDossierCount > 0 ? `${pendingDossierCount} Awaiting` : null,
      accentColor: 'text-[#C88A2E] bg-[#C88A2E]/10 border-[#C88A2E]/20',
    },
    {
      id: 'milestones',
      route: 'milestones',
      title: 'Milestone Verification',
      category: 'Developmental Progress',
      description: 'Verify school-wide implementation milestones against evidence criteria and audit notes.',
      icon: Award,
      badge: pendingMilestoneCount > 0 ? `${pendingMilestoneCount} Ready` : null,
      accentColor: 'text-[#4A6B53] bg-[#4A6B53]/10 border-[#4A6B53]/20',
    },
    {
      id: 'training',
      route: 'training',
      title: 'Training & Cohorts',
      category: 'Educator Development',
      description: 'Monitor teacher emotional literacy cohorts, module completion pacing, and stalled learners.',
      icon: GraduationCap,
      badge: '144 Enrolled',
      accentColor: 'text-[#2F4837] bg-[#2F4837]/10 border-[#2F4837]/20',
    },
    {
      id: 'reports',
      route: 'reports',
      title: 'Network Reports',
      category: 'Practical Intelligence',
      description: 'Generate partner school status, training participation, and milestone audit reports (CSV/PDF).',
      icon: BarChart3,
      badge: 'Ready to Export',
      accentColor: 'text-[#1B3626] bg-[#1B3626]/10 border-[#1B3626]/20',
    },
    {
      id: 'follow-up',
      route: 'follow-up',
      title: 'Support & Follow-up',
      category: 'Case Management',
      description: 'Track school support cases, safeguarding flags, training interventions, and due dates.',
      icon: HelpCircle,
      badge: openSupportCount > 0 ? `${openSupportCount} Open` : null,
      accentColor: 'text-[#D97706] bg-[#D97706]/10 border-[#D97706]/20',
    },
    {
      id: 'team',
      route: 'team',
      title: 'CEQHS Team',
      category: 'Access & Governance',
      description: 'Manage CEQHS staff roles, assign school portfolios, and monitor audit trails.',
      icon: Users,
      badge: '4 Staff',
      accentColor: 'text-[#475569] bg-[#475569]/10 border-[#475569]/20',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Launcher Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#1B3626]/10 text-[#1B3626]">
            CEQHS & Swataha Programme Workspace
          </span>
          <span className="text-xs text-stone-400">·</span>
          <span className="text-xs text-stone-500 font-medium">Programme Supervision Hub</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Application Launcher
        </h2>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Direct navigation to core programme supervisory modules. Select a destination tile to manage schools, audit dossiers, or verify developmental milestones.
        </p>
      </div>

      {/* Grid of Large Destination Tiles (Inspired loosely by launcher concept) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {launcherTiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.id}
              onClick={() => {
                onNavigate(tile.route);
                if (onClose) onClose();
              }}
              className="group text-left p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between h-56 relative focus:outline-none focus:ring-2 focus:ring-[#1B3626]/30"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl border ${tile.accentColor} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {tile.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                      {tile.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                  {tile.category}
                </span>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-[#1B3626] transition-colors leading-tight">
                  {tile.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 line-clamp-3 leading-relaxed">
                  {tile.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-400 group-hover:text-[#1B3626] transition-colors">
                <span>Open module</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
