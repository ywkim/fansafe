/**
 * Trade Safety - Internal exports
 *
 * Note: This file is kept for potential future use.
 * Library build has been removed; this is now a full-stack Next.js app.
 */

// Components
export { DetailedResult } from './components/DetailedResult';
export { QuickResultTeaser } from './components/QuickResultTeaser';
export { RiskSignalCard } from './components/RiskSignalCard';

// Repositories
export {
  isFullResponse,
  isQuickCheckResponse,
  TradeSafetyRepository,
  type TradeSafetyCheckRepositoryResponse,
} from './repositories/TradeSafetyRepository';

// Types & Constants
export * from './types';

// i18n - Translation objects
export { default as enTranslations } from './i18n/locales/en/translation.json';
export { default as esTranslations } from './i18n/locales/es/translation.json';
export { default as idTranslations } from './i18n/locales/id/translation.json';
export { default as jaTranslations } from './i18n/locales/ja/translation.json';
export { default as koTranslations } from './i18n/locales/ko/translation.json';
export { default as zhTranslations } from './i18n/locales/zh/translation.json';
