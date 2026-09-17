import React, { useState } from 'react';
import {
  Settings,
  Shield,
  FileCheck2,
  Lock,
  History,
  Building,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Sliders,
  Users,
  Key,
} from 'lucide-react';
import { AuditEventItem } from '../../types/ceqhsUser';
import { DEFAULT_ROLE_PERMISSIONS } from '../../data/ceqhsUserData';

interface CeqhsSettingsProps {
  auditLogs: AuditEventItem[];
}

export const CeqhsSettings: React.FC<CeqhsSettingsProps> = ({ auditLogs }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'permissions' | 'confidentiality' | 'standards'>('audit');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');

  const exportAuditLogCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action Type', 'Details', 'School ID', 'IP Address'];
    const rows = auditLogs.map((a) => [
      `"${a.timestamp}"`,
      `"${a.actorName}"`,
      `"${a.actorRole}"`,
      `"${a.actionType}"`,
      `"${a.details}"`,
      `"${a.schoolId || '-'}"`,
      `"${a.ipAddress}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CEQHS_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = React.useMemo(() => {
    const seen = new Set<string>();
    return auditLogs.filter((log) => {
      if (!log?.id || seen.has(log.id)) return false;
      seen.add(log.id);

      if (!auditSearchQuery.trim()) return true;
      const q = auditSearchQuery.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.schoolName && log.schoolName.toLowerCase().includes(q))
      );
    });
  }, [auditLogs, auditSearchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Governance & Platform Policies</span>
            <span>·</span>
            <span>Central Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Settings & Audit Trail
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Audit logging, role-based access control policies, confidentiality boundaries, and institutional accreditation standards.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportAuditLogCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'audit' ? 'bg-[#1B3626] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          1. Security Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'permissions' ? 'bg-[#1B3626] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          2. RBAC Policy Definition
        </button>
        <button
          onClick={() => setActiveTab('confidentiality')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'confidentiality' ? 'bg-[#1B3626] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          3. Confidentiality & Safeguarding
        </button>
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === 'standards' ? 'bg-[#1B3626] text-white font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          4. Programme Accreditation
        </button>
      </div>

      {/* TAB 1: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Immutable Supervisory Audit Trail
              </h3>
              <p className="text-[11px] text-stone-500">
                Tamper-evident logs of all staff actions, dossier audits, milestone verifications, and permissions edits.
              </p>
            </div>
            <input
              type="text"
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              placeholder="Filter by actor, action, school..."
              className="text-xs px-3 py-1.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#1B3626] w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-3">Actor & Role</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredLogs.map((log, idx) => (
                  <tr key={`${log.id}-${idx}`} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-stone-500 whitespace-nowrap text-[11px]">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{log.actorName}</div>
                      <span className="text-[10px] text-stone-500 capitalize">{log.actorRole}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-700 max-w-md">
                      {log.details}
                      {log.schoolName && (
                        <span className="block text-[10px] text-[#1B3626] font-semibold mt-0.5">
                          School: {log.schoolName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-stone-400">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC POLICY DEFINITION */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              Active Role Permissions Schema
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Scope-based permission policies mapped to `platform_admin`, `programme_lead`, `reviewer`, and `observer`.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([roleKey, perms]) => (
                <div key={roleKey} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900 capitalize">
                      {roleKey.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                      Scope: {perms.tenants.scope}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-2 border-t border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Tenants:</span>
                      <span>{perms.tenants.add ? 'Create & Edit' : 'View only'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Evidence:</span>
                      <span>{perms.evidence.verify ? 'Verify & Review' : 'View only'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Milestones:</span>
                      <span>{perms.milestones.verify ? 'Verification enabled' : 'Restricted'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Dossiers:</span>
                      <span>{perms.dossiers.approve ? 'Approve & Publish' : 'Review only'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIDENTIALITY & SAFEGUARDING */}
      {activeTab === 'confidentiality' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4 text-xs text-stone-700">
          <h3 className="font-bold text-base text-stone-900">
            Student & Educator Confidentiality Boundaries
          </h3>
          <p className="text-stone-500">
            CEQHS operates on the principle of psychological safety and restorative dignity. All classroom practice artifacts must adhere to strict safeguarding constraints.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Student De-identification</span>
              <p className="text-[11px] text-stone-500">
                Classroom observation notes and student reflection excerpts must be anonymized before dossier inclusion.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Psychological Safety Shield</span>
              <p className="text-[11px] text-stone-500">
                Educator self-reflections cannot be used for punitive employment evaluations. They represent formative growth.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Tenant Isolation</span>
              <p className="text-[11px] text-stone-500">
                School data is cryptographically separated. No school can view another school's unverified dossiers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROGRAMME ACCREDITATION STANDARDS */}
      {activeTab === 'standards' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4 text-xs text-stone-700">
          <h3 className="font-bold text-base text-stone-900">
            CEQHS Accreditation & Quality Standards
          </h3>
          <p className="text-stone-500">
            Swataha's Continuous Emotional Quality in High Schools (CEQHS) framework benchmarks emotional literacy through 10 developmental milestones and verified living dossiers.
          </p>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-stone-800 font-bold">
              <span>Living Dossier Accreditation Threshold</span>
              <span>100% Verified Evidence Required</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Accreditation is awarded only when all 10 milestones have been completed and verified by a designated CEQHS Quality Reviewer and Platform Admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
