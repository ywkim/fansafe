import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

import { TRADE_SAFETY_SYSTEM_PROMPT } from '@/prompts/tradeSafety';
import {
  TradeSafetyAnalysis,
  TradeSafetyAnalysisSchema,
} from '@/schemas/tradeSafety';

const MAX_INPUT_LENGTH = 10000;

export class TradeSafetyService {
  private openai: OpenAI;
  private model: string;
  private systemPrompt: string;

  constructor(options?: { model?: string; systemPrompt?: string }) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = options?.model ?? 'gpt-4o';
    this.systemPrompt = options?.systemPrompt ?? TRADE_SAFETY_SYSTEM_PROMPT;
  }

  async analyzeTrade(inputText: string): Promise<TradeSafetyAnalysis> {
    this.validateInput(inputText);

    const response = await this.openai.chat.completions.create({
      model: this.model,
      temperature: 0.7,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: inputText },
      ],
      response_format: zodResponseFormat(
        TradeSafetyAnalysisSchema,
        'trade_safety_analysis'
      ),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const analysis = TradeSafetyAnalysisSchema.parse(JSON.parse(content));
    return analysis;
  }

  private validateInput(inputText: string): void {
    if (!inputText || !inputText.trim()) {
      throw new Error('input_text cannot be empty');
    }

    if (inputText.length > MAX_INPUT_LENGTH) {
      throw new Error(
        `input_text too long: ${inputText.length} chars (max ${MAX_INPUT_LENGTH})`
      );
    }
  }
}
