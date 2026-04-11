import { useState } from 'react';
import { useAIQuery } from '@/hooks/useAIQuery';
import { SparklesIcon } from '@/components/ui/Icon';

interface Props {
  placeholder?: string;
  prefillPrompt?: string;   // auto-fills the input
  compact?: boolean;        // smaller inline style
}

function renderMd(text: string) {
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`(.+?)`/g,'<code style="background:var(--accent-lt);color:var(--accent);padding:1px 4px;border-radius:3px;font-size:10px;">$1</code>')
    .replace(/^### (.+)$/gm,'<div style="font-weight:700;font-size:12px;margin:8px 0 3px;color:var(--accent);">$1</div>')
    .replace(/^## (.+)$/gm,'<div style="font-weight:700;font-size:13px;margin:10px 0 4px;color:var(--accent);">$1</div>')
    .replace(/^- (.+)$/gm,'<div style="display:flex;gap:5px;margin:1px 0;"><span style="color:var(--accent);">•</span><span>$1</span></div>')
    .replace(/\n\n/g,'<br/><br/>').replace(/\n/g,'<br/>');
}

export default function AIQueryBox({ placeholder, prefillPrompt, compact }: Props) {
  const [input, setInput] = useState(prefillPrompt ?? '');
  const { ask, loading, response, reset } = useAIQuery();

  async function submit() {
    if (!input.trim()) return;
    await ask(input.trim());
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Input row */}
      <div className="flex items-end gap-2 rounded-lg px-3 py-2"
        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-dk)' }}>
        <SparklesIcon className="w-3.5 h-3.5 flex-shrink-0 mb-0.5" style={{ color: 'var(--accent)' }} />
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder={placeholder ?? 'Ask AI about this…'}
          rows={compact ? 1 : 2}
          className="flex-1 bg-transparent text-xs outline-none resize-none"
          style={{ color: 'var(--text-primary)', maxHeight: 80, lineHeight: 1.5 }}
        />
        <button
          onClick={submit}
          disabled={loading || !input.trim()}
          className="btn-primary text-xs px-3 py-1.5 flex-shrink-0 flex items-center gap-1.5"
          style={{ opacity: loading || !input.trim() ? 0.5 : 1 }}
        >
          {loading
            ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            : <SparklesIcon className="w-3 h-3" />
          }
          {loading ? 'Thinking…' : 'Ask AI'}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="rounded-lg p-3 text-xs leading-relaxed relative"
          style={{ background: 'var(--accent-lt)', border: '1px solid #93C5FD', color: 'var(--text-primary)' }}>
          <button
            onClick={reset}
            className="absolute top-2 right-2 text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >✕</button>
          <div dangerouslySetInnerHTML={{ __html: renderMd(response) }} />
        </div>
      )}
    </div>
  );
}
