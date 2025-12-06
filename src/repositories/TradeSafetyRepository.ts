import { z } from 'zod';

import type {
  QuickCheckResponse,
  TradeSafetyCheckRequest,
  TradeSafetyCheckResponse,
} from '@/types';

// Zod schemas for validation
const quickSummarySchema = z.object({
  risk_signals_count: z.number(),
  cautions_count: z.number(),
  safe_indicators_count: z.number(),
});

const quickCheckResponseSchema = z.object({
  id: z.string(),
  quick_summary: quickSummarySchema,
  signup_required: z.literal(true),
});

// Repository response types
export type TradeSafetyCheckRepositoryResponse =
  | TradeSafetyCheckResponse
  | QuickCheckResponse;

// Type guard
export function isQuickCheckResponse(
  response: TradeSafetyCheckRepositoryResponse
): response is QuickCheckResponse {
  return 'quick_summary' in response && 'signup_required' in response;
}

export function isFullResponse(
  response: TradeSafetyCheckRepositoryResponse
): response is TradeSafetyCheckResponse {
  return 'llm_analysis' in response;
}

interface ApiResponse<T> {
  data: T;
}

export class TradeSafetyRepository {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async create(
    request: TradeSafetyCheckRequest
  ): Promise<TradeSafetyCheckRepositoryResponse> {
    const response = await fetch(`${this.baseUrl}/trade-safety`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = (await response.json()) as { detail?: string };
      throw new Error(error.detail ?? 'Failed to create trade safety check');
    }

    const json = (await response.json()) as ApiResponse<QuickCheckResponse>;
    return quickCheckResponseSchema.parse(json.data);
  }

  async getOne(id: string): Promise<TradeSafetyCheckRepositoryResponse> {
    const response = await fetch(`${this.baseUrl}/trade-safety/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Trade safety check not found');
      }
      const error = (await response.json()) as { detail?: string };
      throw new Error(error.detail ?? 'Failed to get trade safety check');
    }

    const json = (await response.json()) as ApiResponse<QuickCheckResponse>;
    return quickCheckResponseSchema.parse(json.data);
  }
}
