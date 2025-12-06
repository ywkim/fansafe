import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';

import { db, tradeSafetyChecks } from '@/db';
import { TradeSafetyService } from '@/services/TradeSafetyService';

interface CreateRequest {
  input_text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateRequest;
    const { input_text } = body;

    if (!input_text || !input_text.trim()) {
      return NextResponse.json(
        { detail: 'input_text is required', code: 'VALIDATION_ERROR' },
        { status: 422 }
      );
    }

    // LLM 분석
    const service = new TradeSafetyService();
    const analysis = await service.analyzeTrade(input_text);

    // DB 저장
    const id = nanoid();
    const now = new Date();

    await db.insert(tradeSafetyChecks).values({
      id,
      inputText: input_text,
      llmAnalysis: analysis,
      riskScore: analysis.risk_score,
      createdAt: now,
      updatedAt: now,
    });

    // Public-only: QuickCheck 응답
    return NextResponse.json({
      data: {
        id,
        quick_summary: {
          risk_signals_count: analysis.risk_signals.length,
          cautions_count: analysis.cautions.length,
          safe_indicators_count: analysis.safe_indicators.length,
        },
        signup_required: true,
      },
    });
  } catch (error) {
    console.error('Trade safety check failed:', error);

    if (error instanceof Error && error.message.includes('input_text')) {
      return NextResponse.json(
        { detail: error.message, code: 'VALIDATION_ERROR' },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { detail: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
