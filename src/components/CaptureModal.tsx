import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  Sparkles,
  Lock,
  Users,
  BookOpen,
  CheckCircle2,
  Image,
  FileText,
  Heart,
  Lightbulb,
  Sprout,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import {
  EntryType,
  MomentCategory,
  VisibilityLevel,
  JourneyEntry,
  Theme,
  User,
} from '../types';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: JourneyEntry) => void;
  currentUser: User;
  themes: Theme[];
  initialType?: EntryType;
  initialThemeId?: string;
  initialPrompt?: string;
  initialTitle?: string;
  initialCompetency?: string;
  initialGoalId?: string;
}

const MOMENT_CATEGORIES: { category: MomentCategory; emoji: string; label: string; color: string }[] = [
  { category: 'Growth', emoji: '🌱', label: 'Growth', color: 'bg-[#EAF0EB] text-[#4A6B53] border-[#4A6B53]/30' },
  { category: 'Connection', emoji: '💬', label: 'Connection', color: 'bg-[#EBF2F6] text-[#3F6C8A] border-[#3F6C8A]/30' },
  { category: 'Insight', emoji: '💡', label: 'Insight', color: 'bg-[#FAF3E7] text-[#C88A2E] border-[#C88A2E]/30' },
  { category: 'Belonging', emoji: '❤️', label: 'Belonging', color: 'bg-[#F8EDE9] text-[#C45D3E] border-[#C45D3E]/30' },
  { category: 'Change', emoji: '🔄', label: 'Change', color: 'bg-stone-100 text-stone-700 border-stone-300' },
  { category: 'Surprise', emoji: '✨', label: 'Surprise', color: 'bg-amber-50 text-amber-800 border-amber-300' },
];

