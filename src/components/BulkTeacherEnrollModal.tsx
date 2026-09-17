import React, { useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Trash2,
  Sparkles,
  ArrowRight,
  Mail,
  KeyRound,
  FileText,
  Building2,
  Users,
  Check,
} from 'lucide-react';
import { TenantUser } from '../types';

interface ParsedTeacherRow {
  id: string;
  name: string;
  email: string;
  department: string;
  competencyFocus: string;
  status: 'valid' | 'duplicate' | 'invalid_email' | 'missing_name';
  errorMessage?: string;
  selected: boolean;
}

interface BulkTeacherEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
  existingUsers: TenantUser[];
  onBulkEnroll: (
    teachers: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>[],
    autoActivate: boolean,
    sendWelcomeEmail: boolean
  ) => void;
}

const SAMPLE_CSV_CONTENT = `Name,Email,Department,CompetencyFocus
Elena Rostova,elena.rostova@oakridge.edu,Visual Arts & Design,Know Yourself (Emotional Literacy)
Marcus Bell,marcus.bell@oakridge.edu,Mathematics & Computing,Pause & Regulate (Trigger Awareness)
Priya Patel,priya.patel@oakridge.edu,Science & Ecology,Empathetic Discipline (Restorative Circles)
David Kim,david.kim@oakridge.edu,Social Sciences & History,Psychological Belonging & Student Voice
Sarah Jenkins,sarah.jenkins@oakridge.edu,English & World Literature,Relational Safety & Non-Violent Communication
Carlos Mendez,carlos.mendez@oakridge.edu,Physical Education & Well-being,Co-Regulation & Grounding Practices`;

