import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db, tradeSafetyChecks } from '@/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const check = await db.query.tradeSafetyChecks.findFirst({
      where: eq(tradeSafetyChecks.id, id),
    });

    if (!check) {
      return NextResponse.json(
        { detail: 'Trade safety check not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Public-only: QuickCheck 응답
    return NextResponse.json({
      data: {
        id: check.id,
        quick_summary: {
          risk_signals_count: check.llmAnalysis.risk_signals.length,
          cautions_count: check.llmAnalysis.cautions.length,
          safe_indicators_count: check.llmAnalysis.safe_indicators.length,
        },
        signup_required: true,
      },
    });
  } catch (error) {
    console.error('Failed to get trade safety check:', error);

    return NextResponse.json(
      { detail: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
