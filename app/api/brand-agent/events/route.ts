/**
 * GET /api/brand-agent/events
 * Server-Sent Events proxy — streams live logs from Railway agent to the browser.
 * Runs as a Next.js Edge Route (streaming capable).
 */
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const AGENT_URL     = process.env.BRAND_AGENT_URL!;
const AGENT_API_KEY = process.env.BRAND_AGENT_API_KEY!;

export async function GET(_req: NextRequest) {
  const upstream = await fetch(`${AGENT_URL}/api/events`, {
    headers: { 'Authorization': `Bearer ${AGENT_API_KEY}` },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Failed to connect to agent', { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
