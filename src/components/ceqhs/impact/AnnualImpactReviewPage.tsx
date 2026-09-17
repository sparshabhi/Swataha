import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Sparkles,
  Layers,
  Sprout,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';

export const AnnualImpactReviewPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626]">
            Guided Institutional Synthesis
          </span>
          <span className="text-xs text-stone-500 font-medium">Academic Year 2026–2027</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Annual Impact Review (5-Step Evaluation)
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          A structured, 5-stage synthesis protocol guiding school leadership through planning, delivery, observed change, causal mechanisms, and prudent next steps.
        </p>

        {/* Step Indicator Navigation */}
        <div className="grid grid-cols-5 gap-2 pt-5 mt-4 border-t border-stone-100">
          {[
            { num: 1, label: '1. What Was Planned?' },
            { num: 2, label: '2. What Was Delivered?' },
            { num: 3, label: '3. What Changed?' },
            { num: 4, label: '4. What Explains It?' },
            { num: 5, label: '5. What Happens Next?' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                currentStep === s.num
                  ? 'bg-[#1B3626] text-white border-[#1B3626] shadow-xs'
                  : currentStep > s.num
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-stone-50 text-stone-500 border-stone-200/70 hover:bg-stone-100'
              }`}
            >
              <span className="text-[11px] font-bold block truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
        {/* STEP 1: WHAT WAS PLANNED */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Step 1: Approved Annual Objectives &amp; Targets
              </h2>
              <p className="text-xs text-stone-500">
                Foundational goals ratified in the Swataha Core School Annual Charter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#1B3626]">
                  Target Population
                </span>
                <div className="text-sm font-bold text-stone-900">360 Primary Students</div>
                <p className="text-stone-600 text-[11px]">
                  Grades 1–5 across 20 homerooms; 22 primary educators and 6 support faculty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#1B3626]">
                  Curriculum Anchor
                </span>
                <div className="text-sm font-bold text-stone-900">IB Primary Years (PYP)</div>
                <p className="text-stone-600 text-[11px]">
                  Integrated into ATL Self-Management strands; 15-min daily advisory timetabled.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#1B3626]">
                  Priority Need
                </span>
                <div className="text-sm font-bold text-stone-900">Post-Recess Dysregulation</div>
                <p className="text-stone-600 text-[11px]">
                  Baseline showed 8.5-min transition delay and high playground disputes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: WHAT WAS DELIVERED */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Step 2: Delivery Dosage, Reach &amp; Fidelity
              </h2>
              <p className="text-xs text-stone-500">
                Verifying program exposure before analyzing developmental change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">
                  Student Reach
                </span>
                <div className="text-2xl font-bold text-stone-900 mt-1">95.0%</div>
                <span className="text-[11px] text-stone-500">342 / 360 active</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">
                  Classroom Dosage
                </span>
                <div className="text-2xl font-bold text-stone-900 mt-1">18 / 20</div>
                <span className="text-[11px] text-stone-500">90% classrooms daily</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">
                  Facilitation Fidelity
                </span>
                <div className="text-2xl font-bold text-emerald-800 mt-1">88.4%</div>
                <span className="text-[11px] text-stone-500">12 audits completed</span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">
                  Faculty Coaching
                </span>
                <div className="text-2xl font-bold text-purple-900 mt-1">22 / 22</div>
                <span className="text-[11px] text-stone-500">100% staff engaged</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WHAT CHANGED */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Step 3: Multi-Level Observed Developmental Shifts
              </h2>
              <p className="text-xs text-stone-500">
                Observational, reflective, and administrative evidence with explicit uncertainty limits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-800">
                  Learner Level
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  Somatic emotion vocabulary recognition expanded from 41% to 84%. Post-recess transition quiet latency decreased by 60% (8.5 min → 3.4 min).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-purple-800">
                  Adult Level
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  Educator non-reactive pausing prior to discipline increased from 24% to 76%. Confidential reflection logs maintained weekly by 86% of faculty.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-blue-800">
                  School Climate
                </span>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  High-severity playground administrative referrals decreased from 14/month to 5/month as peer restorative agreements grew.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: WHAT EXPLAINS THE CHANGE */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Step 4: Causal Plausibility &amp; Alternative Hypotheses
              </h2>
              <p className="text-xs text-stone-500">
                Examining the theory-of-change mechanism alongside rival non-programmatic variables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-950">
                  Plausible Programmatic Mechanism
                </span>
                <p className="text-emerald-950 leading-relaxed text-[11px]">
                  Daily somatic down-regulation (3-breath acoustic chime) gave children a predictable bodily anchor to down-regulate sympathetic arousal post-recess before intellectual focus was demanded.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                <span className="text-[10px] font-bold uppercase text-amber-950">
                  Rival Explanations &amp; Contextual Factors
                </span>
                <p className="text-amber-950 leading-relaxed text-[11px]">
                  Corridor exit doors were widened in September, reducing physical bottleneck crowding. Autumn outdoor temperatures were also milder, which generally lowers recess fight rates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: WHAT HAPPENS NEXT */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Step 5: Prudent, Evidence-Grounded Improvement Plan
              </h2>
              <p className="text-xs text-stone-500">
                Specific actions categorized as: Continue, Adapt, Expand, Pause, or Provide Support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-900">
                  Continue &amp; Sustain
                </span>
                <h3 className="font-bold text-stone-900 text-xs">Daily Morning Advisory</h3>
                <p className="text-stone-600 text-[11px]">
                  Lock 15-minute ringfenced morning slot permanently into Term 2 master timetable.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-900">
                  Adapt Practice
                </span>
                <h3 className="font-bold text-stone-900 text-xs">Grade 4 Transition Huddle</h3>
                <p className="text-stone-600 text-[11px]">
                  Decouple homework submission from the post-recess calm chime in classrooms 4A &amp; 4B.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-100 text-blue-900">
                  Provide Support
                </span>
                <h3 className="font-bold text-stone-900 text-xs">Yard Duty Restorative Briefing</h3>
                <p className="text-stone-600 text-[11px]">
                  Conduct 15-min coaching on the 4-part restorative bench script for afternoon duty monitors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-stone-400 font-mono">
            Step {currentStep} of 5
          </span>

          <button
            disabled={currentStep === 5}
            onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1B3626] hover:bg-[#2D5A3D] text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