export const BulkTeacherEnrollModal: React.FC<BulkTeacherEnrollModalProps> = ({
  isOpen,
  onClose,
  tenantId,
  tenantName,
  existingUsers,
  onBulkEnroll,
}) => {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedTeacherRow[]>([]);
  const [autoActivate, setAutoActivate] = useState(true);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [hasParsed, setHasParsed] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [enrolledCount, setEnrolledCount] = useState(0);

  if (!isOpen) return null;

  const parseCsvData = (rawText: string) => {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedRows([]);
      setHasParsed(false);
      return;
    }

    // Determine delimiter
    const firstLine = lines[0];
    const delimiter = firstLine.includes('\t')
      ? '\t'
      : firstLine.includes(';')
      ? ';'
      : ',';

    // Check if first row is header
    const lowerFirst = firstLine.toLowerCase();
    const hasHeader =
      lowerFirst.includes('name') ||
      lowerFirst.includes('email') ||
      lowerFirst.includes('dept') ||
      lowerFirst.includes('focus');

    const dataLines = hasHeader ? lines.slice(1) : lines;
    const existingEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));
    const seenInBatch = new Set<string>();

    const rows: ParsedTeacherRow[] = dataLines.map((line, idx) => {
      // Split preserving quotes if simple
      const parts = line.split(delimiter).map((p) => p.replace(/^["']|["']$/g, '').trim());
      const name = parts[0] || '';
      const email = parts[1] || '';
      const department = parts[2] || 'Humanities & Sciences';
      const competencyFocus = parts[3] || 'Know Yourself (Emotional Literacy)';

      let status: ParsedTeacherRow['status'] = 'valid';
      let errorMessage: string | undefined;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        status = 'missing_name';
        errorMessage = 'Missing name';
      } else if (!email || !emailRegex.test(email)) {
        status = 'invalid_email';
        errorMessage = 'Invalid email syntax';
      } else if (existingEmails.has(email.toLowerCase())) {
        status = 'duplicate';
        errorMessage = 'Already registered on campus';
      } else if (seenInBatch.has(email.toLowerCase())) {
        status = 'duplicate';
        errorMessage = 'Duplicate email within spreadsheet';
      }

      if (email && emailRegex.test(email)) {
        seenInBatch.add(email.toLowerCase());
      }

      return {
        id: `row-${idx}-${Date.now()}`,
        name,
        email,
        department,
        competencyFocus,
        status,
        errorMessage,
        selected: status === 'valid',
      };
    });

    setParsedRows(rows);
    setHasParsed(true);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvText(content);
      parseCsvData(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadDemoCohort = () => {
    setCsvText(SAMPLE_CSV_CONTENT);
    parseCsvData(SAMPLE_CSV_CONTENT);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CEQHS_Teacher_Enrollment_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowFieldChange = (
    id: string,
    field: keyof ParsedTeacherRow,
    value: any
  ) => {
    setParsedRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          // Re-validate row if email/name changes
          if (field === 'email' || field === 'name') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!updated.name) {
              updated.status = 'missing_name';
              updated.errorMessage = 'Missing name';
            } else if (!updated.email || !emailRegex.test(updated.email)) {
              updated.status = 'invalid_email';
              updated.errorMessage = 'Invalid email syntax';
            } else {
              updated.status = 'valid';
              updated.errorMessage = undefined;
              updated.selected = true;
            }
          }
          return updated;
        }
        return r;
      })
    );
  };

  const handleToggleSelectRow = (id: string) => {
    setParsedRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r))
    );
  };

  const handleDeleteRow = (id: string) => {
    setParsedRows((prev) => prev.filter((r) => r.id !== id));
  };

  const selectedValidRows = parsedRows.filter((r) => r.selected && r.status === 'valid');

  const handleCommitEnrollment = () => {
    if (selectedValidRows.length === 0) return;

    const formattedTeachers = selectedValidRows.map((r) => ({
      tenantId,
      name: r.name.trim(),
      email: r.email.trim(),
      role: 'teacher' as const,
      title: `${r.department} Educator`,
      department: r.department,
      competencyFocus: r.competencyFocus,
      status: autoActivate ? ('active' as const) : ('pending_approval' as const),
    }));

    onBulkEnroll(formattedTeachers, autoActivate, sendWelcomeEmail);
    setEnrolledCount(formattedTeachers.length);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setCsvText('');
    setParsedRows([]);
    setHasParsed(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden text-stone-900 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B3626] text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  Bulk Teacher Enrollment via CSV
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  {tenantName}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Upload or paste a department roster to provision educator accounts in batch.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Batch Enrollment Completed
                </span>
                <h4 className="text-2xl font-editorial font-bold text-stone-900 mt-2">
                  {enrolledCount} Educators Successfully Enrolled!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto leading-relaxed">
                  All accounts have been created for <strong className="text-stone-900">{tenantName}</strong>.
                  {autoActivate
                    ? ' Accounts are OPEN and educators can log in immediately from the main portal.'
                    : ' Accounts are stored in the pending queue awaiting school coordinator sign-off.'}
                </p>
              </div>

              {sendWelcomeEmail && (
                <div className="p-3.5 max-w-md mx-auto bg-amber-50/80 border border-amber-200 rounded-xl text-left text-xs text-amber-950 flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-amber-900">
                      Welcome Email Dispatches Queued
                    </span>
                    <p className="text-[11px] text-stone-700 leading-relaxed mt-0.5">
                      Simulated welcome notices with login credentials and EQ practice guides have been delivered to each educator's profile and are visible in the Notification Hub.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  Return to School Dashboard
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Enroll Another Batch
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Top Controls & Template Download */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2 text-xs text-stone-700">
                  <FileText className="w-4 h-4 text-[#4A6B53]" />
                  <span>
                    Format: <code className="bg-stone-200 px-1 py-0.5 rounded text-[11px] font-mono">Name, Email, Department, CompetencyFocus</code>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadDemoCohort}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Load Demo Sample (6 Educators)</span>
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone & Textarea */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Drag & Drop Box */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[160px] cursor-pointer ${
                    dragActive
                      ? 'border-[#4A6B53] bg-emerald-50/50'
                      : 'border-stone-300 hover:border-stone-400 bg-[#FAF9F5]'
                  }`}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv, text/csv, text/plain';
                    input.onchange = (e: any) => {
                      if (e.target?.files?.[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="w-8 h-8 text-stone-400 mb-2" />
                  <span className="text-xs font-bold text-stone-900 block">
                    Drop your .csv file here
                  </span>
                  <span className="text-[11px] text-stone-500 mt-0.5">
                    or click to browse from your computer
                  </span>
                </div>

                {/* Direct Paste Area */}
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
                    <span>Or Paste Raw CSV Data</span>
                    {csvText && (
                      <button
                        onClick={() => {
                          setCsvText('');
                          setParsedRows([]);
                          setHasParsed(false);
                        }}
                        className="text-[10px] text-stone-400 hover:text-stone-700"
                      >
                        Clear
                      </button>
                    )}
                  </label>
                  <textarea
                    rows={6}
                    value={csvText}
                    onChange={(e) => {
                      setCsvText(e.target.value);
                      parseCsvData(e.target.value);
                    }}
                    placeholder={`Elena Rostova, elena@school.edu, Visual Arts, Know Yourself\nMarcus Bell, marcus@school.edu, Mathematics, Pause & Regulate`}
                    className="w-full text-xs font-mono p-3 rounded-xl border border-stone-300 focus:border-[#4A6B53] focus:ring-1 focus:ring-[#4A6B53] resize-none outline-hidden"
                  />
                </div>
              </div>

              {/* Parsed Rows Verification Table */}
              {hasParsed && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Parsed Roster Preview ({parsedRows.length} total)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {selectedValidRows.length} Ready to Enroll
                      </span>
                    </div>

                    <span className="text-[11px] text-stone-500">
                      Edit details inline before enrolling
                    </span>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs max-h-64 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-600 sticky top-0 z-10">
                        <tr>
                          <th className="p-2.5 w-8">
                            <input
                              type="checkbox"
                              checked={
                                selectedValidRows.length > 0 &&
                                selectedValidRows.length ===
                                  parsedRows.filter((r) => r.status === 'valid').length
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setParsedRows((prev) =>
                                  prev.map((r) =>
                                    r.status === 'valid' ? { ...r, selected: checked } : r
                                  )
                                );
                              }}
                              className="rounded accent-[#1B3626]"
                            />
                          </th>
                          <th className="p-2.5">Educator Name</th>
                          <th className="p-2.5">Email Address</th>
                          <th className="p-2.5">Department</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5 w-10 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 bg-white">
                        {parsedRows.map((row) => {
                          const isValid = row.status === 'valid';

                          return (
                            <tr
                              key={row.id}
                              className={`transition-colors ${
                                !isValid ? 'bg-red-50/40' : 'hover:bg-stone-50'
                              }`}
                            >
                              <td className="p-2.5">
                                <input
                                  type="checkbox"
                                  disabled={!isValid}
                                  checked={row.selected}
                                  onChange={() => handleToggleSelectRow(row.id)}
                                  className="rounded accent-[#1B3626] disabled:opacity-30"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={row.name}
                                  onChange={(e) =>
                                    handleRowFieldChange(row.id, 'name', e.target.value)
                                  }
                                  className="w-full p-1 text-xs border border-transparent hover:border-stone-300 focus:border-[#4A6B53] rounded"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="email"
                                  value={row.email}
                                  onChange={(e) =>
                                    handleRowFieldChange(row.id, 'email', e.target.value)
                                  }
                                  className="w-full p-1 text-xs font-mono border border-transparent hover:border-stone-300 focus:border-[#4A6B53] rounded"
                                />
                              </td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  value={row.department}
                                  onChange={(e) =>
                                    handleRowFieldChange(row.id, 'department', e.target.value)
                                  }
                                  className="w-full p-1 text-xs border border-transparent hover:border-stone-300 focus:border-[#4A6B53] rounded"
                                />
                              </td>
                              <td className="p-2.5">
                                {isValid ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                    <Check className="w-3 h-3" />
                                    <span>Ready</span>
                                  </span>
                                ) : (
                                  <span
                                    title={row.errorMessage}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded"
                                  >
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{row.errorMessage || 'Invalid'}</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-center">
                                <button
                                  onClick={() => handleDeleteRow(row.id)}
                                  className="text-stone-400 hover:text-rose-600 p-1 rounded"
                                  title="Delete row"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Enrollment Policies & Toggles */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoActivate}
                        onChange={(e) => setAutoActivate(e.target.checked)}
                        className="mt-0.5 rounded accent-[#1B3626]"
                      />
                      <div>
                        <strong className="block font-semibold text-stone-900">
                          Immediately Open &amp; Activate Accounts
                        </strong>
                        <span className="text-[11px] text-stone-500 leading-tight block">
                          Bypasses the pending gate so teachers can log in with their email right away.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWelcomeEmail}
                        onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                        className="mt-0.5 rounded accent-[#1B3626]"
                      />
                      <div>
                        <strong className="block font-semibold text-stone-900">
                          Send Simulated Welcome Email &amp; Notice
                        </strong>
                        <span className="text-[11px] text-stone-500 leading-tight block">
                          Generates personalized onboarding messages with credentials in the notification hub.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {!isSuccess && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={selectedValidRows.length === 0}
              onClick={handleCommitEnrollment}
              className="px-5 py-2.5 rounded-xl bg-[#1B3626] hover:bg-[#284f38] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Enroll {selectedValidRows.length} Educators</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
