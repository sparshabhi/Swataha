import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Users,
  Compass,
  HeartHandshake,
  ShieldCheck,
  Brain,
  Sparkles,
  Layers,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Eye,
  Award,
  HelpCircle,
  Lightbulb,
  Info,
  Calendar,
  Check,
  Download,
  FileSpreadsheet,
  TrendingUp,
} from 'lucide-react';
import {
  exportImpactReportPDF,
  exportImpactReportHTML,
  exportImpactReportCSV,
  triggerBlobDownload,
} from '../../utils/impactDocumentGenerator';
import {
  SchoolParticipationChart,
} from './charts/SchoolParticipationChart';
import {
  EmotionalClimateTrendsChart,
} from './charts/EmotionalClimateTrendsChart';
import {
  AlignmentProgressChart,
} from './charts/AlignmentProgressChart';
import {
  ImpactChartsOverview,
} from './charts/ImpactChartsOverview';
import {
  User,
  Tenant,
  DomainEvidenceProfile,
  GuidedPerformanceTask,
  LearnerVoiceItem,
  GuidedDilemmaScenario,
  AdultPracticeItem,
  StructuredObservationSession,
  ValuesInActionProject,
  ImplementationFidelityMetrics,
  CeqhsDomainKey,
  MeasurementWaveKey,
} from '../../types';
import {
  INITIAL_DOMAIN_PROFILES,
  GUIDED_PERFORMANCE_TASKS,
  GRADE_3_PROTOTYPE_ITEMS,
  GRADES_4_5_LEARNER_VOICE_ITEMS,
  GUIDED_SCENARIOS,
  ADULT_PRACTICE_ITEMS,
  OBSERVATION_RUBRIC_DOMAINS,
  INITIAL_OBSERVATION_SESSIONS,
  INITIAL_VALUES_IN_ACTION_PROJECTS,
  INITIAL_IMPLEMENTATION_METRICS,
} from '../../data/impactEvidenceData';

interface ImpactEvidencePortalProps {
  currentUser: User;
  activeTenant?: Tenant;
  onNavigateTab?: (tab: string) => void;
}

