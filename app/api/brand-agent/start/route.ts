/**
 * POST /api/brand-agent/start
 * Proxies to Railway agent: POST /api/agent/run
 * Called by the urklist.com admin page to kick off an agent run.
 */
import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL     = process.env.BRAND_AGENT_URL!;
const AGENT_API_KEY = process.env.BRAND_AGENT_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { batchSize = 10, mode = 'full' } = body;

    const res = await fetch(`${AGENT_URL}/api/agent/run`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${AGENT_API_KEY}`,
      },
      body: JSON.stringify({ batchSize, mode }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
