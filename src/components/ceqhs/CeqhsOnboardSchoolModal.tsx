import React, { useState } from 'react';
import {
  X,
  Building2,
  Users,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  School,
  UserCheck,
  BookOpen,
} from 'lucide-react';
import { CEQHSPartnerSchool, CEQHSStaffUser } from '../../types/ceqhsUser';

interface CeqhsOnboardSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: CEQHSStaffUser[];
  onCompleteOnboarding: (newSchool: Partial<CEQHSPartnerSchool>) => void;
}

export const CeqhsOnboardSchoolModal: React.FC<CeqhsOnboardSchoolModalProps> = ({
  isOpen,
  onClose,
  staff,
  onCompleteOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: School Details
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [region, setRegion] = useState('South West Division');
  const [type, setType] = useState<'Primary' | 'Secondary' | 'K-12'>('Secondary');
  const [academicYear, setAcademicYear] = useState('2026–27');
  const [location, setLocation] = useState('');

  // Step 2: Primary Contacts
  const [principalName, setPrincipalName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Step 3: Programme & Curriculum Selection
  const [programme, setProgramme] = useState('Whole-School Emotional Literacy & Restorative Culture');
  const [cohort, setCohort] = useState('Cohort 2026-Gamma');
  const [primaryCurriculum, setPrimaryCurriculum] = useState('International Baccalaureate (IB PYP)');
  const [curriculumJurisdiction, setCurriculumJurisdiction] = useState('');
  const [participatingGrades, setParticipatingGrades] = useState<string[]>([
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ]);

  // Step 4: Target Educators
  const [teachersCount, setTeachersCount] = useState<number>(36);
  const [cohortStructure, setCohortStructure] = useState<'All staff' | 'Pilot grade' | 'Subject leads'>('All staff');

  // Step 5: Baseline Survey Schedule
  const [surveyLaunchDate, setSurveyLaunchDate] = useState('2026-10-01');
  const [surveyCloseDate, setSurveyCloseDate] = useState('2026-10-21');

  // Step 6: CEQHS Team Assignment
  const [programmeLeadId, setProgrammeLeadId] = useState(
    staff.find((s) => s.role === 'programme_lead')?.id || staff[0]?.id || ''
  );
  const [reviewerId, setReviewerId] = useState(
    staff.find((s) => s.role === 'reviewer')?.id || staff[0]?.id || ''
  );
  const [observerId, setObserverId] = useState(
    staff.find((s) => s.role === 'observer')?.id || staff[0]?.id || ''
  );

  // Step 7: Confirmation & Welcome Pack
  const [sendWelcomePack, setSendWelcomePack] = useState(true);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      alert('Please provide a school name.');
      return;
    }
    if (currentStep === 2 && (!principalName.trim() || !contactEmail.trim())) {
      alert('Please provide contact details.');
      return;
    }
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete onboarding
      const leadUser = staff.find((s) => s.id === programmeLeadId);
      const generatedCode = code.trim() || `${name.slice(0, 3).toUpperCase()}-2026`;
      const tenantId = `TENANT-${generatedCode.slice(0, 4).toUpperCase()}`;

      const newSchool: Partial<CEQHSPartnerSchool> = {
        id: `tenant-${Date.now()}`,
        tenantId,
        name,
        code: generatedCode,
        location: location || `${region}, UK`,
        region,
        status: 'Onboarding',
        healthState: 'Healthy',
        currentPhase: 'ORIENTATION',
        implementationCycle: academicYear,
        programme,
        cohort,
        academicYear,
        schoolAdminName: leadName || principalName,
        schoolAdminEmail: contactEmail,
        assignedOwnerId: leadUser?.id || staff[0]?.id || 'staff-1',
        assignedOwnerName: leadUser?.name || staff[0]?.name || 'Saugat Singh',
        activeTeachersCount: Number(teachersCount) || 30,
        enrolledStudentsCount: (Number(teachersCount) || 30) * 22,
        trainingProgressPercent: 12,
        dossierProgressPercent: 8,
        milestonesReachedCount: 1,
        totalMilestonesCount: 10,
        evidenceCount: 0,
        reflectionsCount: 0,
        peerObservationsCount: 0,
        classroomAdaptationsCount: 0,
        lastActivityDate: 'Just now',
        riskStatus: 'normal',
        onboardingDate: new Date().toISOString().split('T')[0],
        motto: 'Cultivating emotional resilience, relational dignity, and conscious school culture.',
        primaryCurriculum,
        curriculumJurisdiction: curriculumJurisdiction.trim() || undefined,
        participatingGrades,
      };

      onCompleteOnboarding(newSchool);
      onClose();
      // Reset form
      setCurrentStep(1);
    }
  };

  const stepsList = [
    { num: 1, label: 'School Details' },
    { num: 2, label: 'Contacts' },
    { num: 3, label: 'Programme' },
    { num: 4, label: 'Educators' },
    { num: 5, label: 'Baseline Survey' },
    { num: 6, label: 'Team Assignment' },
    { num: 7, label: 'Confirmation' },
  ];

  const selectedLead = staff.find((s) => s.id === programmeLeadId);
  const selectedReviewer = staff.find((s) => s.id === reviewerId);
  const selectedObserver = staff.find((s) => s.id === observerId);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF9F5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3626] bg-[#1B3626]/10 px-2 py-0.5 rounded">
                7-Step Guided Workflow
              </span>
              <span className="text-xs text-stone-400">Step {currentStep} of 7</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-0.5">
              Onboard New Partner School
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-3 pb-2 border-b border-stone-100 bg-white">
          <div className="flex items-center justify-between">
            {stepsList.map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  s.num === currentStep
                    ? 'text-[#1B3626]'
                    : s.num < currentStep
                    ? 'text-emerald-700'
                    : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s.num === currentStep
                      ? 'bg-[#1B3626] text-white'
                      : s.num < currentStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {s.num < currentStep ? '✓' : s.num}
                </div>
                <span className="hidden sm:inline text-[11px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: School Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  1. School Identification & Region
                </h3>
                <p className="text-xs text-stone-500">
                  Establish the school's unique network identifier and governance profile.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    School Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!code) setCode(`${e.target.value.slice(0, 3).toUpperCase()}-2026`);
                    }}
                    placeholder="e.g. St. Jude's Collegiate Academy"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      School Code
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="e.g. SJU-2026"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white"
                    >
                      <option value="Secondary">Secondary</option>
                      <option value="Primary">Primary</option>
                      <option value="K-12">K-12 Comprehensive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Region / Consortium
                    </label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. South West Division"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cheltenham, Gloucestershire"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Primary Contacts */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  2. Leadership & Implementation Contacts
                </h3>
                <p className="text-xs text-stone-500">
                  Who will lead implementation on campus and maintain communications with CEQHS?
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      School Head / Principal *
                    </label>
                    <input
                      type="text"
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      placeholder="e.g. Dr. Arthur Vance"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Implementation Lead
                    </label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Elena Rostova (Vice Principal)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="principal@school.edu"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+44 117 900 1200"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Programme Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  3. CEQHS Programme Selection
                </h3>
                <p className="text-xs text-stone-500">
                  Select the core emotional literacy track and cohort assignment.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'Whole-School Emotional Literacy & Restorative Culture',
                    tag: 'CEQHS Core',
                    desc: 'Full campus immersion: adult self-regulation, classroom micro-pauses, and restorative dialogue.',
                  },
                  {
                    title: 'Secondary Relational Climate & Micro-Pause Practice',
                    tag: 'Secondary Focus',
                    desc: 'Aimed specifically at adolescents, high-friction transitions, and tutor advisory periods.',
                  },
                  {
                    title: 'Primary to Secondary Transition EQ Anchor',
                    tag: 'Transition Cohort',
                    desc: 'Anchoring Year 6 to 7 students with social-emotional grounding and emotional agility.',
                  },
                ].map((prog) => (
                  <div
                    key={prog.title}
                    onClick={() => setProgramme(prog.title)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      programme === prog.title
                        ? 'border-[#1B3626] bg-[#1B3626]/5 shadow-2xs ring-1 ring-[#1B3626]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">{prog.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {prog.tag}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{prog.desc}</p>
                  </div>
                ))}

                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Implementation Cohort
                  </label>
                  <input
                    type="text"
                    value={cohort}
                    onChange={(e) => setCohort(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>

                {/* Educational Board / Curriculum Section */}
                <div className="pt-3 border-t border-stone-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#1B3626]" />
                      <span>Educational Board / Curriculum Alignment *</span>
                    </label>
                    <select
                      value={primaryCurriculum}
                      onChange={(e) => setPrimaryCurriculum(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white"
                    >
                      <option value="International Baccalaureate (IB PYP)">
                        International Baccalaureate (IB Primary Years Programme - PYP)
                      </option>
                      <option value="Cambridge Primary (Stages 1–5)">
                        Cambridge Primary (Stages 1–5 / Cambridge International)
                      </option>
                      <option value="Nepal National Curriculum (CDC / CAS Framework)">
                        Nepal National Curriculum (CDC / Continuous Assessment System - CAS)
                      </option>
                      <option value="Oxford International Curriculum (OIC - Wellbeing & Global Skills)">
                        Oxford International Curriculum (OIC - Wellbeing & Global Skills)
                      </option>
                      <option value="National Curriculum for England">
                        National Curriculum for England (Key Stage 1 & 2)
                      </option>
                      <option value="Custom / Integrated Multi-Board">
                        Custom / Integrated Multi-Board Framework
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Curriculum Specification / Local Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={curriculumJurisdiction}
                      onChange={(e) => setCurriculumJurisdiction(e.target.value)}
                      placeholder="e.g. IB PYP 2026 Enhanced, CDC Grades 1-5 CAS, Cambridge Primary Stage 1-5"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    />
                  </div>

                  {/* Target Grades (Grades 1–5) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-700">
                        Program Target Grades *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (participatingGrades.length === 5) {
                            setParticipatingGrades(['Grade 1']);
                          } else {
                            setParticipatingGrades(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5']);
                          }
                        }}
                        className="text-[10px] font-semibold text-[#1B3626] hover:underline"
                      >
                        {participatingGrades.length === 5 ? 'Deselect All' : 'Select All (Grades 1–5)'}
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as const).map((grade) => {
                        const isSelected = participatingGrades.includes(grade);
                        return (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                if (participatingGrades.length > 1) {
                                  setParticipatingGrades(participatingGrades.filter((g) => g !== grade));
                                }
                              } else {
                                setParticipatingGrades([...participatingGrades, grade].sort());
                              }
                            }}
                            className={`py-1.5 text-xs font-bold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-[#1B3626] text-white border-[#1B3626] shadow-2xs'
                                : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {grade}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1">
                      Active implementation: <span className="font-semibold text-stone-700">{participatingGrades.join(', ')}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Target Educators */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  4. Participating Educator Cohort
                </h3>
                <p className="text-xs text-stone-500">
                  Specify cohort sizing and faculty participation boundaries.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Number of Participating Teachers
                  </label>
                  <input
                    type="number"
                    value={teachersCount}
                    onChange={(e) => setTeachersCount(Number(e.target.value))}
                    min={5}
                    max={300}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Estimated impact: ~{teachersCount * 22} students reached through classrooms.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Cohort Participation Structure
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'All staff', label: 'All Faculty', note: 'Whole-school rollout' },
                      { key: 'Pilot grade', label: 'Pilot Grade', note: 'Single grade cohort' },
                      { key: 'Subject leads', label: 'Leadership', note: 'Subject & pastoral leads' },
                    ].map((st) => (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setCohortStructure(st.key as any)}
                        className={`p-3 rounded-xl border text-left transition-colors ${
                          cohortStructure === st.key
                            ? 'border-[#1B3626] bg-[#1B3626]/5 font-bold text-[#1B3626]'
                            : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="text-xs font-bold">{st.label}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{st.note}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Baseline Survey Schedule */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  5. Baseline Survey Window
                </h3>
                <p className="text-xs text-stone-500">
                  Establish the diagnostic measurement window before classroom implementation begins.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Diagnostic Baseline Principle</span>
                Baseline survey measures educator emotional competence and relational safety prior to module completion.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Survey Launch Date
                  </label>
                  <input
                    type="date"
                    value={surveyLaunchDate}
                    onChange={(e) => setSurveyLaunchDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Survey Close Date
                  </label>
                  <input
                    type="date"
                    value={surveyCloseDate}
                    onChange={(e) => setSurveyCloseDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CEQHS Team Assignment */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  6. CEQHS Supervisory Team Assignment
                </h3>
                <p className="text-xs text-stone-500">
                  Assign the primary programme lead, quality reviewer, and research observer for this school.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Primary Programme Lead (School Advisor)
                  </label>
                  <select
                    value={programmeLeadId}
                    onChange={(e) => setProgrammeLeadId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role.replace('_', ' ')}) · {s.assignedCount} schools
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quality & Dossier Reviewer
                  </label>
                  <select
                    value={reviewerId}
                    onChange={(e) => setReviewerId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Academic / Research Observer
                  </label>
                  <select
                    value={observerId}
                    onChange={(e) => setObserverId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Confirmation & Welcome Pack */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  7. Review & Provision School Tenant
                </h3>
                <p className="text-xs text-stone-500">
                  Confirm the partner school initialization parameters.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">School Name:</span>
                  <span className="font-bold text-stone-900">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Programme:</span>
                  <span className="font-bold text-stone-900 truncate max-w-xs">{programme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Participating Teachers:</span>
                  <span className="font-bold text-stone-900">{teachersCount} teachers ({cohortStructure})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Baseline Window:</span>
                  <span className="font-bold text-stone-900">{surveyLaunchDate} to {surveyCloseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Assigned Programme Lead:</span>
                  <span className="font-bold text-[#1B3626]">{selectedLead?.name || 'Assigned Lead'}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sendWelcomePack"
                  checked={sendWelcomePack}
                  onChange={(e) => setSendWelcomePack(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1B3626] focus:ring-[#1B3626]"
                />
                <label htmlFor="sendWelcomePack" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Send welcome pack, governance charter, and portal invitation link to {contactEmail || 'school lead'}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-500 text-xs font-semibold hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>{currentStep === 7 ? 'Complete Onboarding' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
