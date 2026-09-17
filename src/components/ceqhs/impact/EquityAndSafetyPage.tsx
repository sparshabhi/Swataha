import React from 'react';
import {
  ShieldAlert,
  Lock,
  EyeOff,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { SWATARA_EQUITY_DATA } from '../../../data/impactEvidenceData';

export const EquityAndSafetyPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900">
            Impact Layer 7
          </span>
          <span className="text-xs text-stone-500 font-medium">Child Protection &amp; Differential Benefit</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Equity, Inclusion &amp; Psychological Safety
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Examining differential reach, accessibility adaptations, and unintended consequences. Governed by strict minimum-cell privacy suppression (cells with n &lt; 5 are masked) and complete separation of child safeguarding records from public reporting.
        </p>
      </div>

      {/* CORE GUIDING EQUITY QUESTION */}
      <div className="p-4 rounded-xl bg-[#1B3626] text-white flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
            Institutional Equity Mandate
          </span>
          <p className="text-sm font-semibold italic">
            "Who is benefiting, who is not being reached, and what conditions explain the difference?"
          </p>
        </div>
        <span className="px-3 py-1 rounded-lg bg-emerald-900/60 text-xs font-medium border border-emerald-700/60 shrink-0">
          Privacy-Safe Aggregation
        </span>
      </div>

      {/* SUBGROUP DATA TABLE (WITH CELL SUPPRESSION) */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Differential Exposure &amp; Adaptations by Learner Cohort
            </h2>
            <p className="text-xs text-stone-500">
              Evaluating reach, dose adherence, and required accessibility accommodations.
            </p>
          </div>
          <span className="text-xs text-stone-400 font-mono">Minimum Cell Rule: n &lt; 5</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200/60">
              <tr>
                <th className="p-4">Cohort / Subgroup</th>
                <th className="p-4">Enrolled (n)</th>
                <th className="p-4">Program Reach</th>
                <th className="p-4">Full Dose Received</th>
                <th className="p-4">Observed Shift / Status</th>
                <th className="p-4">Accessibility Adaptations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {SWATARA_EQUITY_DATA.map((row, idx) => (
                <tr
                  key={idx}
                  className={row.cellSuppressed ? 'bg-amber-50/40 text-stone-500' : 'hover:bg-stone-50/60'}
                >
                  <td className="p-4 font-semibold text-stone-900">
                    <div className="flex items-center gap-2">
                      <span>{row.groupName}</span>
                      {row.cellSuppressed && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                          <EyeOff className="w-3 h-3" /> Suppressed
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-normal">{row.category}</span>
                  </td>

                  <td className="p-4 font-mono font-medium">
                    {row.cellSuppressed ? '< 5' : row.enrolled}
                  </td>

                  <td className="p-4">
                    {row.cellSuppressed ? (
                      <span className="italic text-stone-400">Masked</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{row.reachPct}%</span>
                        <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1B3626] h-full rounded-full"
                            style={{ width: `${row.reachPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {row.cellSuppressed ? (
                      <span className="italic text-stone-400">Masked</span>
                    ) : (
                      <span className="font-semibold text-stone-800">{row.receivedDosePct}%</span>
                    )}
                  </td>

                  <td className="p-4 text-[11px] leading-snug">
                    {row.cellSuppressed ? (
                      <span className="text-amber-800 italic font-medium">
                        Suppressed for Child Protection &amp; Re-identification Prevention
                      </span>
                    ) : (
                      row.changeObserved
                    )}
                  </td>

                  <td className="p-4 text-[11px] text-stone-600">
                    {row.accessibilityAdaptation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHILD SAFEGUARDING SEPARATION PROTOCOL */}
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-stone-700" />
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Child Protection &amp; Safeguarding Pathway Protocol
          </h3>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed max-w-4xl">
          If a student discloses distress or abuse during a restorative check-in or emotional weather activity, it is immediately routed through the school's designated Child Protection Officer via the statutory safeguarding ledger. It is <strong>never</strong> recorded or analyzed as standard impact data.
        </p>
      </div>
    </div>
  );
};
