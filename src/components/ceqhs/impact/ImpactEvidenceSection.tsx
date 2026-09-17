import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  ShieldCheck,
  HeartHandshake,
  Sprout,
  Compass,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { ImpactIndicator, EvidenceLink } from '../../../types/impactEvidence';
import { EvidenceTraceabilityDrawer } from './EvidenceTraceabilityDrawer';
import { ImpactOverviewPage } from './ImpactOverviewPage';
import { LearnerImpactPage } from './LearnerImpactPage';
import { AdultPracticeImpactPage } from './AdultPracticeImpactPage';
import { ClassroomAndRelationshipPage } from './ClassroomAndRelationshipPage';
import { SchoolCulturePage } from './SchoolCulturePage';
import { ImplementationQualityPage } from './ImplementationQualityPage';
import { EquityAndSafetyPage } from './EquityAndSafetyPage';
import { SustainabilityPage } from './SustainabilityPage';
import { DossierEvidencePage } from './DossierEvidencePage';
import { AnnualImpactReviewPage } from './AnnualImpactReviewPage';
import { ThreeYearJourneyPage } from './ThreeYearJourneyPage';
import { AdminReviewQueuePage } from './AdminReviewQueuePage';
import { ReportsAndExportsPage } from './ReportsAndExportsPage';

interface ImpactEvidenceSectionProps {
  onNavigateGlobal?: (routeId: string) => void;
  initialRole?: 'school_management' | 'admin_reviewer';
}

export const ImpactEvidenceSection: React.FC<ImpactEvidenceSectionProps> = ({
  onNavigateGlobal,
  initialRole = 'school_management',
}) => {
  const [userRole, setUserRole] = useState<'school_management' | 'admin_reviewer'>(initialRole);
  const [activeSubpage, setActiveSubpage] = useState<string>('overview');
  const [selectedIndicator, setSelectedIndicator] = useState<ImpactIndicator | null>(null);
  const [selectedEvidenceLink, setSelectedEvidenceLink] = useState<EvidenceLink | null>(null);

  const navItems = [
    { id: 'overview', label: 'Impact Overview', icon: BarChart3 },
    { id: 'learner', label: 'Learner Impact', icon: Sprout },
    { id: 'adult', label: 'Adult Practice Impact', icon: HeartHandshake },
    { id: 'classroom', label: 'Classroom & Relationships', icon: Users },
    { id: 'culture', label: 'School Culture & Systems', icon: ShieldCheck },
    { id: 'implementation', label: 'Implementation Quality', icon: CheckCircle2 },
    { id: 'equity', label: 'Equity & Safety', icon: AlertTriangle },
    { id: 'sustainability', label: 'Sustainability Profile', icon: Compass },
    { id: 'dossier-evidence', label: 'Dossier Evidence', icon: Layers },
    { id: 'annual-review', label: 'Annual Impact Review', icon: Calendar },
    { id: 'three-year-journey', label: 'Three-Year Journey', icon: Compass },
    { id: 'reports-exports', label: 'Reports & Exports', icon: FileText },
  ];

  const adminNavItems = [
    { id: 'admin-queue', label: 'Reviewer Queue & Moderation', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-16">
      {/* Top Banner with Role Switcher & Audience Mode */}
      <div className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1B3626] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                IE
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  CEQHS Living Journey
                </span>
                <span className="text-sm font-bold text-stone-900">
                  Impact &amp; Evidence Section
                </span>
              </div>
            </div>

            {/* Audience Role Toggle */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2">
                Audience:
              </span>
              <button
                onClick={() => {
                  setUserRole('school_management');
                  if (activeSubpage === 'admin-queue') setActiveSubpage('overview');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'school_management'
                    ? 'bg-white text-[#1B3626] shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                School Leaders &amp; Management
              </button>
              <button
                onClick={() => {
                  setUserRole('admin_reviewer');
                  setActiveSubpage('admin-queue');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userRole === 'admin_reviewer'
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                CEQHS Administrator &amp; Reviewer
              </button>
            </div>
          </div>

          {/* Subpage Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-stone-100 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubpage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubpage(item.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF0EB] text-[#1B3626] font-bold'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {userRole === 'admin_reviewer' &&
              adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSubpage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSubpage(item.id)}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white font-bold'
                        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeSubpage === 'overview' && (
          <ImpactOverviewPage
            userRole={userRole}
            onSelectIndicator={(ind) => setSelectedIndicator(ind)}
            onSelectEvidence={(ev) => setSelectedEvidenceLink(ev)}
            onNavigateSubpage={(pageId) => setActiveSubpage(pageId)}
          />
        )}

        {activeSubpage === 'learner' && (
          <LearnerImpactPage onSelectIndicator={(ind) => setSelectedIndicator(ind)} />
        )}

        {activeSubpage === 'adult' && (
          <AdultPracticeImpactPage onSelectIndicator={(ind) => setSelectedIndicator(ind)} />
        )}

        {activeSubpage === 'classroom' && (
          <ClassroomAndRelationshipPage onSelectIndicator={(ind) => setSelectedIndicator(ind)} />
        )}

        {activeSubpage === 'culture' && (
          <SchoolCulturePage onNavigateDossier={() => setActiveSubpage('dossier-evidence')} />
        )}

        {activeSubpage === 'implementation' && (
          <ImplementationQualityPage onSelectEvidence={(ev) => setSelectedEvidenceLink(ev)} />
        )}

        {activeSubpage === 'equity' && <EquityAndSafetyPage />}

        {activeSubpage === 'sustainability' && <SustainabilityPage />}

        {activeSubpage === 'dossier-evidence' && (
          <DossierEvidencePage
            userRole={userRole}
            onSelectEvidence={(ev) => setSelectedEvidenceLink(ev)}
          />
        )}

        {activeSubpage === 'annual-review' && <AnnualImpactReviewPage />}

        {activeSubpage === 'three-year-journey' && <ThreeYearJourneyPage />}

        {activeSubpage === 'reports-exports' && <ReportsAndExportsPage />}

        {activeSubpage === 'admin-queue' && <AdminReviewQueuePage />}
      </div>

      {/* Traceability Drawer */}
      <EvidenceTraceabilityDrawer
        indicator={selectedIndicator}
        evidenceLink={selectedEvidenceLink}
        onClose={() => {
          setSelectedIndicator(null);
          setSelectedEvidenceLink(null);
        }}
        onOpenDossier={(ref) => {
          setSelectedIndicator(null);
          setSelectedEvidenceLink(null);
          setActiveSubpage('dossier-evidence');
        }}
      />
    </div>
  );
};
