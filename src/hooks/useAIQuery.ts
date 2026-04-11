import { useState, useCallback } from 'react';

const AI_URL = 'http://localhost:3000/api/chat';

export function useAIQuery() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const ask = useCallback(async (prompt: string, onChunk?: (t: string) => void) => {
    setLoading(true);
    setResponse('');
    let full = '';
    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: [] }),
      });
      if (!res.ok) throw new Error('Server error');
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const d = JSON.parse(line.slice(6));
            if (d.text) {
              full += d.text;
              setResponse(full);
              onChunk?.(full);
            }
          } catch {}
        }
      }
    } catch {
      full = '⚠️ AI server not reachable. Start the server with `node server/src/index.js`.';
      setResponse(full);
    } finally {
      setLoading(false);
    }
    return full;
  }, []);

  const reset = useCallback(() => setResponse(''), []);

  return { ask, loading, response, reset };
}
