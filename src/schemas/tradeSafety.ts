import { z } from 'zod';

export const RiskSeveritySchema = z.enum(['high', 'medium', 'low']);
export const RiskCategorySchema = z.enum([
  'payment',
  'seller',
  'platform',
  'price',
  'content',
]);

export const RiskSignalSchema = z.object({
  category: RiskCategorySchema,
  severity: RiskSeveritySchema,
  title: z.string().describe('Brief title of the risk signal'),
  description: z.string().describe('Detailed explanation of the risk'),
  what_to_do: z.string().describe('Recommended action for the user'),
});

export const PriceAnalysisSchema = z.object({
  market_price_range: z
    .string()
    .nullable()
    .describe("Typical market price range, e.g., '$15-20 USD'"),
  offered_price: z
    .number()
    .nullable()
    .describe('Numeric price value, or null if not mentioned'),
  currency: z
    .string()
    .max(3)
    .nullable()
    .describe('ISO 4217 currency code (USD, KRW, JPY, etc.)'),
  price_assessment: z.string().describe('Assessment of price fairness'),
  warnings: z.array(z.string()).describe('Price-related warnings'),
});

export const TradeSafetyAnalysisSchema = z.object({
  translation: z
    .string()
    .nullable()
    .describe('English translation if input was Korean, otherwise null'),
  nuance_explanation: z
    .string()
    .nullable()
    .describe('Explanation of Korean slang/context, or null if not applicable'),
  risk_signals: z
    .array(RiskSignalSchema)
    .describe('Clear red flags requiring immediate attention'),
  cautions: z
    .array(RiskSignalSchema)
    .describe('Suspicious but not conclusive points'),
  safe_indicators: z
    .array(RiskSignalSchema)
    .describe('Positive safety indicators'),
  price_analysis: PriceAnalysisSchema.describe('Price fairness analysis'),
  safety_checklist: z
    .array(z.string())
    .describe('Actionable checklist items to verify before proceeding'),
  risk_score: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe('Overall risk score 0-100, higher = more risky'),
  recommendation: z.string().describe('Final recommendation text'),
  emotional_support: z
    .string()
    .describe('Empathetic message to reduce FOMO and anxiety'),
});

export type RiskSeverity = z.infer<typeof RiskSeveritySchema>;
export type RiskCategory = z.infer<typeof RiskCategorySchema>;
export type RiskSignal = z.infer<typeof RiskSignalSchema>;
export type PriceAnalysis = z.infer<typeof PriceAnalysisSchema>;
export type TradeSafetyAnalysis = z.infer<typeof TradeSafetyAnalysisSchema>;
