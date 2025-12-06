import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { TradeSafetyAnalysis } from '@/types';

export const tradeSafetyChecks = sqliteTable(
  'trade_safety_checks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    inputText: text('input_text').notNull(),
    llmAnalysis: text('llm_analysis', { mode: 'json' })
      .$type<TradeSafetyAnalysis>()
      .notNull(),
    riskScore: integer('risk_score').notNull(),
    expertAdvice: text('expert_advice'),
    expertReviewed: integer('expert_reviewed', { mode: 'boolean' })
      .notNull()
      .default(false),
    expertReviewedAt: integer('expert_reviewed_at', { mode: 'timestamp' }),
    expertReviewedBy: text('expert_reviewed_by'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [
    index('ix_trade_safety_checks_user_id').on(table.userId),
    index('ix_trade_safety_checks_expert_reviewed').on(table.expertReviewed),
  ]
);

export type TradeSafetyCheck = typeof tradeSafetyChecks.$inferSelect;
export type NewTradeSafetyCheck = typeof tradeSafetyChecks.$inferInsert;
