import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import type { TradeSafetyAnalysis } from '@/types';

export const tradeSafetyChecks = pgTable(
  'trade_safety_checks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    inputText: text('input_text').notNull(),
    llmAnalysis: json('llm_analysis').$type<TradeSafetyAnalysis>().notNull(),
    riskScore: integer('risk_score').notNull(),
    expertAdvice: text('expert_advice'),
    expertReviewed: boolean('expert_reviewed').notNull().default(false),
    expertReviewedAt: timestamp('expert_reviewed_at'),
    expertReviewedBy: text('expert_reviewed_by'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('ix_trade_safety_checks_user_id').on(table.userId),
    index('ix_trade_safety_checks_expert_reviewed').on(table.expertReviewed),
  ]
);

export type TradeSafetyCheck = typeof tradeSafetyChecks.$inferSelect;
export type NewTradeSafetyCheck = typeof tradeSafetyChecks.$inferInsert;
