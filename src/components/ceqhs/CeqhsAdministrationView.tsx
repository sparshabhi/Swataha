import React, { useState } from 'react';
import {
  Shield,
  Users,
  Lock,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  UserCheck,
  Eye,
} from 'lucide-react';

interface CeqhsAdministrationViewProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const CeqhsAdministrationView: React.FC<CeqhsAdministrationViewProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'universal_core' | 'audit_logs'>('roles');

  // The 6 roles from Section 5
  const roles = [
    {
      id: 'platform_admin',
      label: 'CEQHS Administrator (Super Admin)',
      holder: 'Saugat Singh Saud',
      desc: 'Sole authority for curriculum alignment approval, adapter updates, and system-wide governance.',
      permissions: ['Approve Mappings', 'Edit Core Framework', 'Assign Schools', 'Full Audit Log'],
    },
    {
      id: 'school_admin',
      label: 'School Owner / Leader',
      holder: 'Dr. Sunita Khadka (Swatara Core School)',
      desc: 'Approves annual school plan, allocates daily advisory timetable, reviews school-level aggregate evidence.',
      permissions: ['Approve Annual Plan', 'View Aggregate Impact', 'Manage Faculty Accounts'],
    },
    {
      id: 'facilitator',
      label: 'CEQHS Facilitator',
      holder: 'Pooja Pandey',
      desc: 'Conducts classroom walkthroughs, facilitates faculty learning circles, logs non-evaluative coaching notes.',
      permissions: ['Log Coaching Notes', 'Support Implementation', 'Review Artifacts'],
    },
    {
      id: 'teacher',
      label: 'Teacher / Staff Member',
      holder: 'Sarita Sharma (Grade 2 Orion)',
      desc: 'Delivers daily check-ins and micro-pauses, records practice fidelity, maintains confidential reflection journal.',
      permissions: ['Log Class Practice', 'Private Journal', 'View Assigned Activities'],
    },
    {
      id: 'reviewer',
      label: 'Reviewer / External Moderator',
      holder: 'Senior Moderation Board',
      desc: 'Audits evidence dossiers, verifies practice fidelity, and moderates Three-Year Award progress.',
      permissions: ['Moderate Award Evidence', 'Audit Dossiers', 'Issue Verification'],
    },
    {
      id: 'learner',
      label: 'Learner Account (Safe View)',
      holder: 'Primary Learner Profile (Grades 1–5)',
      desc: 'Minimalist, child-safe interface. Zero diagnostic labels, zero peer comparisons or public ranking.',
      permissions: ['Select Weather State', 'View Class Routine', 'Listen to Audio Chime'],
    },
  ];

  // The 5 universal core domains from Section 2.1
  const coreDomains = [
    {
      id: 'core-sa',
      title: '1. Self-Awareness',
      desc: 'Recognizing one’s emotions, thoughts, values, strengths, needs, triggers, and effects on behavior.',
      levels: {
        recognize: 'Identifies basic somatic sensations and emotional weather states.',
        apply: 'Uses the curious pause to name affective states before reacting.',
        transfer: 'Recognizes emotional patterns across different classroom subjects and playground contexts.',
        influence: 'Models emotional vulnerability and transparent self-naming for peers.',
      },
    },
    {
      id: 'core-sr',
      title: '2. Self-Regulation',
      desc: 'Managing attention, emotion, impulse, stress, and behavior in service of a goal.',
      levels: {
        recognize: 'Notices physiological signs of dysregulation (racing heartbeat, shallow breath).',
        apply: 'Engages the 3-breath grounding sequence independently during task transitions.',
        transfer: 'Regulates frustration during challenging academic inquiry or peer disagreement.',
        influence: 'Co-leads classroom mindful micro-pauses for the group.',
      },
    },
    {
      id: 'core-so',
      title: '3. Social Awareness',
      desc: 'Understanding other people’s perspectives, identities, emotions, needs, and contexts.',
      levels: {
        recognize: 'Notices non-verbal emotion cues in peers.',
        apply: 'Listens attentively during talking circles without interrupting.',
        transfer: 'Articulates a conflicting peer’s viewpoint in first person.',
        influence: 'Champions inclusive participation for quiet or multilingual classmates.',
      },
    },
    {
      id: 'core-rs',
      title: '4. Relationship Skills',
      desc: 'Building, maintaining, repairing, and ending relationships through communication and collaboration.',
      levels: {
        recognize: 'Identifies interpersonal tension and relational friction.',
        apply: 'Uses the 4-step restorative repair script (Noticed, Felt, Needed, Will Do).',
        transfer: 'Collaborates effectively in heterogeneous group inquiry projects.',
        influence: 'Acts as a peer conflict mediator on the playground Restorative Repair Bench.',
      },
    },
    {
      id: 'core-rd',
      title: '5. Responsible Decision-Making / Values-in-Action',
      desc: 'Applying ethical reasoning, values, consequences, agency, and responsibility to choices affecting self and others.',
      levels: {
        recognize: 'Anticipates personal and collective consequences of choices.',
        apply: 'Chooses prosocial actions aligned with community care.',
        transfer: 'Applies human values across home, school, and community spheres.',
        influence: 'Initiates and sustains authentic student-led campus stewardship projects.',
      },
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 5 &amp; 6 Governance
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Multi-Tenant Role Matrix &amp; Universal Core
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Platform Administration &amp; Roles
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Switch viewing roles to experience CEQHS Living Journey from the perspective of administrators, school leaders, teachers, facilitators, or learners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
              Active Role: <strong className="text-stone-900">{currentRole}</strong>
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 pt-5">
          {[
            { id: 'roles', label: 'Role-Based Access Switcher (6 Roles)' },
            { id: 'universal_core', label: 'CEQHS Universal Core Competency Library' },
            { id: 'audit_logs', label: 'Tamper-Evident Audit Trail' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1B3626] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Roles Switcher */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roles.map((r) => (
            <div
              key={r.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                currentRole === r.id
                  ? 'border-[#1B3626] bg-[#FDFBF7] ring-2 ring-[#1B3626]/20'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Role Profile
                  </span>
                  {currentRole === r.id && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900">
                  {r.label}
                </h3>
                <div className="text-xs text-stone-500 mt-0.5 font-medium">
                  {r.holder}
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {r.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Granted Permissions
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.permissions.map((p, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-stone-100">
                <button
                  onClick={() => onRoleChange(r.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    currentRole === r.id
                      ? 'bg-stone-200 text-stone-800'
                      : 'bg-[#1B3626] hover:bg-[#2D5A3D] text-white'
                  }`}
                >
                  {currentRole === r.id ? 'Currently Active' : `Switch to ${r.label.split(' ')[0]} View`}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Universal Core Library */}
      {activeTab === 'universal_core' && (
        <div className="space-y-6">
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 text-xs text-stone-800">
            <strong className="block text-sm font-bold text-stone-900 mb-1">
              The Canonical CEQHS Competency Architecture (Section 2.1)
            </strong>
            The universal core defines what we believe and develop across all institutions. It remains invariant across schools; only the Curriculum Adapter changes to establish natural entry points into each school&apos;s specific framework.
          </div>

          <div className="space-y-5">
            {coreDomains.map((dom) => (
              <div key={dom.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">
                    {dom.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {dom.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">
                      Level 1: Recognize
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {dom.levels.recognize}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">
                      Level 2: Apply
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {dom.levels.apply}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider">
                      Level 3: Transfer
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {dom.levels.transfer}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 text-xs space-y-1">
                    <div className="font-bold text-[#1B3626] text-[11px] uppercase tracking-wider">
                      Level 4: Influence
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {dom.levels.influence}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900">
              Immutable Governance Audit Trail
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Cryptographically signed actions recording approvals, revisions, and evidence moderation.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                time: '2026-09-17 08:30:12',
                actor: 'Saugat Singh Saud (Founder & Chief Architect)',
                action: 'Approved Curriculum Mapping CEQHS-MAP-IB-001 for Pilot Use in Swatara Core School',
                type: 'APPROVAL',
              },
              {
                time: '2026-09-16 14:15:00',
                actor: 'Dr. Sunita Khadka (Lead Administrator)',
                action: 'Signed Year 1 Foundation Charter & Allocated Daily Morning Advisory Timetable',
                type: 'CHARTER',
              },
              {
                time: '2026-09-15 11:20:45',
                actor: 'Sarita Sharma (Homeroom Educator)',
                action: 'Logged Verified Implementation Record impl-rec-001 (Reach 100%, Fidelity 92%)',
                type: 'EVIDENCE',
              },
            ].map((log, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-stone-900">
                    {log.action}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    By: {log.actor}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-stone-400">{log.time}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-800">
                    {log.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
