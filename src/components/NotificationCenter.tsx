import React, { useState } from 'react';
import {
  Bell,
  Mail,
  CheckCheck,
  Inbox,
  ExternalLink,
  MessageSquare,
  Send,
  Trash2,
  X,
  ChevronRight,
  Copy,
  Check,
  Clock,
  Sparkles,
  KeyRound,
  ShieldCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { AppNotification, SimulatedEmail } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNavigateTab?: (tab: string) => void;
  currentRole?: string;
  currentEmail?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onNavigateTab,
  currentRole,
  currentEmail,
}) => {
  const [filter, setFilter] = useState<'all' | 'emails' | 'feedback' | 'approvals'>('all');
  const [activeEmailPreview, setActiveEmailPreview] = useState<SimulatedEmail | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'emails') return !!n.simulatedEmail;
    if (filter === 'feedback') return n.type === 'dossier_feedback' || n.type === 'checkpoint_assigned';
    if (filter === 'approvals') return n.type === 'account_approved' || n.type === 'bulk_enrolled';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCopyLoginLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      {/* Slide-over panel */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1B3626] text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-bold text-stone-900">
                  Notification Hub
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                Approvals, welcome emails &amp; feedback loop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors text-xs flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2.5 border-b border-stone-200 bg-white flex items-center gap-1 text-xs overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
              filter === 'all'
                ? 'bg-[#1B3626] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('emails')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filter === 'emails'
                ? 'bg-[#1B3626] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Welcome Emails</span>
          </button>
          <button
            onClick={() => setFilter('feedback')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filter === 'feedback'
                ? 'bg-[#1B3626] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Dossier Feedback</span>
          </button>
          <button
            onClick={() => setFilter('approvals')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1 ${
              filter === 'approvals'
                ? 'bg-[#1B3626] text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>Approvals</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-stone-300 bg-white space-y-2 mt-4">
              <Inbox className="w-8 h-8 text-stone-400 mx-auto opacity-70" />
              <p className="text-xs font-semibold text-stone-700">No notifications in this category</p>
              <p className="text-[11px] text-stone-500">
                Approvals, simulated emails, and reviewer feedback will surface here.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isEmail = !!notif.simulatedEmail;
              const isFeedback = notif.type === 'dossier_feedback';
              const isApproval = notif.type === 'account_approved' || notif.type === 'bulk_enrolled';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) onMarkAsRead(notif.id);
                    if (notif.simulatedEmail) {
                      setActiveEmailPreview(notif.simulatedEmail);
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all text-left relative group cursor-pointer ${
                    !notif.read
                      ? 'bg-white border-[#4A6B53]/40 shadow-xs ring-1 ring-[#4A6B53]/15'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        isEmail
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : isFeedback
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isApproval
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isEmail ? (
                        <Mail className="w-4 h-4 text-amber-700" />
                      ) : isFeedback ? (
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                      ) : isApproval ? (
                        <KeyRound className="w-4 h-4 text-blue-700" />
                      ) : (
                        <Bell className="w-4 h-4 text-stone-600" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 leading-tight">
                          {notif.title}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      {/* Feedback Quote if any */}
                      {notif.feedbackQuote && (
                        <div className="mt-2 p-2 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 italic border-l-2 border-l-[#4A6B53]">
                          "{notif.feedbackQuote}"
                          {notif.feedbackAuthor && (
                            <span className="block mt-1 font-semibold text-stone-900 not-italic text-[10px]">
                              — {notif.feedbackAuthor}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100 text-[10px] text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{notif.timestamp}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          {notif.simulatedEmail && (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:underline">
                              <span>Read Email Preview</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}

                          {notif.actionTab && onNavigateTab && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!notif.read) onMarkAsRead(notif.id);
                                onClose();
                                onNavigateTab(notif.actionTab!);
                              }}
                              className="font-bold text-[#4A6B53] hover:underline flex items-center gap-1"
                            >
                              <span>{notif.actionLabel || 'View in Dossier'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-stone-200 bg-white flex items-center justify-between text-xs text-stone-500">
            <span>{notifications.length} total messages</span>
            <button
              onClick={onClearAll}
              className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-[11px]"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Simulated Welcome Email Modal */}
      {activeEmailPreview && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-stone-300 overflow-hidden text-stone-900 animate-in zoom-in-95 duration-150">
            {/* Email Client Header bar */}
            <div className="bg-[#252525] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono font-medium tracking-wide">
                  Simulated Notification Dispatch
                </span>
              </div>
              <button
                onClick={() => setActiveEmailPreview(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Metadata */}
            <div className="p-5 border-b border-stone-200 bg-[#FAF9F5] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Account Activation Notice (Simulated Email)
                </span>
                <span className="text-stone-500 text-[11px]">{activeEmailPreview.sentAt}</span>
              </div>

              <h4 className="font-editorial text-lg font-bold text-stone-900 pt-1">
                {activeEmailPreview.subject}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-stone-600 border-t border-stone-200/80">
                <div>
                  <strong className="text-stone-900">From:</strong> {activeEmailPreview.fromName} &lt;{activeEmailPreview.fromEmail}&gt;
                </div>
                <div>
                  <strong className="text-stone-900">To:</strong> {activeEmailPreview.toName} &lt;{activeEmailPreview.toEmail}&gt;
                </div>
                <div>
                  <strong className="text-stone-900">Campus:</strong> {activeEmailPreview.schoolName}
                </div>
                {activeEmailPreview.competencyFocus && (
                  <div>
                    <strong className="text-stone-900">EQ Focus:</strong> {activeEmailPreview.competencyFocus}
                  </div>
                )}
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-6 space-y-4 text-xs text-stone-800 leading-relaxed font-normal max-h-[50vh] overflow-y-auto">
              <p className="text-sm font-semibold text-stone-900">
                Dear {activeEmailPreview.toName},
              </p>

              <p>
                We are delighted to share that your educator account for the{' '}
                <strong className="text-stone-900 font-semibold">{activeEmailPreview.schoolName}</strong> CEQHS Living Journey has been reviewed and officially activated by campus leadership.
              </p>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Your Direct Access Credentials</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-500 block">Registered Email:</span>
                    <strong className="text-stone-900 font-mono">{activeEmailPreview.toEmail}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Initial Password:</span>
                    <strong className="text-stone-900 font-mono">
                      {activeEmailPreview.temporaryPassword || 'password'}
                    </strong>
                  </div>
                </div>
              </div>

              <p>
                {activeEmailPreview.bodyText}
              </p>

              <div className="p-3 bg-stone-100/80 rounded-xl text-stone-700 text-[11px] space-y-1">
                <span className="font-semibold text-stone-900 block">What to do next:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Log in from the main portal with your email.</li>
                  <li>Explore the 6 Emotionally Intelligent themes and your assigned competency focus.</li>
                  <li>Use the <em>+ Add to Your Journey</em> button to capture your first classroom pause or student moment.</li>
                </ul>
              </div>

              <div className="pt-2 text-stone-600 text-[11px]">
                Warm regards,
                <br />
                <strong className="text-stone-900">{activeEmailPreview.fromName}</strong>
                <br />
                School Coordinator · {activeEmailPreview.schoolName}
              </div>
            </div>

            {/* Email Actions Footer */}
            <div className="p-4 border-t border-stone-200 bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() =>
                  handleCopyLoginLink(activeEmailPreview.loginUrl || window.location.origin)
                }
                className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-white text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Educator Sign-In Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveEmailPreview(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
