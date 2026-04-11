import { useState, useRef, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  isStreaming?: boolean;
}
interface AttachedFile { name: string; type: string; size: number; content: string }

const CHATBOT_URL      = 'http://localhost:3000';
const VAPI_PUBLIC_KEY  = '7e47046c-0277-493e-bdb2-246f9203fbbf';
const VAPI_ASSISTANT_ID = '92afbe2a-2a68-4540-902a-47955e298229';

const QUICK_PROMPTS = [
  { label: '📋 Key GAPC V4.0 Criteria', prompt: 'What are the key criteria in NBA GAPC V4.0?' },
  { label: '📝 SAR Criterion 1 Guide',  prompt: 'How should I prepare the SAR for Criterion 1?' },
  { label: '📊 Scoring Methodology',    prompt: 'What is the scoring methodology for NBA accreditation?' },
  { label: '📁 Required Documents',     prompt: 'What documents are needed for NBA accreditation?' },
];

function md(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`(.+?)`/g,'<code style="background:rgba(99,102,241,0.12);color:#4F46E5;padding:1px 5px;border-radius:4px;font-size:11px;">$1</code>')
    .replace(/^### (.+)$/gm,'<div style="font-weight:700;font-size:13px;margin:10px 0 4px;color:#4F46E5;">$1</div>')
    .replace(/^## (.+)$/gm,'<div style="font-weight:700;font-size:14px;margin:12px 0 4px;color:#4338CA;">$1</div>')
    .replace(/^# (.+)$/gm,'<div style="font-weight:800;font-size:15px;margin:12px 0 6px;color:#312E81;">$1</div>')
    .replace(/^- (.+)$/gm,'<div style="display:flex;gap:6px;margin:2px 0;"><span style="color:#6366F1;flex-shrink:0;">•</span><span>$1</span></div>')
    .replace(/\n\n/g,'<br/><br/>').replace(/\n/g,'<br/>');
}

function fmtSize(b: number) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}

// ── Gemini-style Wake Popup — stays open, has voice + "Open Chat" ──
function WakePopup({
  onOpenChat,
  onClose,
  onVoiceQuery,
}: {
  onOpenChat: () => void;
  onClose: () => void;
  onVoiceQuery: (q: string) => void;
}) {
  const [phase, setPhase]       = useState<'in' | 'listening' | 'speaking'>('in');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply]       = useState('');
  const recRef = useRef<any>(null);

  // Start listening after card appears
  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('listening');
      startListening();
    }, 600);
    return () => clearTimeout(t);
  }, []);

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    recRef.current = rec;

    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          setTranscript(t);
          setPhase('speaking');
          handleVoiceInput(t);
        } else {
          interim = t;
          setTranscript(interim);
        }
      }
    };
    rec.onerror = () => setPhase('listening');
    rec.onend   = () => {};
    try { rec.start(); } catch {}
  }

  async function handleVoiceInput(text: string) {
    const lower = text.toLowerCase();
    // If user wants chat, open it
    if (lower.includes('open chat') || lower.includes('show chat') || lower.includes('chat mode')) {
      setReply('Opening chat for you!');
      setTimeout(onOpenChat, 800);
      return;
    }
    // Otherwise answer via AI
    setReply('Let me check that for you…');
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: [] }),
      });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let full = '', buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try { const d = JSON.parse(line.slice(6)); if (d.text) { full += d.text; setReply(full); } } catch {}
        }
      }
      // Speak the reply
      if ('speechSynthesis' in window && full) {
        const utt = new SpeechSynthesisUtterance(full.replace(/<[^>]+>/g, '').slice(0, 300));
        utt.rate = 1.05; utt.pitch = 1;
        window.speechSynthesis.speak(utt);
      }
      // Offer to continue in chat
      onVoiceQuery(text);
    } catch {
      setReply('I\'m ready to help! Say your question or click "Open Chat" for full access.');
    }
  }

  const bars = [12, 20, 28, 18, 24, 16, 22];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:99999, pointerEvents:'none' }}>
      {/* Bottom shimmer bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0, height:4,
        background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#f59e0b,#10b981,#3b82f6,#6366f1)',
        backgroundSize:'300% 100%',
        animation:'geminiBarSlide 1.5s linear infinite',
        boxShadow:'0 -3px 20px rgba(99,102,241,0.5)',
      }} />

      {/* Glow bloom */}
      <div style={{
        position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:500, height:160,
        background:'radial-gradient(ellipse at bottom,rgba(99,102,241,0.2) 0%,transparent 70%)',
        pointerEvents:'none',
      }} />

      {/* Main popup card */}
      <div style={{
        position:'absolute', bottom:24, left:'50%',
        transform:'translateX(-50%)',
        width:360, borderRadius:24, overflow:'hidden',
        background:'rgba(255,255,255,0.97)',
        backdropFilter:'blur(24px)',
        boxShadow:'0 8px 48px rgba(99,102,241,0.22),0 2px 16px rgba(0,0,0,0.1)',
        border:'1px solid rgba(99,102,241,0.18)',
        animation:'geminiCardIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents:'auto',
      }}>
        {/* Rainbow top border */}
        <div style={{
          height:3,
          background:'linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899,#f59e0b,#10b981,#3b82f6)',
          backgroundSize:'200% 100%',
          animation:'geminiBarSlide 2s linear infinite',
        }} />

        <div style={{ padding:'16px 20px 20px', display:'flex', flexDirection:'column', gap:14 }}>
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:52, height:52, borderRadius:16, flexShrink:0,
              background:'linear-gradient(135deg,#4F46E5,#7C3AED)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 4px 16px rgba(79,70,229,0.4)',
              animation:'geminiRobotBob 2s ease-in-out infinite',
            }}>
              <img src="/chatbot-icon.png" alt="AccreditIQ"
                style={{ width:42, height:42, borderRadius:12, objectFit:'cover' }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#1e1b4b' }}>
                {phase === 'in' ? 'Yes Sir! 👋' : phase === 'listening' ? 'Listening…' : 'AccreditIQ'}
              </div>
              <div style={{ fontSize:11, color:'#6366f1', fontWeight:600, marginTop:2 }}>
                {phase === 'in' ? 'How can I help you?' : phase === 'listening' ? 'Speak your question' : 'Responding…'}
              </div>
            </div>
            {/* Voice waveform bars */}
            <div style={{ display:'flex', alignItems:'center', gap:3 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  width:3, borderRadius:2,
                  background: phase === 'listening'
                    ? 'linear-gradient(to top,#6366f1,#8b5cf6)'
                    : phase === 'speaking'
                    ? 'linear-gradient(to top,#10b981,#34d399)'
                    : 'rgba(99,102,241,0.3)',
                  height: phase === 'in' ? 6 : h,
                  animation: phase !== 'in' ? `geminiWave${i % 4} ${0.6 + i * 0.08}s ease-in-out ${i * 0.06}s infinite alternate` : 'none',
                  transition:'height 0.3s ease',
                }} />
              ))}
            </div>
            {/* Close */}
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:4, display:'flex' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Transcript / reply area */}
          <div style={{
            minHeight:52, padding:'10px 14px', borderRadius:14,
            background:'linear-gradient(135deg,#FAFAE8,#F5F2E8)',
            border:'1px solid rgba(99,102,241,0.12)',
            fontSize:12, color:'#374151', lineHeight:1.6,
          }}>
            {transcript && phase !== 'in' && (
              <div style={{ color:'#6366f1', fontWeight:600, marginBottom:4, fontSize:11 }}>
                You: {transcript}
              </div>
            )}
            {reply
              ? <div dangerouslySetInnerHTML={{ __html: reply.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>') }} />
              : <div style={{ color:'#9CA3AF' }}>
                  {phase === 'in' ? 'How can I help you with NBA accreditation today?' : phase === 'listening' ? '🎤 Listening for your question…' : ''}
                </div>
            }
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => { setTranscript(''); setReply(''); setPhase('listening'); startListening(); }}
              style={{ flex:1, padding:'9px 0', borderRadius:12, border:'1.5px solid rgba(99,102,241,0.3)', background:'rgba(99,102,241,0.06)', color:'#4F46E5', fontSize:12, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22" strokeWidth={2.5}/>
              </svg>
              Ask Again
            </button>
            <button onClick={onOpenChat}
              style={{ flex:1, padding:'9px 0', borderRadius:12, border:'none', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', color:'white', fontSize:12, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function AIChatBot() {
  const [open, setOpen]             = useState(false);
  const [popupOpen, setPopupOpen]   = useState(false); // Gemini-style popup
  const [messages, setMessages]     = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('accreditiq_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput]           = useState('');
  const [streaming, setStreaming]   = useState(false);
  const [attached, setAttached]     = useState<AttachedFile[]>([]);
  const [uploading, setUploading]   = useState(false);
  const [vapiReady, setVapiReady]   = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [wakeActive, setWakeActive] = useState(false);
  const [wakeListening, setWakeListening] = useState(false);
  const [fabPulsing, setFabPulsing] = useState(false);

  const bottomRef      = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const fileRef        = useRef<HTMLInputElement>(null);
  const vapiRef        = useRef<any>(null);
  const historyRef     = useRef<{role:string;content:string}[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { 
    if (messages.length > 0) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); 
  }, [messages]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 150); }, [open]);

  // ── Vapi init ─────────────────────────────────────────────
  useEffect(() => {
    try {
      const v = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = v;
      v.on('call-start', () => setCallActive(true));
      v.on('call-end',   () => setCallActive(false));
      v.on('error',      (e: any) => { console.error('Vapi err:', e); setCallActive(false); });
      setVapiReady(true);
    } catch (err) {
      console.error('Vapi init failed:', err);
    }
  }, []);

  // ── Wake word — robust always-on listener ────────────────
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('AccreditIQ: Web Speech API not supported in this browser.');
      return;
    }

    let active = true;
    let rec: any = null;
    let restartTimer: ReturnType<typeof setTimeout> | null = null;
    let triggered = false; // debounce — prevent double-fire

    function createAndStart() {
      if (!active) return;
      try {
        rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.maxAlternatives = 3;

        rec.onstart = () => {
          setWakeListening(true);
          triggered = false;
        };

        rec.onresult = (e: any) => {
          if (triggered) return;
          if (popupOpen) return; // popup has its own listener
          for (let i = e.resultIndex; i < e.results.length; i++) {
            // Check all alternatives for better accuracy
            for (let j = 0; j < e.results[i].length; j++) {
              const t = e.results[i][j].transcript.toLowerCase().trim();
              if (
                t.includes('hey accreditiq') ||
                t.includes('hey accredit iq') ||
                t.includes('hey accredit') ||
                t.includes('accreditiq') ||
                t.includes('accredit iq') ||
                t.includes('hey credit iq')
              ) {
                triggered = true;
                triggerWake();
                // Restart after wake sequence completes
                setTimeout(() => { triggered = false; }, 5000);
                return;
              }
            }
          }
        };

        rec.onerror = (e: any) => {
          // 'no-speech' and 'aborted' are normal — just restart
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setWakeListening(false);
            active = false; // mic permission denied — stop trying
            return;
          }
          // For all other errors, restart after short delay
          if (active) {
            restartTimer = setTimeout(createAndStart, 1000);
          }
        };

        rec.onend = () => {
          setWakeListening(false);
          // Auto-restart to keep listening continuously
          if (active) {
            restartTimer = setTimeout(createAndStart, 300);
          }
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        // Retry after delay
        if (active) restartTimer = setTimeout(createAndStart, 2000);
      }
    }

    // Request mic permission first, then start
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => { if (active) createAndStart(); })
      .catch(() => {
        // Permission denied or not available — try anyway (some browsers allow without explicit request)
        if (active) createAndStart();
      });

    return () => {
      active = false;
      if (restartTimer) clearTimeout(restartTimer);
      try { rec?.stop(); } catch {}
      setWakeListening(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Wake trigger (voice OR manual click) ─────────────────
  const triggerWake = useCallback(() => {
    if (popupOpen) return;
    setPopupOpen(true);
  }, [popupOpen]);

  // ── File upload ───────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      files.forEach(f => form.append('files', f));
      const res  = await fetch(`${CHATBOT_URL}/api/upload`, { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) setAttached(p => [...p, ...data.files]);
    } catch {
      for (const f of files) {
        if (f.size < 50_000_000) {
          const text = await f.text().catch(() => '');
          setAttached(p => [...p, { name: f.name, type: f.type, size: f.size, content: text.slice(0, 50000) }]);
        }
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, []);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text && !attached.length) return;
    if (streaming) return;

    setMessages(p => [...p, { role: 'user', content: attached.length ? `${attached.map(f=>`📎 ${f.name}`).join('\n')}\n\n${text}` : text }]);
    historyRef.current.push({ role: 'user', content: text || 'Analyze uploaded files.' });
    setInput('');
    setAttached([]);
    setStreaming(true);
    setMessages(p => [...p, { role: 'assistant', content: '', isStreaming: true }]);

    try {
      const res = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text || 'Analyze uploaded files.', history: historyRef.current.slice(-10), fileContents: attached }),
      });
      if (!res.ok) throw new Error('Server error');
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let full = '', buf = '', sources: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const d = JSON.parse(line.slice(6));
            if (d.text) { full += d.text; setMessages(p => p.map((m,i) => i===p.length-1 ? {...m,content:full,isStreaming:true} : m)); }
            else if (d.sources) sources = d.sources;
          } catch {}
        }
      }
      historyRef.current.push({ role: 'assistant', content: full });
      setMessages(p => {
        const updated = p.map((m,i) => i===p.length-1 ? {...m,content:full,isStreaming:false,sources} : m);
        try { localStorage.setItem('accreditiq_chat_history', JSON.stringify(updated.slice(-50))); } catch {}
        return updated;
      });
    } catch {
      const fallback = `**AccreditIQ AI** is ready — but the backend server isn't running.\n\nTo enable full AI:\n1. Run \`node server.js\` in the chatbot folder\n2. Ensure \`.env\` has your Mistral API key\n\nI can still answer general NBA accreditation questions from built-in knowledge.`;
      setMessages(p => p.map((m,i) => i===p.length-1 ? {...m,content:fallback,isStreaming:false} : m));
    } finally {
      setStreaming(false);
    }
  }, [input, attached, streaming]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleVapi = async () => {
    if (!vapiRef.current) return;
    if (callActive) { vapiRef.current.stop(); }
    else { try { await vapiRef.current.start(VAPI_ASSISTANT_ID); } catch {} }
  };

  return (
    <>
      {/* ── Gemini-style popup (voice assistant mode) ── */}
      {popupOpen && (
        <WakePopup
          onOpenChat={() => {
            setPopupOpen(false);
            setOpen(true);
            setMessages(p => p.length > 0 ? p : [{
              role: 'assistant' as const,
              content: 'Yes Sir! 👋 How can I help you?\n\nI am **AccreditIQ** — your expert NBA GAPC V4.0 AI assistant. Ready to help with SAR preparation, criteria guidance, and accreditation queries.',
            }]);
          }}
          onClose={() => setPopupOpen(false)}
          onVoiceQuery={(q) => {
            // Pre-fill the chat with the voice query so user can continue there
            setMessages(p => [...p, { role: 'user', content: q }]);
          }}
        />
      )}

      {/* ── Chat panel ── */}
      <div className="fixed z-50" style={{ bottom: 88, right: 24, pointerEvents: open ? 'auto' : 'none', opacity: open ? 1 : 0, transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)', transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="chat-lightning-wrap" style={{ width: 380, height: 560, position: 'relative', borderRadius: 20 }}>
          <span className="lightning-border" />
          <div style={{ display:'flex', flexDirection:'column', height:'100%', borderRadius: 20, overflow:'hidden', background:'linear-gradient(160deg,#FAFAE8 0%,#F5F2E8 50%,#FAFAE8 100%)', border:'1.5px solid rgba(180,170,130,0.3)', boxShadow:'0 20px 60px rgba(0,0,0,0.12),0 4px 20px rgba(0,0,0,0.08)' }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'linear-gradient(135deg,#4F46E5,#7C3AED)', borderBottom:'1px solid rgba(255,255,255,0.15)', flexShrink:0 }}>
              <img src="/chatbot-icon.png" alt="AI" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.3)', flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>AccreditIQ AI Assistant</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#6EE7B7', display:'inline-block', animation:'pulse 2s infinite' }} />
                  NBA GAPC V4.0 · Mistral AI
                  {wakeListening && <span style={{ opacity:0.6, fontSize:9 }}>· 🎤</span>}
                </div>
              </div>
              {/* Voice button in header */}
              <button onClick={handleVapi} disabled={!vapiReady} title="Live Voice Audit"
                style={{ width:28, height:28, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.3)', background: callActive ? 'rgba(239,68,68,0.85)' : 'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', cursor: vapiReady ? 'pointer' : 'not-allowed', flexShrink:0, transition:'all 0.2s', animation: callActive ? 'vapiPulseActive 2s infinite' : 'none' }}>
                {callActive
                  ? <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" strokeWidth={2.5}/></svg>
                  : <svg width="12" height="12" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22" strokeWidth={2.5}/></svg>
                }
              </button>
              <button onClick={() => { setMessages([]); historyRef.current = []; try { localStorage.removeItem('accreditiq_chat_history'); } catch {} }} style={{ fontSize:10, color:'rgba(255,255,255,0.6)', background:'none', border:'none', cursor:'pointer' }}>Clear</button>
              <button onClick={() => setOpen(false)} style={{ color:'rgba(255,255,255,0.6)', background:'none', border:'none', cursor:'pointer', display:'flex' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:12, scrollbarWidth:'thin', scrollbarColor:'rgba(99,102,241,0.2) transparent' }}>
              {messages.length === 0 && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:16, padding:'0 8px' }}>
                  <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#4F46E5,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(79,70,229,0.4)' }}>
                    <img src="/chatbot-icon.png" alt="AI" style={{ width:44, height:44, borderRadius:12, objectFit:'cover' }} />
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#312E81', margin:'0 0 4px' }}>Welcome to AccreditIQ</p>
                    <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.5, margin:0 }}>Ask anything about NBA SAR, GAPC V4.0, or upload documents for analysis.</p>
                    <p style={{ fontSize:10, color:'#9CA3AF', marginTop:6 }}>💡 Say <strong>"Hey AccreditIQ"</strong> to activate me</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, width:'100%' }}>
                    {QUICK_PROMPTS.map(q => (
                      <button key={q.label} onClick={() => { setInput(q.prompt); setTimeout(() => inputRef.current?.focus(), 50); }}
                        style={{ fontSize:10, textAlign:'left', padding:'8px 10px', borderRadius:12, background:'white', border:'1px solid rgba(99,102,241,0.2)', color:'#4F46E5', cursor:'pointer', boxShadow:'0 1px 4px rgba(99,102,241,0.08)', transition:'all 0.15s' }}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display:'flex', gap:8, flexDirection: msg.role==='user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:2, background: msg.role==='user' ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'linear-gradient(135deg,#E0E7FF,#EDE9FE)', color: msg.role==='user' ? '#fff' : '#4F46E5', boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>
                    {msg.role==='user' ? 'Y' : '✦'}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, maxWidth:'85%' }}>
                    <div style={{ fontSize:12, lineHeight:1.6, padding:'8px 12px', borderRadius:16, background: msg.role==='user' ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'white', border: msg.role==='user' ? 'none' : '1px solid rgba(99,102,241,0.15)', color: msg.role==='user' ? '#fff' : '#1F2937', boxShadow: msg.role==='user' ? '0 4px 12px rgba(79,70,229,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}>
                      {msg.isStreaming && !msg.content
                        ? <span style={{ display:'flex', gap:4, alignItems:'center' }}>
                            {[0,150,300].map(d => <span key={d} style={{ width:6, height:6, borderRadius:'50%', background:'#818cf8', animation:`bounce 1s ${d}ms infinite` }} />)}
                          </span>
                        : <div dangerouslySetInnerHTML={{ __html: md(msg.content) }} />
                      }
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4, padding:'0 4px' }}>
                        {[...new Set(msg.sources)].map(s => (
                          <span key={s} style={{ fontSize:9, padding:'2px 6px', borderRadius:20, background:'#EDE9FE', color:'#6D28D9', border:'1px solid #DDD6FE' }}>
                            📄 {s.replace('.md','').replace('.pdf','')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Attached files */}
            {attached.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, padding:'8px 12px', borderTop:'1px solid rgba(99,102,241,0.12)', background:'rgba(238,242,255,0.6)', flexShrink:0 }}>
                {attached.map((f,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'3px 8px', borderRadius:8, fontSize:10, background:'white', border:'1px solid rgba(99,102,241,0.25)', color:'#4F46E5' }}>
                    <span>📎</span>
                    <span style={{ maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
                    <span style={{ color:'#9CA3AF' }}>{fmtSize(f.size)}</span>
                    <button onClick={() => setAttached(p => p.filter((_,j) => j!==i))} style={{ color:'#9CA3AF', background:'none', border:'none', cursor:'pointer', fontSize:11 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'8px 12px 12px', borderTop:'1px solid rgba(99,102,241,0.12)', background:'rgba(238,242,255,0.4)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'flex-end', gap:8, borderRadius:20, padding:'8px 12px', background:'white', border:'1.5px solid rgba(99,102,241,0.25)', boxShadow:'0 2px 8px rgba(99,102,241,0.08)' }}>
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ color: uploading ? '#C4B5FD' : '#6366F1', background:'none', border:'none', cursor:'pointer', flexShrink:0, marginBottom:2 }}>
                  {uploading
                    ? <span style={{ width:16, height:16, border:'2px solid #818cf8', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' }} />
                    : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                  }
                </button>
                <input ref={fileRef} type="file" multiple accept=".txt,.csv,.md,.json,.pdf,.docx,.xlsx" hidden onChange={handleFileChange} />
                <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
                  placeholder="Ask about NBA accreditation…" rows={1}
                  style={{ flex:1, background:'transparent', border:'none', outline:'none', resize:'none', fontSize:12, color:'#1F2937', maxHeight:80, lineHeight:1.5 }} />
                <button onClick={sendMessage} disabled={streaming || (!input.trim() && !attached.length)}
                  style={{ width:28, height:28, borderRadius:'50%', border:'none', cursor: (streaming || (!input.trim() && !attached.length)) ? 'not-allowed' : 'pointer', background: (streaming || (!input.trim() && !attached.length)) ? '#E0E7FF' : 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: (streaming || (!input.trim() && !attached.length)) ? '#A5B4FC' : 'white', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:2, boxShadow: (streaming || (!input.trim() && !attached.length)) ? 'none' : '0 2px 8px rgba(79,70,229,0.4)', transition:'all 0.2s' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </button>
              </div>
              <p style={{ fontSize:9, textAlign:'center', marginTop:6, color:'#9CA3AF' }}>PDF · DOCX · XLSX · Powered by Mistral AI + Supabase RAG</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Robot FAB ── */}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:50, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10 }}>

        {/* Wake hint pill */}
        {!open && !popupOpen && (
          <div style={{
            fontSize:11, padding:'6px 12px', borderRadius:20,
            background: wakeListening
              ? 'linear-gradient(135deg,#4F46E5,#7C3AED)'
              : 'rgba(55,65,81,0.9)',
            color:'#fff', whiteSpace:'nowrap',
            boxShadow: wakeListening
              ? '0 4px 16px rgba(79,70,229,0.5)'
              : '0 2px 8px rgba(0,0,0,0.3)',
            display:'flex', alignItems:'center', gap:6,
            fontWeight:600,
          }}>
            {wakeListening
              ? <><span style={{ width:7, height:7, borderRadius:'50%', background:'#6EE7B7', display:'inline-block', animation:'pulse 1s infinite', flexShrink:0 }} /> Say "Hey AccreditIQ"</>
              : <>🎤 Click to activate</>
            }
          </div>
        )}

        {/* Split FABs */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Text Chat Button */}
          <button
            onClick={() => {
              if (open) { setOpen(false); return; }
              setPopupOpen(false);
              setOpen(true);
            }}
            aria-label="Text Chat"
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: 'linear-gradient(145deg, #10B981 0%, #059669 100%)',
              border: '2px solid rgba(255,255,255,0.9)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16,185,129,0.4)', color: 'white'
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </button>

          {/* Voice Assistant Button */}
          <button
            onClick={() => {
              if (popupOpen) { setPopupOpen(false); return; }
              setOpen(false);
              triggerWake();
            }}
            aria-label="AccreditIQ AI Voice"
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #4F46E5 0%, #7C3AED 50%, #6366F1 100%)',
            border: '3px solid rgba(255,255,255,0.9)',
            cursor: 'pointer',
            padding: 4,
            position: 'relative',
            outline: 'none',
            boxShadow: wakeListening
              ? '0 0 0 4px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.7), 0 8px 32px rgba(79,70,229,0.5)'
              : '0 0 0 3px rgba(99,102,241,0.35), 0 8px 28px rgba(79,70,229,0.45)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Inner image container */}
          <div style={{
            width:'100%', height:'100%', borderRadius:'50%',
            overflow:'hidden',
            background:'linear-gradient(145deg,#6366F1,#4F46E5)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <img src="/chatbot-icon.png" alt="AccreditIQ"
              style={{ width:'90%', height:'90%', objectFit:'cover', borderRadius:'50%', display:'block' }} />
          </div>



          {/* Active/open indicator */}
          {(open || popupOpen) && (
            <span style={{
              position:'absolute', top:0, right:0,
              width:14, height:14, borderRadius:'50%',
              background:'#34D399', border:'2.5px solid white',
              boxShadow:'0 0 10px rgba(52,211,153,0.8)',
            }} />
          )}


        </button>
        </div>
      </div>
    </>
  );
}

// ── Global styles ─────────────────────────────────────────────
const STYLES = `
  @keyframes robotIdlePulse {
    0%,100% { box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 8px 28px rgba(79,70,229,0.45); }
    50%      { box-shadow: 0 0 0 5px rgba(99,102,241,0.5),  0 8px 36px rgba(79,70,229,0.65); }
  }
  @keyframes fabGlow {
    0%,100% { box-shadow: 0 0 0 3px rgba(99,102,241,0.35), 0 0 20px rgba(99,102,241,0.4), 0 8px 28px rgba(79,70,229,0.45); }
    50%      { box-shadow: 0 0 0 5px rgba(99,102,241,0.55), 0 0 32px rgba(99,102,241,0.65), 0 8px 36px rgba(79,70,229,0.6); }
  }
  @keyframes fabRingPulse {
    0%   { transform: scale(1);   opacity: 0.8; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  @keyframes listeningPing {
    0%   { transform: scale(1);   opacity: 1; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  /* ── Gemini-style wake animations ── */
  @keyframes geminiBar {
    0%   { background-position: 200% 0; opacity: 0; transform: scaleX(0); }
    10%  { opacity: 1; transform: scaleX(1); }
    80%  { opacity: 1; background-position: -200% 0; }
    100% { opacity: 0; }
  }
  @keyframes geminiBarSlide {
    0%   { background-position: 0% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes geminiBloom {
    0%   { opacity: 0; transform: translateX(-50%) scaleY(0); }
    30%  { opacity: 1; transform: translateX(-50%) scaleY(1); }
    100% { opacity: 0; transform: translateX(-50%) scaleY(1); }
  }
  @keyframes geminiCardIn {
    from { opacity: 0; transform: translateX(-50%) translateY(40px) scale(0.95); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
  }
  @keyframes geminiCardOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
    to   { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
  }
  @keyframes geminiRobotBob {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-4px); }
  }
  @keyframes geminiBar0 { from{height:8px}  to{height:20px} }
  @keyframes geminiBar1 { from{height:12px} to{height:28px} }
  @keyframes geminiBar2 { from{height:16px} to{height:22px} }
  @keyframes geminiBar3 { from{height:10px} to{height:26px} }
  @keyframes geminiWave0 { from{height:8px}  to{height:22px} }
  @keyframes geminiWave1 { from{height:14px} to{height:28px} }
  @keyframes geminiWave2 { from{height:18px} to{height:12px} }
  @keyframes geminiWave3 { from{height:10px} to{height:24px} }

  @keyframes fadeInUp {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes vapiPulseActive {
    0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
    70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }

  /* Lightning border */
  .chat-lightning-wrap { position: relative; }
  .lightning-border {
    position: absolute; inset: -2px; border-radius: 22px;
    z-index: 0; pointer-events: none;
    background: conic-gradient(
      from var(--lb-angle, 0deg),
      transparent 0deg, transparent 60deg,
      #a78bfa 80deg, #818cf8 90deg, #c4b5fd 100deg,
      transparent 120deg, transparent 180deg,
      #6366f1 200deg, #a5b4fc 210deg, #7c3aed 220deg,
      transparent 240deg, transparent 300deg,
      #818cf8 320deg, #c4b5fd 330deg, transparent 360deg
    );
    animation: lbRotate 2.4s linear infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; padding: 2px;
  }
  @property --lb-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
  @keyframes lbRotate { to { --lb-angle: 360deg; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('accreditiq-bot-styles')) {
  const s = document.createElement('style');
  s.id = 'accreditiq-bot-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}
