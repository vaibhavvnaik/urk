/**
 * POST /api/brand-agent/stop
 * Proxies to Railway agent: POST /api/agent/stop
 */
import { NextRequest, NextResponse } from 'next/server';

const AGENT_URL     = process.env.BRAND_AGENT_URL!;
const AGENT_API_KEY = process.env.BRAND_AGENT_API_KEY!;

export async function POST(_req: NextRequest) {
  try {
    const res = await fetch(`${AGENT_URL}/api/agent/stop`, {
      method:  'POST',
      headers: { 'Authorization': `Bearer ${AGENT_API_KEY}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