export const ImpactEvidencePortal: React.FC<ImpactEvidencePortalProps> = ({
  currentUser,
  activeTenant,
  onNavigateTab,
}) => {
  // Navigation & Sub-tabs
  const [selectedCohort, setSelectedCohort] = useState<'elementary' | 'secondary'>('elementary');
  const [activeSubTab, setActiveSubTab] = useState<'profiles' | 'battery' | 'observation' | 'implementation' | 'visual_analytics'>('profiles');

  // Selected Wave for Domain Profile inspection
  const [selectedWave, setSelectedWave] = useState<MeasurementWaveKey>('endline');

  // Battery sub-view
  const [batteryView, setBatteryView] = useState<'g12_tasks' | 'g3_voice' | 'g45_voice' | 'adult_practice'>('g12_tasks');

  // Guided task testing state
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-a');
  const [checkedTaskCriteria, setCheckedTaskCriteria] = useState<Record<string, boolean>>({});

  // Scenario simulator state
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({});

  // Interactive Grade 3/4-5 Item Response Simulation
  const [sampleResponses, setSampleResponses] = useState<Record<string, string>>({});

  // View 4 display toggle (Recharts charts vs raw metric cards)
  const [implementationDisplayMode, setImplementationDisplayMode] = useState<'charts' | 'cards'>('charts');

  // Observation sessions state
  const [observationSessions, setObservationSessions] = useState<StructuredObservationSession[]>(INITIAL_OBSERVATION_SESSIONS);
  const [isLoggingObservation, setIsLoggingObservation] = useState(false);
  const [newObsDate, setNewObsDate] = useState(new Date().toISOString().split('T')[0]);
  const [newObsGrade, setNewObsGrade] = useState('Grade 3');
  const [newObsContext, setNewObsContext] = useState('');
  const [newObsScores, setNewObsScores] = useState<Record<CeqhsDomainKey, { score: 0 | 1 | 2 | 3 | 4; factualExample: string; supportPromptingGiven: string }>>({
    self_awareness: { score: 3, factualExample: '', supportPromptingGiven: '' },
    self_management: { score: 3, factualExample: '', supportPromptingGiven: '' },
    social_awareness: { score: 2, factualExample: '', supportPromptingGiven: '' },
    relationship_skills: { score: 3, factualExample: '', supportPromptingGiven: '' },
    responsible_decision_making: { score: 3, factualExample: '', supportPromptingGiven: '' },
  });

  // Values in Action state
  const [viaProjects, setViaProjects] = useState<ValuesInActionProject[]>(INITIAL_VALUES_IN_ACTION_PROJECTS);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Domain Profile data
  const [domainProfiles] = useState<DomainEvidenceProfile[]>(INITIAL_DOMAIN_PROFILES);
  const [selectedDomainKey, setSelectedDomainKey] = useState<CeqhsDomainKey>('self_awareness');

  // Document Download State
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [downloadToastMsg, setDownloadToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setDownloadToastMsg(msg);
    setTimeout(() => {
      setDownloadToastMsg(null);
    }, 4000);
  };

  const handleDownloadReportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      const ok = exportImpactReportPDF({
        reportTitle: 'CEQHS Impact & Evidence Report (Grades 1–5)',
        schoolName: activeTenant?.name || 'Swataha Core School · Primary Pilot',
        reportingPeriod: `${selectedWave.toUpperCase()} Wave · AY 2026–2027`,
        verifiedBy: currentUser.name || 'Saugat Singh Saud (Chief Program Architect)',
      });
      setIsExportingPDF(false);
      setIsDownloadMenuOpen(false);
      if (ok) {
        triggerToast('Downloaded official CEQHS Impact Report (.pdf)');
      } else {
        exportImpactReportHTML({
          reportTitle: 'CEQHS Impact & Evidence Report (Grades 1–5)',
          schoolName: activeTenant?.name || 'Swataha Core School · Primary Pilot',
        });
        triggerToast('Generated standalone printable document (.html)');
      }
    }, 300);
  };

  const handleDownloadReportHTML = () => {
    exportImpactReportHTML({
      reportTitle: 'CEQHS Impact & Evidence Report (Grades 1–5)',
      schoolName: activeTenant?.name || 'Swataha Core School · Primary Pilot',
      reportingPeriod: `${selectedWave.toUpperCase()} Wave · AY 2026–2027`,
      verifiedBy: currentUser.name || 'Saugat Singh Saud (Chief Program Architect)',
    });
    setIsDownloadMenuOpen(false);
    triggerToast('Downloaded standalone publication (.html)');
  };

  const handleDownloadMetricsCSV = () => {
    exportImpactReportCSV({
      reportTitle: 'CEQHS_Grades_1_5_Domain_Growth_Metrics',
    });
    setIsDownloadMenuOpen(false);
    triggerToast('Exported 5-Domain Metrics Spreadsheet (.csv)');
  };

  const handleDownloadObservationsCSV = () => {
    const headers = [
      'Session ID',
      'Date',
      'Grade Level',
      'Activity Context',
      'Observer Name',
      'Observer Role',
      'Self-Awareness Score',
      'Self-Management Score',
      'Social Awareness Score',
      'Relationship Skills Score',
      'Decision-Making Score',
      'Status',
    ];
    const rows = observationSessions.map((s) => [
      `"${s.id}"`,
      `"${s.date}"`,
      `"${s.gradeLevel}"`,
      `"${s.activityContext.replace(/"/g, '""')}"`,
      `"${s.observerName}"`,
      `"${s.observerRole}"`,
      s.ratings.self_awareness.score,
      s.ratings.self_management.score,
      s.ratings.social_awareness.score,
      s.ratings.relationship_skills.score,
      s.ratings.responsible_decision_making.score,
      `"${s.reviewerStatus}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerBlobDownload(blob, `CEQHS_Observation_Sessions_${new Date().toISOString().split('T')[0]}.csv`);
    setIsDownloadMenuOpen(false);
    triggerToast('Exported Observation Sessions (.csv)');
  };

  // Handle Scenario Choice
  const handleSelectScenarioOption = (scenarioId: string, optionKey: string) => {
    setScenarioAnswers((prev) => ({ ...prev, [scenarioId]: optionKey }));
  };

  // Handle Task Criteria Toggle
  const handleToggleTaskCriterion = (taskCode: string, index: number) => {
    const key = `${taskCode}-${index}`;
    setCheckedTaskCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Save New Observation
  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObsContext.trim()) return;

    const newSession: StructuredObservationSession = {
      id: `obs-session-${Date.now()}`,
      date: newObsDate,
      durationMinutes: 25,
      activityContext: newObsContext,
      gradeLevel: newObsGrade,
      observerName: currentUser.name || 'Coordinator Arthur Vance',
      observerRole: currentUser.role === 'admin' ? 'CEQHS Reviewer' : 'School Coordinator',
      opportunityPresent: true,
      ratings: newObsScores,
      adaptationNotes: 'Classroom calming corner materials available during observation.',
      followUpRecommendation: 'Continue weekly co-regulation check-ins with lead teacher.',
      reviewerStatus: 'Validated',
    };

    setObservationSessions((prev) => [newSession, ...prev]);
    setIsLoggingObservation(false);
    setNewObsContext('');
  };

  const selectedDomain = domainProfiles.find((d) => d.domainKey === selectedDomainKey) || domainProfiles[0];
  const activeTask = GUIDED_PERFORMANCE_TASKS.find((t) => t.id === selectedTaskId) || GUIDED_PERFORMANCE_TASKS[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. SUITE HEADER & COHORT SWITCHER                                      */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#4A6B53]/10 text-[#4A6B53] text-xs font-bold uppercase tracking-wider border border-[#4A6B53]/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                CEQHS Metrics Manual
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-mono font-medium border border-stone-200">
                Grades 1–5 Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200/70">
                Research-Backed & Developmentally Appropriate
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-[#252525] tracking-tight">
              Impact & Evidence Suite
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl leading-relaxed">
              Multi-source, developmentally staged measurement combining learner voice, adult professional practice, structured observation, and implementation context.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Cohort Switcher */}
            <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-medium">
              <button
                onClick={() => setSelectedCohort('elementary')}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  selectedCohort === 'elementary'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Elementary (Grades 1–5)
              </button>
              <button
                onClick={() => setSelectedCohort('secondary')}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  selectedCohort === 'secondary'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Secondary (Grades 6–12)
              </button>
            </div>

            {/* Download Impact Document Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadMenuOpen((prev) => !prev)}
                className="px-3.5 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Download verified CEQHS impact documentation"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Impact Document</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </button>

              {isDownloadMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                    Verified Publication Formats
                  </div>

                  <button
                    onClick={handleDownloadReportPDF}
                    disabled={isExportingPDF}
                    className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">
                        {isExportingPDF ? 'Generating PDF...' : 'Verified Impact Report (.pdf)'}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Print-ready accreditation document with institutional header
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadReportHTML}
                    className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">Standalone Dossier Document (.html)</div>
                      <div className="text-[11px] text-stone-500">
                        Interactive & Word-compatible format with embedded styles
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadMetricsCSV}
                    className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">Domain Metrics Spreadsheet (.csv)</div>
                      <div className="text-[11px] text-stone-500">
                        5-domain multi-wave scores, missingness & sample sizes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleDownloadObservationsCSV}
                    className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-stone-50 flex items-start gap-2.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-800">Observation Sessions Registry (.csv)</div>
                      <div className="text-[11px] text-stone-500">
                        Structured classroom behavioral scores and context notes
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-stone-100 my-1" />

                  <button
                    onClick={() => {
                      setIsDownloadMenuOpen(false);
                      window.print();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-stone-500" />
                    <span>Print / Save as PDF via Browser</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              title="Print evidence report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Feedback notification toast */}
        {downloadToastMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-semibold">{downloadToastMsg}</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">Saved to downloads</span>
          </div>
        )}

        {/* Mandatory Section 12.4 Ethical & Wording Safeguard Notice */}
        <div className="mt-6 pt-4 border-t border-stone-200/80 flex items-start gap-3 text-xs bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200/60">
          <Info className="w-4 h-4 text-[#4A6B53] shrink-0 mt-0.5" />
          <div className="text-stone-600 leading-relaxed">
            <span className="font-semibold text-stone-800">Ethical Reporting Principle (Section 12.1 & 12.4): </span>
            CEQHS never reduces learners or schools to a single “overall EQ score”. Results report domain-specific profiles and qualitative evidence strength. Measures are formative for school improvement and never used to diagnose, rank, punish, or determine moral worth.
          </div>
        </div>

        {/* Primary Sub-tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-2">
          {[
            { id: 'profiles', label: '1. Domain Profiles & Progression', icon: BarChart3 },
            { id: 'battery', label: '2. Measurement Battery (Tasks & Voice)', icon: Brain },
            { id: 'observation', label: '3. Structured Observation (0–4 Scale)', icon: Eye },
            { id: 'implementation', label: '4. Implementation, Context & Values', icon: Compass },
            { id: 'visual_analytics', label: '5. Visual Trends & Telemetry (Charts)', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4A6B53] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700 border border-stone-200/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* VIEW 1: THE 5 DOMAIN EVIDENCE PROFILES                                 */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'profiles' && (
        <div className="space-y-6">
          {/* Wave Selector & Evidence Strength Legend */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Evaluation Wave:</span>
              <div className="flex flex-wrap gap-1.5">
                {(['baseline', 'early_check', 'midline', 'endline', 'follow_up'] as MeasurementWaveKey[]).map((w) => {
                  const labels: Record<MeasurementWaveKey, string> = {
                    baseline: 'Baseline (Sept)',
                    early_check: 'Early Check (Oct)',
                    midline: 'Midline (Jan)',
                    endline: 'Endline (May)',
                    follow_up: 'Year 2 Follow-Up',
                  };
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWave(w)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedWave === w
                          ? 'bg-stone-900 text-white font-semibold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {labels[w]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evidence Strength Legend (Section 12.3) */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-500 font-medium">Strength:</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-medium">
                Emerging
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                Developing
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                Strong School Evidence
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-semibold">
                Reviewed Impact Evidence
              </span>
            </div>
          </div>

          {/* 5 Domain Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {domainProfiles.map((domain) => {
              const waveData = domain.waves[selectedWave] || domain.waves.endline;
              const isSelected = selectedDomainKey === domain.domainKey;

              const strengthBadge = {
                emerging: { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Emerging' },
                developing: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Developing' },
                strong: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Strong School Evidence' },
                reviewed_impact: { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Reviewed Impact' },
              }[domain.evidenceStrength];

              return (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomainKey(domain.domainKey)}
                  className={`bg-white border rounded-2xl p-5 transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#4A6B53] ring-2 ring-[#4A6B53]/20 shadow-md'
                      : 'border-stone-200/90 hover:border-stone-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-editorial text-lg font-bold text-stone-900 leading-snug">
                          {domain.domainName}
                        </h3>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${strengthBadge.bg}`}>
                          {strengthBadge.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold font-mono text-[#4A6B53]">
                          {waveData.indicatorScore}%
                        </span>
                        <span className="block text-[10px] text-stone-500 font-mono">
                          N={waveData.sampleSize}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {domain.measurementDefinition}
                    </p>

                    {/* Longitudinal Wave Mini-Track */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex justify-between">
                        <span>Wave Progression</span>
                        <span className="font-mono text-stone-700">Resp Rate: {waveData.responseRate}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                        {(['baseline', 'early_check', 'midline', 'endline'] as MeasurementWaveKey[]).map((wk) => (
                          <div
                            key={wk}
                            className={`p-1.5 rounded ${
                              wk === selectedWave
                                ? 'bg-[#4A6B53] text-white font-bold'
                                : 'bg-stone-50 text-stone-700'
                            }`}
                          >
                            <span className="block text-[8px] text-stone-400 capitalize">{wk.replace('_', ' ')}</span>
                            <span>{domain.waves[wk]?.indicatorScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Sources */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {domain.evidenceSourcesActive.map((src) => {
                        const labels: Record<string, string> = {
                          learner_voice: 'Learner Voice',
                          adult_practice: 'Adult Practice',
                          structured_observation: 'Observation',
                          context_implementation: 'Fidelity & Context',
                        };
                        return (
                          <span
                            key={src}
                            className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] rounded font-medium border border-stone-200"
                          >
                            {labels[src] || src}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {domain.reviewerStatus}
                    </span>
                    <span className="text-[11px] font-medium text-stone-400">Missingness: {domain.missingnessRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Domain Deep Dive Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53]">Domain In-Depth Profile</span>
                <h2 className="text-xl font-editorial font-bold text-stone-900 mt-0.5">
                  {selectedDomain.domainName}
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  {selectedDomain.measurementDefinition}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold rounded-lg">
                  {selectedDomain.evidenceStrength.toUpperCase()} SCHOOL EVIDENCE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-stone-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#4A6B53]" />
                  <span>Factual Multi-Source Findings</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedDomain.factualObservationSummary}
                </p>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-xl border border-stone-200/80 space-y-2">
                <div className="text-xs font-bold text-stone-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Next Step Developmental Recommendation</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {selectedDomain.nextStepRecommendation}
                </p>
              </div>
            </div>

            {/* Attribution Language Notice as instructed in Section 12.4 */}
            <div className="mt-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-700" />
                Approved Attribution Summary (Section 12.4)
              </div>
              <p className="text-blue-800/90 leading-relaxed font-mono text-[11px]">
                “{selectedDomain.domainName} indicators demonstrated steady growth across the {selectedWave} reporting window. Evidence combines guided tasks, sampled classroom observations, and student voice. The school delivered planned practice in 44 of 48 sessions. The evidence supports change and a plausible contribution, not definitive single-source attribution.”
              </p>
            </div>
          </div>

          {/* Visual Progression & Alignment Chart (Recharts) */}
          <div className="pt-2">
            <AlignmentProgressChart />
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* VIEW 2: MEASUREMENT BATTERY (TASKS, VOICE & SCENARIOS)                  */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'battery' && (
        <div className="space-y-6">
          {/* Sub-battery selector */}
          <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
            {[
              { id: 'g12_tasks', label: 'Grades 1–2: Guided Tasks A–E', count: '5 Tasks' },
              { id: 'g3_voice', label: 'Grade 3: Transition Voice Module', count: '15 Items' },
              { id: 'g45_voice', label: 'Grades 4–5: Voice & Scenarios', count: '15 Items + 2 Scenarios' },
              { id: 'adult_practice', label: 'Adult Practice Questionnaire', count: '15 Items + 5 Context' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBatteryView(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  batteryView === tab.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${batteryView === tab.id ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* SUB-VIEW A: GRADES 1–2 GUIDED PERFORMANCE TASKS */}
          {batteryView === 'g12_tasks' && (
            <div className="space-y-6">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Grades 1–2 Administration Rule: </span>
                  Do not use long abstract questionnaires or independent reading surveys for young children. Tasks are 3–5 minute ordinary classroom activities. Do not deliberately distress the learner, and never suggest the “correct” answer.
                </div>
              </div>

              {/* Task Tabs */}
              <div className="flex flex-wrap gap-2">
                {GUIDED_PERFORMANCE_TASKS.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTaskId === task.id
                        ? 'bg-[#4A6B53] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{task.taskCode}: {task.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Task Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {activeTask.taskCode}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">Duration: {activeTask.durationMinutes}</span>
                    </div>
                    <h3 className="text-xl font-editorial font-bold text-stone-900 mt-1">
                      {activeTask.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
                      <span>Primary: <strong className="text-stone-800">{activeTask.primaryDomain}</strong></span>
                      {activeTask.secondaryDomain && (
                        <span>• Secondary: <strong className="text-stone-800">{activeTask.secondaryDomain}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Scenario & Prompt */}
                  <div className="space-y-4">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Activity Context & Illustration</span>
                      <p className="text-xs text-stone-800 leading-relaxed">
                        {activeTask.scenarioIllustration}
                      </p>
                    </div>

                    <div className="bg-[#EAF0EB] p-4 rounded-xl border border-[#4A6B53]/30 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6B53]">Teacher Inquiry Question (Read Aloud)</span>
                      <p className="text-sm font-editorial font-bold text-stone-900 italic">
                        {activeTask.inquiryPrompt}
                      </p>
                    </div>

                    <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-xs leading-relaxed">
                      <strong className="text-stone-800">Administration Guidance: </strong>
                      {activeTask.administrationGuidance}
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="bg-[#FAF9F5] p-5 rounded-xl border border-stone-200/90 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="text-xs font-bold text-stone-800">Observer Performance Checklist</span>
                      <span className="text-[11px] text-stone-500 font-mono">Record without leading</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeTask.checklistCriteria.map((criterion, idx) => {
                        const isChecked = !!checkedTaskCriteria[`${activeTask.taskCode}-${idx}`];
                        return (
                          <label
                            key={idx}
                            onClick={() => handleToggleTaskCriterion(activeTask.taskCode, idx)}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-white border-[#4A6B53] shadow-xs'
                                : 'bg-white/60 border-stone-200/70 hover:bg-white'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-0.5 rounded text-[#4A6B53] focus:ring-[#4A6B53]"
                            />
                            <div className="text-xs text-stone-800 leading-snug">
                              {criterion}
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <div className="pt-2 text-[11px] text-stone-500 italic">
                      Score the response using an anchored rubric, not a raw total. Record whether the learner answered independently, with a prompt, or through physical demonstration.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW B: GRADE 3 TRANSITION VOICE MODULE */}
          {batteryView === 'g3_voice' && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-lg font-editorial font-bold text-stone-900">
                      Grade 3 Supported Learner Voice Module (15 Items)
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Instruction to child: “Think about the last few weeks at school. Choose the answer that is most like your experience.”
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-mono font-medium rounded-lg">
                    4-Point Frequency Scale
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GRADE_3_PROTOTYPE_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-[#4A6B53] bg-emerald-100/60 px-2 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="text-stone-500 capitalize">{item.domainKey.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-900 leading-snug">
                        “{item.prompt}”
                      </p>

                      {/* 4-point response selector simulation */}
                      <div className="grid grid-cols-4 gap-1 pt-1 font-mono text-[10px]">
                        {['Not yet', 'Sometimes', 'Often', 'Not sure'].map((resp) => {
                          const isSelected = sampleResponses[item.id] === resp;
                          return (
                            <button
                              key={resp}
                              onClick={() => setSampleResponses((p) => ({ ...p, [item.id]: resp }))}
                              className={`p-1.5 rounded transition-all text-center ${
                                isSelected
                                  ? 'bg-[#4A6B53] text-white font-bold'
                                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                              }`}
                            >
                              {resp}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW C: GRADES 4–5 VOICE & GUIDED SCENARIOS */}
          {batteryView === 'g45_voice' && (
            <div className="space-y-6">
              {/* Section 7: Guided Scenarios (Regulation & Repair, Inclusion & Decision) */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">Section 7 of Manual</span>
                  <h3 className="text-xl font-editorial font-bold text-stone-900 mt-0.5">
                    Guided Scenarios for Grades 4–5
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                    Scenarios assess reasoning and application, not moral worth. Credit is awarded for explaining and applying the reasoning, not just picking a socially desirable option.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {GUIDED_SCENARIOS.map((scen) => {
                    const selectedChoice = scenarioAnswers[scen.id];
                    return (
                      <div
                        key={scen.id}
                        className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-5 space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                              {scen.scenarioCode}
                            </span>
                            <span className="text-xs text-stone-500 font-medium">
                              {scen.primaryDomain}
                            </span>
                          </div>

                          <h4 className="text-base font-editorial font-bold text-stone-900">
                            {scen.title}
                          </h4>

                          <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed font-sans">
                            <strong className="block text-stone-900 mb-1">Story Context:</strong>
                            {scen.storyText}
                          </div>

                          <p className="text-xs font-bold text-stone-800 italic">
                            {scen.question}
                          </p>

                          {/* Options */}
                          <div className="space-y-2">
                            {scen.options.map((opt) => {
                              const isPicked = selectedChoice === opt.key;
                              return (
                                <button
                                  key={opt.key}
                                  onClick={() => handleSelectScenarioOption(scen.id, opt.key)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                                    isPicked
                                      ? opt.isConstructive
                                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200 text-emerald-950 font-medium'
                                        : 'bg-red-50 border-red-300 ring-2 ring-red-200 text-red-950 font-medium'
                                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                    isPicked
                                      ? opt.isConstructive
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-red-500 text-white'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}>
                                    {opt.key}
                                  </span>
                                  <div className="flex-1">
                                    <span>{opt.text}</span>
                                    {isPicked && (
                                      <span className="block mt-1 text-[11px] text-stone-600 italic">
                                        Analysis: {opt.reasoningExplanation}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reasoning Rubric Criteria */}
                        <div className="pt-3 border-t border-stone-200/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                            Scored Reasoning Features
                          </span>
                          <ul className="text-[11px] text-stone-600 space-y-1 list-disc pl-4">
                            {scen.reasoningRubricCriteria.map((crit, idx) => (
                              <li key={idx}>{crit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 15 Learner Voice Items + 5 Context Items */}
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-lg font-editorial font-bold text-stone-900">
                      Grades 4–5 Questionnaire Items (15 Domain + 5 Context)
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Four-point scale: 1. Not yet / almost never, 2. Sometimes, 3. Often, 4. Almost always, plus “I have not had a chance”.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GRADES_4_5_LEARNER_VOICE_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border space-y-2 ${
                        item.isContextItem
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-[#FAF9F5] border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          item.isContextItem
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100/70 text-emerald-900'
                        }`}>
                          {item.code} {item.isContextItem ? '(Context Item)' : ''}
                        </span>
                        <span className="text-stone-500 capitalize">{item.domainKey.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-900 leading-snug">
                        “{item.prompt}”
                      </p>
                      {item.isContextItem && (
                        <span className="text-[10px] text-amber-800 font-semibold block">
                          Reported separately: Never averaged into competence scores.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW D: ADULT PROFESSIONAL PRACTICE QUESTIONNAIRE */}
          {batteryView === 'adult_practice' && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div>
                    <h3 className="text-lg font-editorial font-bold text-stone-900">
                      Adult Professional-Practice Questionnaire (Section 8)
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Instruction: “Think about your work with learners and colleagues during the last four weeks. The purpose is professional learning, not punishment or appraisal.”
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-mono font-medium rounded-lg">
                    5-Point Frequency Scale
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ADULT_PRACTICE_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border space-y-2 ${
                        item.isContextItem
                          ? 'bg-purple-50/40 border-purple-200'
                          : 'bg-[#FAF9F5] border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          item.isContextItem
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-stone-200 text-stone-800'
                        }`}>
                          {item.code} {item.isContextItem ? '(Workplace Context)' : ''}
                        </span>
                        <span className="text-stone-500 capitalize">{item.domainKey.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-stone-900 leading-snug">
                        “{item.prompt}”
                      </p>
                      {item.isContextItem && (
                        <span className="text-[10px] text-purple-800 font-semibold block">
                          Reported separately: Measures school leadership, coaching, and safety to discuss challenges.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* VIEW 3: STRUCTURED OBSERVATION INSTRUMENT (0–4 SCALE LOGGER)           */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'observation' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">Section 9 of Manual</span>
                <h2 className="text-xl font-editorial font-bold text-stone-900 mt-0.5">
                  Structured Observation Rubric (15–30 Minutes)
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  Observe a defined classroom activity or routine. Dual-indicator rubric pairs learner behaviors with adult modeling poise. Factual examples required; avoid subjective labels like “poor self-control”.
                </p>
              </div>

              <button
                onClick={() => setIsLoggingObservation(!isLoggingObservation)}
                className="px-4 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3c5743] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
              >
                {isLoggingObservation ? 'Close Logger' : '+ Log Live Observation'}
              </button>
            </div>

            {/* Anchored 0-4 Scale Guide (Section 3.4 & Section 9) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block text-sm">Rating 0</span>
                <span className="text-[11px] text-stone-600 font-medium block">No Opportunity / Not Observed</span>
                <span className="text-[10px] text-amber-800 font-bold block mt-1">Must not be scored as zero</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block text-sm">Rating 1</span>
                <span className="text-[11px] text-stone-600 font-medium block">Emerging</span>
                <span className="text-[10px] text-stone-500 block mt-1">Substantial prompting needed</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block text-sm">Rating 2</span>
                <span className="text-[11px] text-stone-600 font-medium block">With Support</span>
                <span className="text-[10px] text-stone-500 block mt-1">Demonstrated with some support</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block text-sm">Rating 3</span>
                <span className="text-[11px] text-stone-600 font-medium block">Independent</span>
                <span className="text-[10px] text-stone-500 block mt-1">Demonstrated in context</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
                <span className="font-mono font-bold text-stone-900 block text-sm">Rating 4</span>
                <span className="text-[11px] text-stone-600 font-medium block">Flexible & Supporting</span>
                <span className="text-[10px] text-stone-500 block mt-1">Supports others constructively</span>
              </div>
            </div>

            {/* Interactive Live Logger Modal/Form */}
            {isLoggingObservation && (
              <form onSubmit={handleSaveObservation} className="p-5 rounded-xl bg-[#FAF9F5] border border-stone-300 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <span className="text-sm font-bold text-stone-900">Record New 15–30 Minute Observation Session</span>
                  <span className="text-xs text-stone-500 font-mono">Observer: {currentUser.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Date</label>
                    <input
                      type="date"
                      value={newObsDate}
                      onChange={(e) => setNewObsDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Grade Level</label>
                    <select
                      value={newObsGrade}
                      onChange={(e) => setNewObsGrade(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                    >
                      <option>Grade 1</option>
                      <option>Grade 2</option>
                      <option>Grade 3</option>
                      <option>Grade 4</option>
                      <option>Grade 5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Activity Context & Lesson</label>
                    <input
                      type="text"
                      placeholder="e.g., Science Lab Station Rotation, Morning Circle"
                      value={newObsContext}
                      onChange={(e) => setNewObsContext(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Rubric Matrix Inputs */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-stone-800 block">Domain Ratings & Factual Field Notes:</span>
                  {OBSERVATION_RUBRIC_DOMAINS.map((domain) => {
                    const currentRating = newObsScores[domain.domainKey];
                    return (
                      <div key={domain.domainKey} className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-xs text-stone-900">{domain.domainName}</span>
                            <div className="text-[11px] text-stone-600 mt-0.5">
                              <span className="text-emerald-800 font-medium">Learner:</span> {domain.learnerIndicator} • <span className="text-blue-800 font-medium">Adult:</span> {domain.adultIndicator}
                            </div>
                          </div>

                          {/* 0-4 Selector */}
                          <div className="flex items-center gap-1 font-mono text-xs">
                            {[0, 1, 2, 3, 4].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() =>
                                  setNewObsScores((prev) => ({
                                    ...prev,
                                    [domain.domainKey]: { ...prev[domain.domainKey], score: s as any },
                                  }))
                                }
                                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                                  currentRating.score === s
                                    ? 'bg-[#4A6B53] text-white shadow-xs'
                                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Factual example (e.g., student paused and used calming breath without adult intervention)..."
                          value={currentRating.factualExample}
                          onChange={(e) =>
                            setNewObsScores((prev) => ({
                              ...prev,
                              [domain.domainKey]: { ...prev[domain.domainKey], factualExample: e.target.value },
                            }))
                          }
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-[#FAF9F5]"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsLoggingObservation(false)}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3c5743]"
                  >
                    Save & Validate Observation
                  </button>
                </div>
              </form>
            )}

            {/* Observation Sessions History */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Validated Observation Logs ({observationSessions.length} Sessions)
              </span>

              {observationSessions.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
                  No observation sessions recorded yet. Click "Log Observation Session" above to conduct a classroom assessment.
                </div>
              ) : (
                observationSessions.map((session) => (
                <div key={session.id} className="p-5 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">{session.date}</span>
                        <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-800 text-xs font-medium">
                          {session.gradeLevel}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">Duration: {session.durationMinutes} min</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 mt-1">{session.activityContext}</h4>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-stone-600 block">Observer: <strong>{session.observerName}</strong></span>
                      <span className="text-emerald-700 font-semibold">{session.reviewerStatus}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
                    {OBSERVATION_RUBRIC_DOMAINS.map((domain) => {
                      const rating = session.ratings[domain.domainKey];
                      return (
                        <div key={domain.domainKey} className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-800 truncate text-[11px]">{domain.domainName}</span>
                            <span className="font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 text-xs">
                              {rating.score}/4
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-600 line-clamp-3 italic">
                            "{rating.factualExample || 'Demonstrated in session.'}"
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-xs text-stone-600 flex items-start gap-1.5 border-t border-stone-200/60">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Follow-up Recommendation: </strong>{session.followUpRecommendation}</span>
                  </div>
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* VIEW 4: IMPLEMENTATION, CONTEXT & VALUES-IN-ACTION                     */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'implementation' && (
        <div className="space-y-6">
          {/* View Mode Switcher for Section 11 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div>
              <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">
                Section 11 of Manual · Telemetry Mode
              </span>
              <h3 className="text-base font-bold text-stone-900">
                Fidelity, Participation & Climate Evidence
              </h3>
            </div>

            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                onClick={() => setImplementationDisplayMode('charts')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  implementationDisplayMode === 'charts'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#4A6B53]" />
                <span>Interactive Charts (Recharts)</span>
              </button>
              <button
                onClick={() => setImplementationDisplayMode('cards')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  implementationDisplayMode === 'cards'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#4A6B53]" />
                <span>Metric Cards</span>
              </button>
            </div>
          </div>

          {implementationDisplayMode === 'charts' ? (
            <div className="space-y-6">
              {/* 1. School-Level Participation Data */}
              <SchoolParticipationChart />

              {/* 2. Emotional Climate Trends */}
              <EmotionalClimateTrendsChart />

              {/* 3. Alignment Progress */}
              <AlignmentProgressChart />
            </div>
          ) : (
            /* Section 11: Reach, Dose & Fidelity KPIs (Card Mode) */
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">Section 11 of Manual</span>
                <h3 className="text-xl font-editorial font-bold text-stone-900 mt-0.5">
                  Implementation Fidelity, Reach & Dose
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  The opportunity to practise affects observed outcomes. We track dose, fidelity, and school context directly alongside student competencies.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Learner Reach</span>
                  <span className="text-2xl font-bold font-mono text-[#4A6B53] mt-1 block">
                    {INITIAL_IMPLEMENTATION_METRICS.reachLearnersPercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">144 of 153 enrolled</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Adult Staff Reach</span>
                  <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
                    {INITIAL_IMPLEMENTATION_METRICS.reachAdultsPercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">24 of 25 faculty active</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Delivered vs Planned</span>
                  <span className="text-2xl font-bold font-mono text-emerald-800 mt-1 block">
                    {INITIAL_IMPLEMENTATION_METRICS.deliveredSessions} / {INITIAL_IMPLEMENTATION_METRICS.plannedSessions}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">92% delivery adherence</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Core Fidelity Rate</span>
                  <span className="text-2xl font-bold font-mono text-[#4A6B53] mt-1 block">
                    {INITIAL_IMPLEMENTATION_METRICS.coreComponentsPercent}%
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Quality audit verified</span>
                </div>
              </div>

              {/* School Context & Psychological Safety Indicators */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-3">
                  School Context & Psychological Safety (Reported Separately)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <span className="text-xs font-bold text-stone-800 block">Classroom Sense of Belonging</span>
                    <span className="text-lg font-bold font-mono text-[#4A6B53] mt-1 block">
                      {INITIAL_IMPLEMENTATION_METRICS.belongingContextScore}%
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">Learners feel welcomed and heard in class.</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <span className="text-xs font-bold text-stone-800 block">Perceived Emotional Safety</span>
                    <span className="text-lg font-bold font-mono text-[#4A6B53] mt-1 block">
                      {INITIAL_IMPLEMENTATION_METRICS.perceivedSafetyScore}%
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">Safe asking for help when struggling.</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                    <span className="text-xs font-bold text-stone-800 block">Adult Psychological Safety</span>
                    <span className="text-lg font-bold font-mono text-purple-900 mt-1 block">
                      {INITIAL_IMPLEMENTATION_METRICS.adultPsychologicalSafetyScore}%
                    </span>
                    <span className="text-[11px] text-stone-600 block mt-0.5">Teachers safe discussing challenges without shame.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 10: Values-in-Action Project Evidence Dossier */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">Section 10 of Manual</span>
                <h3 className="text-xl font-editorial font-bold text-stone-900 mt-0.5">
                  Values-in-Action Project Evidence
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl">
                  Values-in-Action is assessed through real-life project dossiers, not multiple-choice questionnaires. Evaluated across 5 dimensions: Need, Perspective, Decision, Action, and Reflection.
                </p>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 shrink-0">
                Accredited Dossier Candidates
              </span>
            </div>

            {/* 5-Dimension Rubric Definition Key */}
            <div className="p-4 bg-[#FAF9F5] rounded-xl border border-stone-200 text-xs grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <strong className="text-stone-900 block">1. Need</strong>
                <span className="text-stone-600 text-[11px]">Real & relevant community or school need identified.</span>
              </div>
              <div>
                <strong className="text-stone-900 block">2. Perspective</strong>
                <span className="text-stone-600 text-[11px]">Differing views & inclusion needs deeply considered.</span>
              </div>
              <div>
                <strong className="text-stone-900 block">3. Decision</strong>
                <span className="text-stone-600 text-[11px]">Evidence, safety, values, and consequences weighed.</span>
              </div>
              <div>
                <strong className="text-stone-900 block">4. Action</strong>
                <span className="text-stone-600 text-[11px]">Age-appropriate responsible action with adult support.</span>
              </div>
              <div>
                <strong className="text-stone-900 block">5. Reflection</strong>
                <span className="text-stone-600 text-[11px]">Results, unintended effects, and limitations examined.</span>
              </div>
            </div>

            {/* Values in Action Projects List */}
            <div className="space-y-4">
              {viaProjects.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-stone-200 text-stone-500 text-xs">
                  No Values-in-Action project dossiers submitted yet. Projects will appear here as students and teachers complete their community initiatives.
                </div>
              ) : (
                viaProjects.map((proj) => {
                const isExpanded = expandedProjectId === proj.id;
                return (
                  <div
                    key={proj.id}
                    className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    <div
                      onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-stone-50/80 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-xs font-bold font-mono">
                            {proj.gradeCohort}
                          </span>
                          <span className="text-xs text-stone-500 font-medium">{proj.term}</span>
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-xs font-medium">
                            Lead: {proj.teacherLead}
                          </span>
                        </div>
                        <h4 className="text-base font-editorial font-bold text-stone-900">
                          {proj.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                          {proj.dossierStatus}
                        </span>
                        <span className="text-xs text-stone-500 font-mono">{proj.artifactsCount} Artifacts</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-stone-100 bg-[#FAF9F5] space-y-3 text-xs animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                          <div className="p-3 bg-white rounded-lg border border-stone-200">
                            <strong className="text-stone-900 block font-semibold mb-1">Need:</strong>
                            <p className="text-stone-700 leading-relaxed">{proj.dimensions.need}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-stone-200">
                            <strong className="text-stone-900 block font-semibold mb-1">Perspective & Inclusion:</strong>
                            <p className="text-stone-700 leading-relaxed">{proj.dimensions.perspective}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-stone-200">
                            <strong className="text-stone-900 block font-semibold mb-1">Decision & Evidence:</strong>
                            <p className="text-stone-700 leading-relaxed">{proj.dimensions.decision}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg border border-stone-200">
                            <strong className="text-stone-900 block font-semibold mb-1">Action Implemented:</strong>
                            <p className="text-stone-700 leading-relaxed">{proj.dimensions.action}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-[#EAF0EB] rounded-lg border border-[#4A6B53]/30">
                          <strong className="text-emerald-950 block font-semibold mb-1">Reflection & Unintended Effects:</strong>
                          <p className="text-emerald-900 leading-relaxed">{proj.dimensions.reflection}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* VIEW 5: VISUAL TRENDS & TELEMETRY (RECHARTS SUITE)                     */}
      {/* ---------------------------------------------------------------------- */}
      {activeSubTab === 'visual_analytics' && (
        <div className="space-y-6">
          <ImpactChartsOverview />
        </div>
      )}
    </div>
  );
};
