import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  Building2,
  Clock,
  ArrowRight,
  Eye,
  Filter,
  Search,
  Shield,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { DossierModel, DossierStatus } from '../../types/ceqhsDossier';
import {
  SEED_PRIMARY_DOSSIERS,
  DEFAULT_23_DOSSIER_SECTIONS,
} from '../../data/ceqhsDossierBaseline';
import { CeqhsDossierStudio } from './CeqhsDossierStudio';
import { CeqhsDossierViewer } from './CeqhsDossierViewer';
import { CeqhsNewDossierWizard } from './CeqhsNewDossierWizard';
import { generatePrintableDossierPDF } from '../../lib/ceqhsDossierPdfEngine';

interface CeqhsDossierHubProps {
  currentUserRole?: string; // 'super_admin' | 'school_coordinator' | 'reviewer'
  currentUserName?: string;
  activeTenantId?: string;
  onNavigateBack?: () => void;
}

export const CeqhsDossierHub: React.FC<CeqhsDossierHubProps> = ({
  currentUserRole = 'super_admin',
  currentUserName = 'Saugat Singh',
  activeTenantId,
  onNavigateBack,
}) => {
  // Persistence with localStorage or baseline
  const [dossiers, setDossiers] = useState<DossierModel[]>(() => {
    try {
      const saved = localStorage.getItem('ceqhs_living_dossiers');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_PRIMARY_DOSSIERS;
  });

  const [activeSubView, setActiveSubView] = useState<
    'list' | 'studio' | 'viewer' | 'wizard' | 'templates' | 'generation_jobs'
  >('list');
  const [selectedDossierId, setSelectedDossierId] = useState<string>(
    SEED_PRIMARY_DOSSIERS[0]?.id || ''
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [curriculumFilter, setCurriculumFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const persistDossiers = (updated: DossierModel[]) => {
    setDossiers(updated);
    try {
      localStorage.setItem('ceqhs_living_dossiers', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const selectedDossier =
    dossiers.find((d) => d.id === selectedDossierId) || dossiers[0] || null;

  const handleUpdateDossier = (updated: DossierModel) => {
    const next = dossiers.map((d) => (d.id === updated.id ? updated : d));
    persistDossiers(next);
  };

  const handleCreateDossier = (newDossier: DossierModel) => {
    const next = [newDossier, ...dossiers];
    persistDossiers(next);
    setSelectedDossierId(newDossier.id);
    setActiveSubView('studio');
  };

  const handleQuickDownloadPdf = (d: DossierModel) => {
    setGeneratingPdfId(d.id);
    try {
      const { filename, doc } = generatePrintableDossierPDF(d, { paperSize: 'A4' });
      doc.save(filename);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingPdfId(null);
    }
  };

  // Filtered dossiers list
  const filteredDossiers = dossiers.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (curriculumFilter !== 'all' && d.primaryCurriculum !== curriculumFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.schoolName.toLowerCase().includes(q) ||
        d.primaryCurriculum.toLowerCase().includes(q) ||
        d.cycleName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* HUB SUBVIEW: NEW DOSSIER WIZARD */}
      {activeSubView === 'wizard' && (
        <CeqhsNewDossierWizard
          onCancel={() => setActiveSubView('list')}
          onDossierCreated={handleCreateDossier}
          isSchoolCoordinator={currentUserRole === 'school_coordinator'}
        />
      )}

      {/* HUB SUBVIEW: DOSSIER STUDIO */}
      {activeSubView === 'studio' && selectedDossier && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setActiveSubView('list')}
            className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium"
          >
            ← Back to All Dossiers
          </button>
          <CeqhsDossierStudio
            dossier={selectedDossier}
            onUpdateDossier={handleUpdateDossier}
            onOpenPreview={() => setActiveSubView('viewer')}
            onOpenVersionHistory={() => setActiveSubView('generation_jobs')}
            currentUserRole={currentUserRole}
            currentUserName={currentUserName}
          />
        </div>
      )}

      {/* HUB SUBVIEW: DIGITAL DOSSIER VIEWER */}
      {activeSubView === 'viewer' && selectedDossier && (
        <CeqhsDossierViewer
          dossier={selectedDossier}
          onBackToStudio={() => setActiveSubView('studio')}
        />
      )}

      {/* HUB SUBVIEW: TEMPLATES (23 SECTIONS MANAGER) */}
      {activeSubView === 'templates' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => setActiveSubView('list')}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
              >
                ← Back to All Dossiers
              </button>
              <h2 className="text-xl font-serif text-stone-900">Standard 23 Dossier Sections Specification</h2>
              <p className="text-xs text-stone-500">
                Official section blueprints, evidence expectations, and required verification criteria.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              CEQHS Standard v2.0
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_23_DOSSIER_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-700">
                    Section {sec.sectionNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                    Mandatory
                  </span>
                </div>
                <div className="font-semibold text-stone-900 text-sm">{sec.title}</div>
                <div className="text-xs text-[#2E523A] font-medium">{sec.subtitle}</div>
                <p className="text-xs text-stone-600 leading-relaxed">{sec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HUB SUBVIEW: GENERATION JOBS & VERSION LEDGER */}
      {activeSubView === 'generation_jobs' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                type="button"
                onClick={() => setActiveSubView('list')}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 font-medium mb-1"
              >
                ← Back to All Dossiers
              </button>
              <h2 className="text-xl font-serif text-stone-900">
                Publication Versions Ledger & Generation Jobs
              </h2>
              <p className="text-xs text-stone-500">
                Immutable audit ledger tracking PDF outputs, hashes, and authorized signatures.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {dossiers.flatMap((d) => d.versionHistory).length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-xl">
                No formal published version snapshots generated yet. Verify a dossier in the Studio to create an immutable publication record.
              </div>
            ) : (
              dossiers.flatMap((d) =>
                d.versionHistory.map((ver) => (
                  <div
                    key={ver.versionId}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{d.schoolName}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                          {ver.versionNumber}
                        </span>
                        <span className="text-stone-500">({ver.paperSize} Format)</span>
                      </div>
                      <div className="text-stone-600 mt-1">{ver.changelogReason}</div>
                      <div className="text-stone-400 font-mono text-[10px] mt-0.5">
                        Integrity Hash: {ver.integrityHash} · Approved by: {ver.approvedBy || 'Pending'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 text-[11px]">{ver.generatedAt}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickDownloadPdf(d)}
                        className="px-3 py-1.5 rounded-lg bg-[#2E523A] text-white hover:bg-[#24412e] text-xs font-medium flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      )}

      {/* HUB SUBVIEW: MAIN LIST VIEW */}
      {activeSubView === 'list' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2E523A]">
                  School Implementation Dossiers
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold">
                  Grades 1–5 Aligned
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
                Living Journey Dossier Hub
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Curate, verify, and export publication-ready A4 dossiers across partner school tenants.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveSubView('templates')}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-stone-500" />
                23 Sections Blueprint
              </button>

              <button
                type="button"
                onClick={() => setActiveSubView('wizard')}
                className="px-4 py-2 rounded-xl bg-[#2E523A] hover:bg-[#24412e] text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                New Implementation Dossier
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[200px] flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by school, curriculum, or cycle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-[#2E523A]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded-lg border border-stone-300 bg-white text-stone-700"
              >
                <option value="all">All Dossier Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Collecting evidence">Collecting evidence</option>
                <option value="School curation in progress">School curation in progress</option>
                <option value="Submitted to CEQHS">Submitted to CEQHS</option>
                <option value="Verified for publication">Verified for publication</option>
                <option value="Published">Published</option>
              </select>

              <select
                value={curriculumFilter}
                onChange={(e) => setCurriculumFilter(e.target.value)}
                className="p-2 rounded-lg border border-stone-300 bg-white text-stone-700"
              >
                <option value="all">All Primary Curricula</option>
                <option value="Cambridge Curriculum">Cambridge Curriculum</option>
                <option value="International Baccalaureate (IB)">IB Primary Years (PYP)</option>
                <option value="Oxford Curriculum">Oxford International</option>
                <option value="National Curriculum">National Curriculum (England)</option>
              </select>
            </div>

            <div className="text-stone-500 font-mono">
              Showing {filteredDossiers.length} of {dossiers.length} Dossiers
            </div>
          </div>

          {/* Dossiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDossiers.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-serif font-bold text-stone-900">No implementation dossiers yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                  Initialize a fresh dossier for an onboarded partner school to begin evidence curation and synthesis.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubView('wizard')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E523A] text-white text-xs font-medium hover:bg-[#24412e]"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  New Implementation Dossier
                </button>
              </div>
            ) : (
              filteredDossiers.map((d) => {
              const isVerified =
                d.status === 'Verified for publication' || d.status === 'Published';
              return (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs hover:border-[#2E523A]/40 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-[#2E523A]">
                            {d.primaryCurriculum}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {d.academicYear}
                          </span>
                        </div>
                        <h3 className="text-lg font-serif font-bold text-stone-900 mt-0.5">
                          {d.schoolName}
                        </h3>
                        <div className="text-xs text-stone-500">{d.schoolLocation}</div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'Submitted to CEQHS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {d.schoolNarrative}
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
                      <div className="p-2 rounded-lg bg-stone-50">
                        <div className="text-xs font-bold text-stone-900">
                          {d.targetSections.filter((s) => s.isIncluded).length}/23
                        </div>
                        <div className="text-[10px] text-stone-500">Sections</div>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50">
                        <div className="text-xs font-bold text-stone-900">
                          {d.visualEvidence.length}
                        </div>
                        <div className="text-[10px] text-stone-500">Evidence Assets</div>
                      </div>
                      <div className="p-2 rounded-lg bg-stone-50">
                        <div className="text-xs font-bold text-[#2E523A]">
                          {d.practiceStories.length}
                        </div>
                        <div className="text-[10px] text-stone-500">Practice Stories</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDownloadPdf(d)}
                      disabled={generatingPdfId === d.id}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-stone-500" />
                      {generatingPdfId === d.id ? 'Exporting...' : 'Export A4 PDF'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDossierId(d.id);
                          setActiveSubView('viewer');
                        }}
                        className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-stone-500" />
                        Reader
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDossierId(d.id);
                          setActiveSubView('studio');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2E523A] hover:bg-[#24412e] text-white text-xs font-medium shadow-xs flex items-center gap-1"
                      >
                        Open Studio
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>
      )}
    </div>
  );
};
