import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  X,
  UserCheck,
  Check,
  Minus,
  Settings2,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { CEQHSStaffUser, CEQHSUserRole, CEQHSPartnerSchool } from '../../types/ceqhsUser';

interface CeqhsTeamProps {
  staff: CEQHSStaffUser[];
  schools: CEQHSPartnerSchool[];
  onAddStaff: (newStaff: Partial<CEQHSStaffUser>) => void;
  onUpdateRole: (staffId: string, role: CEQHSUserRole) => void;
  onToggleActive: (staffId: string) => void;
  onAssignSchools?: (staffId: string, schoolIds: string[]) => void;
}

export const CeqhsTeam: React.FC<CeqhsTeamProps> = ({
  staff,
  schools,
  onAddStaff,
  onUpdateRole,
  onToggleActive,
  onAssignSchools,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'matrix'>('directory');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingStaffForAssignment, setEditingStaffForAssignment] = useState<CEQHSStaffUser | null>(null);

  // Invite Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<CEQHSUserRole>('programme_lead');
  const [formTitle, setFormTitle] = useState('Senior Programme Lead & School Advisor');
  const [formPhone, setFormPhone] = useState('+44 20 7946 0912');

  // School Assignment modal selection state
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<string[]>([]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    onAddStaff({
      name: formName,
      email: formEmail,
      role: formRole,
      title: formTitle,
      avatarInitials: formName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      assignedSchoolIds: [],
      assignedCount: 0,
      isActive: true,
      lastSignIn: 'Invited today',
      phone: formPhone,
    });

    setIsInviteModalOpen(false);
    setFormName('');
    setFormEmail('');
  };

  const openAssignmentModal = (member: CEQHSStaffUser) => {
    setEditingStaffForAssignment(member);
    setSelectedSchoolIds(member.assignedSchoolIds || []);
  };

  const saveAssignments = () => {
    if (editingStaffForAssignment && onAssignSchools) {
      onAssignSchools(editingStaffForAssignment.id, selectedSchoolIds);
    }
    setEditingStaffForAssignment(null);
  };

  // Canonical RBAC Matrix data per Prompt Section 9
  const RBAC_CAPABILITIES = [
    {
      key: 'manage_schools',
      label: 'Manage schools',
      description: 'Edit school metadata, contact leads, configuration & cycle details',
      super_admin: 'Global',
      programme_lead: 'Assigned',
      reviewer: 'No',
      observer: 'No',
    },
    {
      key: 'onboard_schools',
      label: 'Onboard schools',
      description: 'Provision new partner school tenants via 7-step wizard',
      super_admin: 'Global',
      programme_lead: 'No',
      reviewer: 'No',
      observer: 'No',
    },
    {
      key: 'review_evidence',
      label: 'Review evidence',
      description: 'Audit teacher practice artifacts and request revisions',
      super_admin: 'Global',
      programme_lead: 'Assigned',
      reviewer: 'Assigned',
      observer: 'Read-only',
    },
    {
      key: 'verify_milestones',
      label: 'Verify milestones',
      description: 'Sign off and verify 10 developmental school milestones',
      super_admin: 'Global',
      programme_lead: 'Assigned',
      reviewer: 'Assigned',
      observer: 'Read-only',
    },
    {
      key: 'approve_dossiers',
      label: 'Approve dossiers',
      description: 'Final institutional accreditation sign-off on living dossier',
      super_admin: 'Global',
      programme_lead: 'No',
      reviewer: 'No',
      observer: 'No',
    },
    {
      key: 'manage_staff',
      label: 'Manage CEQHS staff',
      description: 'Invite supervisory staff, adjust RBAC roles and assignments',
      super_admin: 'Global',
      programme_lead: 'No',
      reviewer: 'No',
      observer: 'No',
    },
    {
      key: 'export_data',
      label: 'Export network data',
      description: 'Download CSV reports, survey cross-comparisons, and audit logs',
      super_admin: 'Global',
      programme_lead: 'Assigned',
      reviewer: 'No',
      observer: 'Aggregated',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Governance & Role Hierarchy</span>
            <span>·</span>
            <span>CEQHS Platform Staff</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            CEQHS Team & Roles (RBAC)
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage CEQHS supervisory staff, school portfolio assignments, and scope-based permissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite CEQHS Staff</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs: Directory vs Role Matrix */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeSubTab === 'directory'
              ? 'bg-[#1B3626] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Staff Directory ({staff.length})
        </button>
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeSubTab === 'matrix'
              ? 'bg-[#1B3626] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Role Permissions Matrix (RBAC)
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 1: STAFF DIRECTORY                                       */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {staff.map((member) => (
              <div
                key={member.id}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-2xs ${
                  member.isActive ? 'border-stone-200/90' : 'border-stone-200 opacity-60 bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#1B3626]/10 text-[#1B3626] font-bold flex items-center justify-center text-sm border border-[#1B3626]/20">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-stone-900 leading-tight">
                            {member.name}
                          </h3>
                          {!member.isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{member.title}</p>
                      </div>
                    </div>

                    {/* Role Selector */}
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateRole(member.id, e.target.value as CEQHSUserRole)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-none focus:border-[#1B3626]"
                    >
                      <option value="super_admin">Platform Admin</option>
                      <option value="programme_lead">Programme Lead</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="observer">Observer</option>
                    </select>
                  </div>

                  {/* Portfolio & Contact Info */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-stone-400" />
                        <span>Assigned Portfolio:</span>
                      </span>
                      <button
                        onClick={() => openAssignmentModal(member)}
                        className="text-[#1B3626] font-bold hover:underline text-[11px]"
                      >
                        {member.assignedSchoolIds?.length || member.assignedCount} Schools (Edit)
                      </button>
                    </div>

                    {/* Assigned school chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.assignedSchoolIds && member.assignedSchoolIds.length > 0) ? (
                        member.assignedSchoolIds.map((sid) => {
                          const sc = schools.find((s) => s.id === sid);
                          return (
                            <span
                              key={sid}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                            >
                              {sc?.name || sid}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          No specific school assignments (Global or General)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{member.email}</span>
                      {member.phone && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span>{member.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">
                    Last active: {member.lastSignIn}
                  </span>

                  <button
                    onClick={() => onToggleActive(member.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      member.isActive
                        ? 'text-stone-600 hover:bg-stone-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold'
                    }`}
                  >
                    {member.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUB-TAB 2: ROLE PERMISSIONS MATRIX (RBAC)                        */}
      {/* ---------------------------------------------------------------- */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Role Permissions Matrix
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Granular functional capabilities and administrative boundaries per CEQHS staff role.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1B3626]/10 text-[#1B3626] self-start sm:self-center">
                RBAC Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-5">Capability / Workflow</th>
                    <th className="py-3 px-4 text-center">
                      <div className="font-bold text-stone-900">Platform Admin</div>
                      <span className="text-[10px] text-stone-500 font-normal lowercase">full control</span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <div className="font-bold text-stone-900">Programme Lead</div>
                      <span className="text-[10px] text-stone-500 font-normal lowercase">manages assigned</span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <div className="font-bold text-stone-900">Reviewer</div>
                      <span className="text-[10px] text-stone-500 font-normal lowercase">audits & verifies</span>
                    </th>
                    <th className="py-3 px-4 text-center">
                      <div className="font-bold text-stone-900">Observer</div>
                      <span className="text-[10px] text-stone-500 font-normal lowercase">read-only research</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {RBAC_CAPABILITIES.map((cap) => {
                    const renderBadge = (val: string) => {
                      if (val === 'Global') {
                        return (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            Global
                          </span>
                        );
                      }
                      if (val === 'Assigned') {
                        return (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                            Assigned
                          </span>
                        );
                      }
                      if (val.includes('Read') || val.includes('Aggregated')) {
                        return (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">
                            {val}
                          </span>
                        );
                      }
                      return (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium text-stone-400">
                          —
                        </span>
                      );
                    };

                    return (
                      <tr key={cap.key} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-stone-900">{cap.label}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{cap.description}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center">{renderBadge(cap.super_admin)}</td>
                        <td className="py-3.5 px-4 text-center">{renderBadge(cap.programme_lead)}</td>
                        <td className="py-3.5 px-4 text-center">{renderBadge(cap.reviewer)}</td>
                        <td className="py-3.5 px-4 text-center">{renderBadge(cap.observer)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL 1: INVITE STAFF MEMBER                                     */}
      {/* ---------------------------------------------------------------- */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">
                Invite CEQHS Staff Member
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Eleanor Vance"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.vance@ceqhs.org"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Assigned Staff Role *
                </label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as CEQHSUserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626] bg-white font-semibold"
                >
                  <option value="programme_lead">Programme Lead (Manages assigned schools)</option>
                  <option value="reviewer">Reviewer (Evidence audit & milestone verification)</option>
                  <option value="observer">Observer (Read-only research & governance)</option>
                  <option value="super_admin">Platform Admin (Full system control)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Institutional Job Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Lead School Advisor & EQ Mentor"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-semibold hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MODAL 2: ASSIGN SCHOOLS TO STAFF MEMBER                          */}
      {/* ---------------------------------------------------------------- */}
      {editingStaffForAssignment && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Assign Partner Schools
                </h3>
                <p className="text-xs text-stone-500">
                  {editingStaffForAssignment.name} · {editingStaffForAssignment.role.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={() => setEditingStaffForAssignment(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-2 max-h-60 overflow-y-auto">
              <span className="text-xs font-bold text-stone-700 block mb-1">
                Select partner schools to assign:
              </span>
              {schools.map((school) => {
                const isSelected = selectedSchoolIds.includes(school.id);
                return (
                  <label
                    key={school.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1B3626] bg-[#1B3626]/5 text-[#1B3626] font-bold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSchoolIds([...selectedSchoolIds, school.id]);
                          } else {
                            setSelectedSchoolIds(selectedSchoolIds.filter((id) => id !== school.id));
                          }
                        }}
                        className="w-4 h-4 rounded text-[#1B3626] focus:ring-[#1B3626]"
                      />
                      <span className="text-xs">{school.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {school.code}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 text-xs">
              <button
                type="button"
                onClick={() => setEditingStaffForAssignment(null)}
                className="px-4 py-2 rounded-xl text-stone-600 font-semibold hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAssignments}
                className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white font-bold shadow-xs transition-colors"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
