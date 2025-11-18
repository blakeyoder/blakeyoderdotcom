/**
 * Spam detection for contact form messages
 * Checks for excessive URLs and spam keywords
 */

import { config } from './config';

export interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
}

// Common spam keywords (case-insensitive)
const SPAM_KEYWORDS = [
  'viagra',
  'cialis',
  'pharmacy',
  'casino',
  'lottery',
  'winner',
  'congratulations you won',
  'click here now',
  'limited time offer',
  'act now',
  'buy now',
  'credit card',
  'cash prize',
  'work from home',
  'make money fast',
  'investment opportunity',
  'earn extra cash',
  'nigerian prince',
  'inheritance',
  'western union',
  'wire transfer',
];

/**
 * Check if message contains spam indicators
 * @param message - Message text to check
 * @returns SpamCheckResult indicating if message is spam
 */
export function checkForSpam(message: string): SpamCheckResult {
  const lowerMessage = message.toLowerCase();

  // Check for excessive URLs
  const urlCount = countURLs(message);
  if (urlCount > config.spamMaxUrls) {
    return {
      isSpam: true,
      reason: `Message contains too many links (${urlCount} found, maximum ${config.spamMaxUrls} allowed)`,
    };
  }

  // Check for spam keywords
  for (const keyword of SPAM_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return {
        isSpam: true,
        reason: 'Message contains suspicious content',
      };
    }
  }

  // Check for excessive ALL CAPS (>80% of letters are uppercase)
  const letters = message.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 20) {
    const upperCount = message.replace(/[^A-Z]/g, '').length;
    const capsPercentage = upperCount / letters.length;
    if (capsPercentage > 0.8) {
      return {
        isSpam: true,
        reason: 'Message contains excessive capitalization',
      };
    }
  }

  return { isSpam: false };
}

/**
 * Count number of URLs in text
 * Matches http://, https://, and www. patterns
 */
function countURLs(text: string): number {
  const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
  const matches = text.match(urlPattern);
  return matches ? matches.length : 0;
}
