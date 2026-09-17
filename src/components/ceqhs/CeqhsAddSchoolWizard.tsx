import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Building2,
  BookOpen,
  Layers,
  FileCheck2,
  ShieldAlert,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  PrimaryCurriculumType,
  GradeLevel,
  DevelopmentalBand,
  PilotSchoolTenant,
} from '../../types/ceqhsGovernance';
import {
  OFFICIAL_CURRICULUM_FRAMEWORKS,
  OFFICIAL_PHASES,
  INITIAL_CURRICULUM_MAPPINGS,
} from '../../data/ceqhsCurriculumBaseline';

interface CeqhsAddSchoolWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSchool: (school: PilotSchoolTenant, immediateActivation: boolean) => void;
}

export const CeqhsAddSchoolWizard: React.FC<CeqhsAddSchoolWizardProps> = ({
  isOpen,
  onClose,
  onSaveSchool,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Step 1: School Identity
  const [schoolName, setSchoolName] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [country, setCountry] = useState('Switzerland');
  const [cityRegion, setCityRegion] = useState('Geneva');
  const [schoolType, setSchoolType] = useState<'International' | 'Independent' | 'Public / State' | 'Charter / Trust'>('International');
  const [primaryContactName, setPrimaryContactName] = useState('');
  const [primaryContactEmail, setPrimaryContactEmail] = useState('');
  const [primaryContactRole, setPrimaryContactRole] = useState('Primary School Head');
  const [website, setWebsite] = useState('');
  const [timeZone, setTimeZone] = useState('CET (UTC+1)');

  // Step 2: Curriculum & Grade Scope
  const [primaryCurriculum, setPrimaryCurriculum] = useState<PrimaryCurriculumType>('International Baccalaureate (IB)');
  const [curriculumVersion, setCurriculumVersion] = useState('IB Primary Years Programme (PYP) 2026');
  const [selectedGrades, setSelectedGrades] = useState<GradeLevel[]>([
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ]);
  const [selectedDevBands, setSelectedDevBands] = useState<DevelopmentalBand[]>([
    'Foundation (Grade 1–2)',
    'Developing (Grade 3–4)',
    'Transition (Grade 5)',
  ]);
  const [existingSelFramework, setExistingSelFramework] = useState('PYP Learner Profile & Pastoral Guidance');
  const [curriculumCoordinator, setCurriculumCoordinator] = useState('');
  const [curriculumCoordinatorEmail, setCurriculumCoordinatorEmail] = useState('');

  // Step 3: Programme Configuration
  const [programmeVersion, setProgrammeVersion] = useState('CEQHS Grade 1–5 Pilot Framework v1.0');
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(0); // Phase 0
  const [startDate, setStartDate] = useState('2026-10-01');
  const [implementationCycle, setImplementationCycle] = useState('Cycle 1 (Autumn / Winter 2026)');
  const [leadTeacherName, setLeadTeacherName] = useState('');
  const [enrolledTeachersCount, setEnrolledTeachersCount] = useState<number>(5);
  const [reviewRhythm, setReviewRhythm] = useState('Bi-weekly check-ins with monthly dossier synthesis');

  // Step 4: Curriculum Alignment Decisions
  const [alignmentDecisions, setAlignmentDecisions] = useState<Record<string, 'Accepted' | 'Deferred' | 'Custom Note'>>({
    'map-ib-1': 'Accepted',
    'map-ib-2': 'Accepted',
    'map-ox-1': 'Accepted',
    'map-ca-1': 'Accepted',
    'map-nc-1': 'Accepted',
  });

  // Step 5: Privacy & Safeguarding Acknowledgements
  const [agreeScopeBoundary, setAgreeScopeBoundary] = useState(false);
  const [agreeDataMinimisation, setAgreeDataMinimisation] = useState(false);
  const [agreeDeIdentification, setAgreeDeIdentification] = useState(false);
  const [agreeReflectionSeparation, setAgreeReflectionSeparation] = useState(false);

  if (!isOpen) return null;

  // Auto-generate tenant ID when school name updates
  const handleNameChange = (val: string) => {
    setSchoolName(val);
    if (!tenantId || tenantId.startsWith('TENANT-')) {
      const slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 16);
      setTenantId(`TENANT-${slug.toUpperCase() || 'NEW'}`);
    }
  };

  const toggleGrade = (g: GradeLevel) => {
    if (selectedGrades.includes(g)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(selectedGrades.filter((item) => item !== g));
      }
    } else {
      setSelectedGrades([...selectedGrades, g].sort());
    }
  };

  const selectedCurriculumFramework = OFFICIAL_CURRICULUM_FRAMEWORKS.find(
    (f) => f.name === primaryCurriculum
  );

  const relevantMappings = INITIAL_CURRICULUM_MAPPINGS.filter(
    (m) => m.frameworkName === primaryCurriculum
  );

  const handleFinalSubmit = (immediateActivation: boolean) => {
    const newSchool: PilotSchoolTenant = {
      id: `school-${Date.now()}`,
      tenantId: tenantId || `TENANT-${Date.now().toString().slice(-6)}`,
      name: schoolName.trim() || 'New Partner School',
      code: tenantId.replace('TENANT-', '') || 'SCH',
      location: `${cityRegion}, ${country}`,
      country,
      region: cityRegion,
      schoolType,
      primaryContactName: primaryContactName || 'School Administrator',
      primaryContactEmail: primaryContactEmail || 'admin@school.org',
      primaryContactRole,
      website,
      timeZone,
      curriculum: {
        primaryCurriculum,
        curriculumVersionOrCountry: curriculumVersion,
        participatingGrades: selectedGrades,
        developmentalGroupingPreference: selectedDevBands,
        existingWellbeingOrSELFramework: existingSelFramework,
        curriculumCoordinatorName: curriculumCoordinator || primaryContactName,
        curriculumCoordinatorEmail: curriculumCoordinatorEmail || primaryContactEmail,
        alignmentAcknowledgementAccepted: true,
        acknowledgedAt: new Date().toISOString(),
      },
      currentPhase: OFFICIAL_PHASES[selectedPhaseNumber] || OFFICIAL_PHASES[0],
      approvalStatus: immediateActivation ? 'Active' : 'Draft',
      approvedBy: immediateActivation ? 'Saugat Singh' : undefined,
      approvedAt: immediateActivation ? new Date().toISOString() : undefined,
      onboardedAt: new Date().toISOString(),
      partnershipStartDate: startDate,
      leadTeacherName,
      enrolledTeachersCount,
      participatingGrades: selectedGrades,
      implementationCycle,
      dossierSubmissionCount: 0,
      evidenceCount: 0,
      safeguardingAcknowledged: true,
      dataMinimisationAcknowledged: agreeDataMinimisation,
    };

    onSaveSchool(newSchool, immediateActivation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-[#1B3626] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#EAF0EB]" />
              <h2 className="text-base font-bold">Add CEQHS Partner School Tenant</h2>
            </div>
            <p className="text-xs text-stone-200 mt-0.5">
              Grade 1–5 Focused SEL Implementation · Founder Approval Gateway
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-semibold text-stone-600 overflow-x-auto">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>1</span>
            Identity
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>2</span>
            Curriculum & Grades
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>3</span>
            Programme
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>4</span>
            Alignment
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 ${step === 5 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 5 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>5</span>
            Privacy
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <div className={`flex items-center gap-1.5 ${step === 6 ? 'text-[#1B3626] font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 6 ? 'bg-[#1B3626] text-white' : 'bg-stone-200'}`}>6</span>
            Review
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-stone-800">
          {/* STEP 1: School Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">Step 1: School Identity & Tenant Allocation</span>
                <p className="mt-0.5 text-stone-600">
                  Configure foundational institutional metadata. A secure, isolated tenant ID is generated for server-side boundary enforcement.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-800 mb-1">
                    Official School Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Greenwood International Primary School"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    System Tenant ID (Generated) *
                  </label>
                  <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="w-full font-mono text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">School Type *</label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="International">International School</option>
                    <option value="Independent">Independent / Private</option>
                    <option value="Public / State">Public / State School</option>
                    <option value="Charter / Trust">Charter / Trust Academy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Country *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">City or Region *</label>
                  <input
                    type="text"
                    value={cityRegion}
                    onChange={(e) => setCityRegion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Primary Contact / Head of School *
                  </label>
                  <input
                    type="text"
                    value={primaryContactName}
                    onChange={(e) => setPrimaryContactName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Pendelton"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={primaryContactEmail}
                    onChange={(e) => setPrimaryContactEmail(e.target.value)}
                    placeholder="headmaster@school.org"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Time Zone *</label>
                  <input
                    type="text"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Curriculum & Grade Scope */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">
                  Step 2: Primary Curriculum Selection & Grade 1–5 Boundary
                </span>
                <p className="mt-0.5 text-stone-600">
                  Select the school's primary curriculum framework and participating Grades 1–5. Active CEQHS implementation is strictly scoped to primary education.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Required Primary Curriculum *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OFFICIAL_CURRICULUM_FRAMEWORKS.map((curr) => {
                    const isSelected = primaryCurriculum === curr.name;
                    return (
                      <div
                        key={curr.id}
                        onClick={() => setPrimaryCurriculum(curr.name)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#EAF0EB]/60 border-[#2D5A3D] ring-1 ring-[#2D5A3D]'
                            : 'bg-stone-50 border-stone-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 text-xs">{curr.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 font-bold">
                            {curr.shortCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">
                          {curr.defaultLabel}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curriculum Specific Guidance Card */}
              {selectedCurriculumFramework && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-700" />
                    Curriculum Alignment Context & Disclaimer
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {selectedCurriculumFramework.disclaimer}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Curriculum Version or Jurisdiction *
                  </label>
                  <input
                    type="text"
                    value={curriculumVersion}
                    onChange={(e) => setCurriculumVersion(e.target.value)}
                    placeholder="e.g. IB PYP 2026 / Cambridge Primary 2025"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Existing Wellbeing / SEL Structure
                  </label>
                  <input
                    type="text"
                    value={existingSelFramework}
                    onChange={(e) => setExistingSelFramework(e.target.value)}
                    placeholder="e.g. Learner Profile, Pastoral Period"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              {/* Participating Grades 1-5 Scope Checkboxes */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Participating Pilot Grades (Grades 1–5 Only) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as GradeLevel[]).map(
                    (grade) => {
                      const isChecked = selectedGrades.includes(grade);
                      return (
                        <button
                          type="button"
                          key={grade}
                          onClick={() => toggleGrade(grade)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isChecked
                              ? 'bg-[#1B3626] text-white border-[#1B3626]'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {grade}
                        </button>
                      );
                    }
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Secondary grades (Grade 6–12) are out of scope for this pilot phase and cannot be assigned active CEQHS practices.
                </p>
              </div>

              {/* Developmental Grouping Preference */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Configured Developmental Groupings
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-center">
                    <span className="block font-bold text-stone-800">Foundation</span>
                    <span className="text-[10px] text-stone-500">Grades 1–2</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-center">
                    <span className="block font-bold text-stone-800">Developing</span>
                    <span className="text-[10px] text-stone-500">Grades 3–4</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-center">
                    <span className="block font-bold text-stone-800">Transition</span>
                    <span className="text-[10px] text-stone-500">Grade 5</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Programme Configuration */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">Step 3: Programme Configuration & Phase Setting</span>
                <p className="mt-0.5 text-stone-600">
                  Assign initial implementation phase and rhythm. Phase 0 is recommended for onboarding and readiness.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    CEQHS Programme Version
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={programmeVersion}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Initial Programme Phase *
                  </label>
                  <select
                    value={selectedPhaseNumber}
                    onChange={(e) => setSelectedPhaseNumber(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    {OFFICIAL_PHASES.map((p) => (
                      <option key={p.phaseId} value={p.phaseNumber}>
                        Phase {p.phaseNumber}: {p.workingLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Target Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Implementation Cycle Code *
                  </label>
                  <input
                    type="text"
                    value={implementationCycle}
                    onChange={(e) => setImplementationCycle(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Lead Educator / Implementation Anchor
                  </label>
                  <input
                    type="text"
                    value={leadTeacherName}
                    onChange={(e) => setLeadTeacherName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Participating Teachers Cohort Size *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={enrolledTeachersCount}
                    onChange={(e) => setEnrolledTeachersCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  CEQHS Advisory & Review Rhythm
                </label>
                <input
                  type="text"
                  value={reviewRhythm}
                  onChange={(e) => setReviewRhythm(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Curriculum Alignment Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">
                  Step 4: Curriculum Alignment Hypotheses Review
                </span>
                <p className="mt-0.5 text-stone-600">
                  Review suggested alignments connecting Grade 1–5 CEQHS practices to{' '}
                  <strong className="text-stone-900">{primaryCurriculum}</strong> language. Founder Saugat Singh reviews and approves these mappings before they become active in the school workspace.
                </p>
              </div>

              <div className="space-y-3">
                {relevantMappings.length === 0 ? (
                  <div className="p-6 bg-stone-50 rounded-xl border text-center text-stone-500">
                    No pre-seeded mappings found for this framework. You can defer custom alignment until onboarding Phase 0.
                  </div>
                ) : (
                  relevantMappings.map((map) => {
                    const decision = alignmentDecisions[map.id] || 'Accepted';
                    return (
                      <div
                        key={map.id}
                        className="p-4 rounded-xl border border-stone-200 bg-white space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                              {map.connectionTypeLabel}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 mt-1">
                              {map.ceqhsPracticeName} ↔ {map.outcomeReferenceCode}: {map.outcomeTitle}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setAlignmentDecisions({ ...alignmentDecisions, [map.id]: 'Accepted' })
                              }
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                decision === 'Accepted'
                                  ? 'bg-[#1B3626] text-white'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setAlignmentDecisions({ ...alignmentDecisions, [map.id]: 'Deferred' })
                              }
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                decision === 'Deferred'
                                  ? 'bg-amber-800 text-white'
                                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              }`}
                            >
                              Defer
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                          {map.alignmentExplanation}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
                          <span>Grade Scope: {map.gradeRange}</span>
                          <span>Confidence: {map.confidenceStatus}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Data & Privacy Acknowledgement */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">
                  Step 5: Privacy, Safeguarding & Student Data Minimisation
                </span>
                <p className="mt-0.5 text-stone-600">
                  Because this programme serves young learners in Grades 1–5, the platform strictly enforces ethical data minimisation and de-identification.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeScopeBoundary}
                    onChange={(e) => setAgreeScopeBoundary(e.target.checked)}
                    className="mt-0.5 rounded text-[#2D5A3D] focus:ring-[#2D5A3D]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Grades 1–5 Implementation Boundary Acknowledgement
                    </span>
                    <span className="text-[11px] text-stone-600">
                      I confirm that CEQHS implementation activities, evidence collection, and dossier synthesis for this tenant will be limited strictly to students in Grades 1 through 5.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeDataMinimisation}
                    onChange={(e) => setAgreeDataMinimisation(e.target.checked)}
                    className="mt-0.5 rounded text-[#2D5A3D] focus:ring-[#2D5A3D]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Student Data Minimisation & No Mandatory Names
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Student names are never required for ordinary classroom evidence. Student voice captures must be aggregated, thematic, or de-identified (e.g. "Student in Grade 2").
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeDeIdentification}
                    onChange={(e) => setAgreeDeIdentification(e.target.checked)}
                    className="mt-0.5 rounded text-[#2D5A3D] focus:ring-[#2D5A3D]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Image, Audio & Facial De-Identification Safeguards
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Photographs or artifacts uploaded to the evidence dossier should focus on student work, class charts, and reflective writing rather than identifiable student faces.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeReflectionSeparation}
                    onChange={(e) => setAgreeReflectionSeparation(e.target.checked)}
                    className="mt-0.5 rounded text-[#2D5A3D] focus:ring-[#2D5A3D]"
                  />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      Separation of Teacher Reflections & School-Visible Evidence
                    </span>
                    <span className="text-[11px] text-stone-600">
                      Teachers’ raw reflective notes remain confidential to the educator unless explicitly tagged for dossier inclusion by the educator.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Final Approval */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 p-3.5 rounded-xl text-stone-700">
                <span className="font-bold text-[#1B3626]">
                  Step 6: Summary Review & Founder Authorization
                </span>
                <p className="mt-0.5 text-stone-600">
                  Verify the school configuration before creating the tenant. As Super Admin, Saugat Singh can save as Draft or immediately Authorize & Activate.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b pb-2 border-stone-200">
                  <span className="font-bold text-stone-900 text-sm">{schoolName || 'Unnamed School'}</span>
                  <span className="font-mono text-[11px] text-stone-600 bg-white px-2 py-0.5 rounded border">
                    {tenantId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-stone-500 block">Primary Curriculum:</span>
                    <span className="font-bold text-[#1B3626]">{primaryCurriculum}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Participating Grades:</span>
                    <span className="font-bold text-stone-900">{selectedGrades.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Initial Phase:</span>
                    <span className="font-bold text-stone-900">
                      Phase {selectedPhaseNumber}: {OFFICIAL_PHASES[selectedPhaseNumber]?.workingLabel}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Lead Educator:</span>
                    <span className="font-semibold text-stone-900">{leadTeacherName || 'To be designated'}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Location:</span>
                    <span className="text-stone-900">{cityRegion}, {country}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Teacher Cohort Size:</span>
                    <span className="font-semibold text-stone-900">{enrolledTeachersCount} teachers</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <span className="font-bold block">Authority Gateway Notice</span>
                If saved as <strong>Draft</strong>, the tenant remains pending in the Approvals Hub. If <strong>Authorized & Activated</strong>, the school administrator receives login access to their isolated workspace.
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-3.5 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !schoolName.trim()) {
                    alert('Please enter a school name to proceed.');
                    return;
                  }
                  setStep((s) => (s + 1) as any);
                }}
                className="px-4 py-2 rounded-lg bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={!agreeScopeBoundary || !agreeDataMinimisation}
                  onClick={() => handleFinalSubmit(true)}
                  className={`px-4 py-2 rounded-lg text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs ${
                    agreeScopeBoundary && agreeDataMinimisation
                      ? 'bg-[#1B3626] hover:bg-[#2D5A3D]'
                      : 'bg-stone-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Activate School
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
