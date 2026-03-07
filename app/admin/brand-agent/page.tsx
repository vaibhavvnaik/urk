'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  phase: string;
  message: string;
}

interface AgentStats {
  discovered?: number;
  duplicatesSkipped?: number;
  signupSuccess?: number;
  signupFailed?: number;
  confirmed?: number;
  categorized?: number;
}

interface AgentStatus {
  running: boolean;
  startedAt?: string;
  stats: AgentStats;
  lastResult?: { status: string; completedAt: string; error?: string } & AgentStats;
  recentLogs: LogEntry[];
}

const levelStyle: Record<string, string> = {
  info: 'text-gray-300',
  success: 'text-green-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};

function formatTime(iso: string) {
  try { return new Date(iso).toLocaleTimeString(); } catch { return iso; }
}

export default function BrandAgentPage() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchSize, setBatchSize] = useState(10);
  const [mode, setMode] = useState('full');
  const [error, setError] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const sseRef = useRef<EventSource | null>(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    if (autoScroll.current) logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = useCallback((entry: LogEntry) => {
    setLogs(prev => { const next = [...prev, entry]; return next.length > 500 ? next.slice(-500) : next; });
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/brand-agent/status');
      const data: AgentStatus = await res.json();
      setStatus(data); setRunning(data.running);
      if (data.recentLogs?.length && logs.length === 0) setLogs(data.recentLogs);
    } catch (_) {}
  }, [logs.length]);

  const connectSSE = useCallback(() => {
    sseRef.current?.close();
    const es = new EventSource('/api/brand-agent/events');
    sseRef.current = es;
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'init') {
          setRunning(data.running);
          if (data.logs?.length) setLogs(data.logs);
        } else if (data.type === 'log') {
          addLog(data.entry);
          if (data.entry.phase === 'done' || data.entry.phase === 'error') {
            setRunning(false); setLoading(false); fetchStatus();
          }
        }
      } catch (_) {}
    };
    return es;
  }, [addLog, fetchStatus]);

  useEffect(() => {
    fetchStatus(); connectSSE();
    return () => { sseRef.current?.close(); };
  }, []); // eslint-disable-line

  async function handleStart() {
    setError(null); setLoading(true); setLogs([]);
    try {
      const res = await fetch('/api/brand-agent/start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize, mode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to start'); setLoading(false); return; }
      setRunning(true); setLoading(false); connectSSE();
    } catch (err: any) { setError(err.message); setLoading(false); }
  }

  async function handleStop() {
    try { await fetch('/api/brand-agent/stop', { method: 'POST' }); } catch (_) {}
  }

  const stats = status?.stats || status?.lastResult || {};
  const lastRun = status?.lastResult;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Brand Onboarding Agent</h1>
            <p className="text-gray-400 text-sm mt-1">Discovers, categorises, and subscribes to brand newsletters automatically.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${running ? 'bg-green-900 text-green-300 animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
            {running ? 'Running' : 'Idle'}
          </span>
        </div>
        {error && <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="font-semibold mb-4">Run Configuration</h2>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-wide">Batch Size</label>
              <input type="number" min={1} max={100} value={batchSize} disabled={running}
                onChange={e => setBatchSize(Number(e.target.value))}
                className="w-28 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 uppercase tracking-wide">Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} disabled={running}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                <option value="full">Full Pipeline</option>
                <option value="discover">Discovery Only</option>
                <option value="scan_emails">Scan Emails</option>
                <option value="stale_check">Stale Check</option>
              </select>
            </div>
            <div className="mt-auto">
              {!running
                ? <button onClick={handleStart} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2 px-6 rounded-lg">
                    {loading ? 'Starting...' : 'Start Agent'}
                  </button>
                : <button onClick={handleStop}
                    className="bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg">
                    Stop Agent
                  </button>
              }
            </div>
          </div>
        </div>
        {(running || lastRun) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Discovered', value: stats.discovered ?? 0, color: 'text-blue-400' },
              { label: 'Categorised', value: stats.categorized ?? 0, color: 'text-purple-400' },
              { label: 'Signed Up', value: stats.signupSuccess ?? 0, color: 'text-green-400' },
              { label: 'Confirmed', value: stats.confirmed ?? 0, color: 'text-emerald-400' },
              { label: 'Failed', value: stats.signupFailed ?? 0, color: 'text-red-400' },
              { label: 'Skipped', value: stats.duplicatesSkipped ?? 0, color: 'text-gray-400' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {lastRun && !running && (
          <div className={`rounded-xl px-4 py-3 border text-sm ${lastRun.status === 'completed' ? 'bg-green-900/20 border-green-800 text-green-300' : 'bg-red-900/20 border-red-800 text-red-300'}`}>
            {lastRun.status === 'completed' ? 'Last run completed' : 'Last run failed: ' + (lastRun.error || 'Unknown error')}
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h2 className="font-semibold text-sm">Live Logs</h2>
            <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
          </div>
          <div className="h-96 overflow-y-auto p-4 font-mono text-xs space-y-0.5"
            onScroll={e => { const el = e.currentTarget; autoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40; }}>
            {logs.length === 0 && <p className="text-gray-600 italic">Logs will appear here when the agent runs</p>}
            {logs.map((log, i) => (
              <div key={i} className={'leading-5 ' + (levelStyle[log.level] || 'text-gray-300')}>
                <span className="text-gray-600 mr-2">{formatTime(log.timestamp)}</span>
                <span className="text-gray-500 mr-2">[{log.phase}]</span>
                {log.message}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
        <p className="text-center text-gray-600 text-xs">Agent running on Railway - Logs stream via SSE</p>
      </div>
    </div>
  );
}