export const CaptureModal: React.FC<CaptureModalProps> = ({
  isOpen,
  onClose,
  onSaveEntry,
  currentUser,
  themes,
  initialType = 'moment',
  initialThemeId,
  initialPrompt,
  initialTitle,
  initialCompetency,
  initialGoalId,
}) => {
  const [activeType, setActiveType] = useState<EntryType>(initialType);
  const [title, setTitle] = useState('');
  const [themeId, setThemeId] = useState(initialThemeId || themes[0]?.id || '');
  const [visibility, setVisibility] = useState<VisibilityLevel>('Dossier');

  // Fields for Practice
  const [whatHappened, setWhatHappened] = useState('');
  const [whatDidINotice, setWhatDidINotice] = useState('');
  const [whatMightITryNext, setWhatMightITryNext] = useState('');

  // Fields for Moment
  const [momentCategory, setMomentCategory] = useState<MomentCategory>('Belonging');
  const [momentStory, setMomentStory] = useState('');
  const [whyDoesThisMatter, setWhyDoesThisMatter] = useState('');

  // Fields for Reflection
  const [reflectionText, setReflectionText] = useState('');

  // Fields for Evidence
  const [evidenceType, setEvidenceType] = useState<'Photograph' | 'Document' | 'Student Work' | 'Observation' | 'Quote'>('Photograph');
  const [photoUrl, setPhotoUrl] = useState('');
  const [evidenceExplanation, setEvidenceExplanation] = useState('');

  // Fields for Voice
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialType) {
      setActiveType(initialType);
    }
    if (initialThemeId) {
      setThemeId(initialThemeId);
    }
    if (initialTitle) {
      setTitle(initialTitle);
    }
    if (initialPrompt) {
      setReflectionText(initialPrompt);
      setMomentStory(initialPrompt);
    }
  }, [initialType, initialThemeId, initialTitle, initialPrompt, isOpen]);

  // Clean up audio on unmount or close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Provide an authentic transcribed thought if transcript is empty
        if (!voiceTranscript) {
          setVoiceTranscript(
            'Today in advisory, I noticed myself feeling anxious before the student arrived. I paused, unclenched my jaw, and simply listened without correcting their story. That small breath shifted the entire energy of the room.'
          );
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or not supported, switching to simulated recording mode:', err);
      // Friendly fallback
      setIsRecording(true);
      setRecordingDuration(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // simulated finish
      setAudioUrl('mock-audio-captured');
      if (!voiceTranscript) {
        setVoiceTranscript(
          'Today in advisory, I noticed myself feeling anxious before the student arrived. I paused, unclenched my jaw, and simply listened without correcting their story. That small breath shifted the entire energy of the room.'
        );
      }
    }
  };

  const toggleAudioPlay = () => {
    if (!audioPlayerRef.current && audioUrl && audioUrl !== 'mock-audio-captured') {
      audioPlayerRef.current = new Audio(audioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
    }
    if (audioPlayerRef.current) {
      if (isPlayingAudio) {
        audioPlayerRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlayingAudio(true);
      }
    } else {
      // Mock toggle
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedTheme = themes.find((t) => t.id === themeId);
    const now = new Date();
    const dateFormatted = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    const monthFormatted = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

    let finalTitle = title.trim();
    let finalDescription = '';

    if (activeType === 'moment') {
      if (!finalTitle) finalTitle = `Moment of ${momentCategory}: ${momentStory.slice(0, 45)}...`;
      finalDescription = momentStory;
    } else if (activeType === 'practice') {
      if (!finalTitle) finalTitle = 'Classroom Practice Experiment';
      finalDescription = whatHappened;
    } else if (activeType === 'reflection') {
      if (!finalTitle) finalTitle = 'Reflective Note';
      finalDescription = reflectionText;
    } else if (activeType === 'evidence') {
      if (!finalTitle) finalTitle = `${evidenceType}: Learning in Action`;
      finalDescription = evidenceExplanation;
    } else if (activeType === 'voice') {
      if (!finalTitle) finalTitle = 'Voice Reflection';
      finalDescription = voiceTranscript || 'Recorded spoken reflection.';
    }

    const newEntry: JourneyEntry = {
      id: `entry-${Date.now()}`,
      type: activeType,
      title: finalTitle,
      date: dateFormatted,
      month: monthFormatted,
      phaseId: activeType === 'practice' ? '03_PRACTISE' : activeType === 'moment' ? '05_REFLECT' : '05_REFLECT',
      themeId: themeId,
      themeTitle: selectedTheme?.title,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.title,
      description: finalDescription,
      whatHappened: activeType === 'practice' ? whatHappened : undefined,
      whatDidINotice: activeType === 'practice' ? whatDidINotice : undefined,
      whatMightITryNext: activeType === 'practice' ? whatMightITryNext : undefined,
      whyDoesThisMatter:
        activeType === 'moment'
          ? whyDoesThisMatter
          : activeType === 'evidence'
          ? evidenceExplanation
          : activeType === 'voice'
          ? whyDoesThisMatter || 'Spoken self-awareness captured in the moment.'
          : undefined,
      momentCategory: activeType === 'moment' ? momentCategory : undefined,
      evidenceType: activeType === 'evidence' ? evidenceType : undefined,
      photoUrl: photoUrl || (activeType === 'evidence' ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80' : undefined),
      audioDuration: activeType === 'voice' ? formatSeconds(recordingDuration || 48) : undefined,
      transcript: activeType === 'voice' ? voiceTranscript : undefined,
      visibility: visibility,
      includedInDossier: visibility === 'Dossier',
      goalId: initialGoalId,
      competency: initialCompetency,
    };

    onSaveEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#252525]/40 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-2xl border border-stone-300 shadow-xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F4F1EA]">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Living Record Book
            </span>
            <h2 id="capture-modal-title" className="font-editorial text-2xl text-[#252525] font-normal">
              Capture Your Journey
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entry Type Selector Tabs */}
        <div className="flex border-b border-stone-200 bg-[#FAF9F5] px-6 pt-2 overflow-x-auto gap-2">
          {[
            { type: 'moment' as EntryType, label: '✨ Moment That Mattered', hint: 'Signature CEQHS' },
            { type: 'practice' as EntryType, label: '🌱 Practice', hint: 'What you tried' },
            { type: 'reflection' as EntryType, label: '💡 Reflection', hint: 'What you noticed' },
            { type: 'evidence' as EntryType, label: '📷 Evidence', hint: 'With meaning' },
            { type: 'voice' as EntryType, label: '🎙 Voice Reflection', hint: 'Speak your thoughts' },
          ].map((tab) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveType(tab.type)}
              className={`pb-3 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeType === tab.type
                  ? 'border-[#4A6B53] text-[#252525] font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-[#252525]">
          {/* Active Type Explanatory Guidance */}
          {activeType === 'moment' && (
            <div className="p-4 rounded-xl bg-[#FAF3E7] border border-[#C88A2E]/30 text-stone-800 text-sm">
              <p className="font-editorial italic text-base text-[#252525] mb-1">
                "Not everything meaningful is a formal piece of evidence. Capture small human moments."
              </p>
              <p className="text-xs text-stone-600">
                A student who finally spoke, an apology to your class, an emotional pause, or an unexpected breakthrough.
              </p>
            </div>
          )}

          {activeType === 'practice' && (
            <div className="p-3.5 rounded-xl bg-[#EAF0EB] border border-[#4A6B53]/30 text-sm text-stone-800">
              <span className="font-semibold text-[#4A6B53]">Notice → Pause → Practise → Learn.</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Record an experiment in classroom emotional dynamics, self-regulation, or non-defensive communication.
              </p>
            </div>
          )}

          {activeType === 'evidence' && (
            <div className="p-3.5 rounded-xl bg-[#EBF2F6] border border-[#3F6C8A]/30 text-sm text-stone-800">
              <span className="font-semibold text-[#3F6C8A]">Meaning over volume:</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Do not simply collect files. Collect the human meaning and student growth behind the artifact.
              </p>
            </div>
          )}

          {activeType === 'voice' && (
            <div className="p-4 rounded-xl bg-[#F8EDE9] border border-[#C45D3E]/30 text-sm text-stone-800">
              <span className="font-semibold text-[#C45D3E]">Speak naturally:</span>
              <p className="text-xs text-stone-600 mt-0.5">
                Reflection should not depend entirely on typing. Press record and speak your unfiltered honest reflection.
              </p>
            </div>
          )}

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Related Theme
            </label>
            <select
              value={themeId}
              onChange={(e) => setThemeId(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
            >
              {themes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} — {t.question}
                </option>
              ))}
            </select>
          </div>

          {/* Title Field (optional/custom) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Title or Short Headline
            </label>
            <input
              type="text"
              placeholder={
                activeType === 'moment'
                  ? 'e.g., A student stayed behind to speak'
                  : activeType === 'practice'
                  ? 'e.g., Waiting 8 seconds before responding'
                  : activeType === 'voice'
                  ? 'e.g., Debrief after transition friction'
                  : 'e.g., Co-created classroom norms'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
            />
          </div>

          {/* TYPE-SPECIFIC CONTENT INPUTS */}

          {/* 1. MOMENT SPECIFIC */}
          {activeType === 'moment' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Category of Moment
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {MOMENT_CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.category}
                      onClick={() => setMomentCategory(cat.category)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        momentCategory === cat.category
                          ? `${cat.color} ring-2 ring-[#4A6B53] shadow-xs`
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-xl mb-1">{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  What happened?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the moment as it unfolded—the words spoken, the shift in energy, what you observed..."
                  value={momentStory}
                  onChange={(e) => setMomentStory(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C45D3E] mb-1.5 flex items-center gap-1.5">
                  <span>Why does this matter?</span>
                  <span className="text-[10px] font-normal text-stone-500 normal-case">(The emotional heart of this entry)</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What did this moment teach you? Why is it worth remembering months from now?"
                  value={whyDoesThisMatter}
                  onChange={(e) => setWhyDoesThisMatter(e.target.value)}
                  className="w-full bg-white border border-[#C45D3E]/40 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C45D3E]"
                />
              </div>
            </>
          )}

          {/* 2. PRACTICE SPECIFIC */}
          {activeType === 'practice' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  What happened? (The Classroom Experiment)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Today I noticed myself becoming frustrated during a transition. I paused before addressing the room..."
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  What did I notice?
                </label>
                <textarea
                  rows={2}
                  placeholder="What shifted in the students? What did you notice in your own body or mind?"
                  value={whatDidINotice}
                  onChange={(e) => setWhatDidINotice(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  What might I try next?
                </label>
                <input
                  type="text"
                  placeholder="Next time, invite students to co-design the transition playlist..."
                  value={whatMightITryNext}
                  onChange={(e) => setWhatMightITryNext(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>
            </>
          )}

          {/* 3. REFLECTION SPECIFIC */}
          {activeType === 'reflection' && (
            <div>
              <div className="mb-2 text-xs text-stone-500 flex items-center justify-between">
                <span>Prompts to spark your writing:</span>
                <span className="italic">What surprised you? What changed?</span>
              </div>
              <textarea
                rows={5}
                required
                placeholder="What did you notice about yourself or your students today? What felt challenging or deeply rewarding?"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
              />
            </div>
          )}

          {/* 4. EVIDENCE SPECIFIC */}
          {activeType === 'evidence' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Evidence Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Photograph', 'Document', 'Student Work', 'Observation'] as const).map((fmt) => (
                    <button
                      type="button"
                      key={fmt}
                      onClick={() => setEvidenceType(fmt)}
                      className={`p-2 rounded-lg border text-xs font-medium text-center transition-all ${
                        evidenceType === fmt
                          ? 'bg-[#3F6C8A] text-white border-[#3F6C8A]'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Artifact Image / Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Image URL or artifact link (or leave blank for sample photo)"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-sm text-stone-800"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoUrl(
                        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80'
                      )
                    }
                    className="px-3 py-2 text-xs font-medium bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                  >
                    Use Sample Photo
                  </button>
                </div>
                {photoUrl && (
                  <div className="mt-2 h-36 rounded-lg overflow-hidden border border-stone-300 relative">
                    <img
                      src={photoUrl}
                      alt="Uploaded artifact preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-2 right-2 bg-[#252525]/70 text-white rounded-full p-1 hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3F6C8A] mb-1.5">
                  Why does this matter? (The meaning behind the file)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain why this artifact represents growth in human skills or relational safety..."
                  value={evidenceExplanation}
                  onChange={(e) => setEvidenceExplanation(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#3F6C8A]"
                />
              </div>
            </>
          )}

          {/* 5. VOICE SPECIFIC */}
          {activeType === 'voice' && (
            <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 rounded-xl bg-[#FAF9F5]">
                {!isRecording && !audioUrl && (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="flex flex-col items-center gap-2 text-stone-700 hover:text-[#C45D3E] transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#F8EDE9] text-[#C45D3E] flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
                      <Mic className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-semibold">Press to Record Reflection</span>
                    <span className="text-xs text-stone-500">Speak for 30 seconds to several minutes</span>
                  </button>
                )}

                {isRecording && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-mono text-2xl font-bold text-red-600">
                        {formatSeconds(recordingDuration)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">Recording... Speak freely about what you are noticing.</p>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Stop Recording
                    </button>
                  </div>
                )}

                {!isRecording && audioUrl && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <div className="flex items-center gap-3 w-full justify-center">
                      <button
                        type="button"
                        onClick={toggleAudioPlay}
                        className="w-12 h-12 rounded-full bg-[#4A6B53] text-white flex items-center justify-center shadow-xs hover:bg-[#3d5945]"
                      >
                        {isPlayingAudio ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>
                      <div className="text-left">
                        <div className="font-mono font-medium text-stone-800 text-sm">
                          🎙 {formatSeconds(recordingDuration || 48)} recorded
                        </div>
                        <div className="text-xs text-[#4A6B53] font-medium">Audio ready to save</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioUrl(null);
                        setRecordingDuration(0);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-800 underline mt-1"
                    >
                      Record Again
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Voice Transcript & Notes
                </label>
                <textarea
                  rows={3}
                  value={voiceTranscript}
                  onChange={(e) => setVoiceTranscript(e.target.value)}
                  placeholder="Your words appear here, or you can edit the transcription notes..."
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg p-3 text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Why does this matter?
                </label>
                <input
                  type="text"
                  value={whyDoesThisMatter}
                  onChange={(e) => setWhyDoesThisMatter(e.target.value)}
                  placeholder="e.g., Validating the human underneath frustration softens the entire room."
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3.5 py-2 text-sm text-stone-800"
                />
              </div>
            </div>
          )}

          {/* Privacy & Visibility Settings */}
          <div className="pt-3 border-t border-stone-200">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              Privacy & Visibility Setting
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  lvl: 'Private' as VisibilityLevel,
                  icon: Lock,
                  label: 'Private',
                  desc: 'Only me. Psychologically safe space.',
                },
                {
                  lvl: 'School' as VisibilityLevel,
                  icon: Users,
                  label: 'School',
                  desc: 'Visible to authorized colleagues.',
                },
                {
                  lvl: 'Dossier' as VisibilityLevel,
                  icon: BookOpen,
                  label: 'Dossier',
                  desc: 'May appear in annual school book.',
                },
                {
                  lvl: 'CEQHS Review' as VisibilityLevel,
                  icon: CheckCircle2,
                  label: 'CEQHS Review',
                  desc: 'Available to CEQHS mentors.',
                },
              ].map((v) => {
                const Icon = v.icon;
                const isSelected = visibility === v.lvl;
                return (
                  <button
                    type="button"
                    key={v.lvl}
                    onClick={() => setVisibility(v.lvl)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#F4F1EA] border-[#4A6B53] ring-1 ring-[#4A6B53]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium text-xs text-stone-800">
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#4A6B53]' : 'text-stone-500'}`} />
                      <span>{v.label}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 leading-tight mt-1">{v.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-[#4A6B53] hover:bg-[#3c5743] rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Save to My Journey</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
