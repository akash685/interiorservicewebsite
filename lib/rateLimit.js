/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * IMPORTANT: Whitelists search engine bots for SEO
 */

// Known search engine bot user agents
const SEARCH_ENGINE_BOTS = [
  'googlebot',
  'bingbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'slurp', // Yahoo
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
];

/**
 * Check if request is from a search engine bot
 */
function isSearchBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SEARCH_ENGINE_BOTS.some(bot => ua.includes(bot));
}

class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   * @param {string} identifier - IP address or user ID
   * @param {number} maxRequests - Maximum requests allowed
   * @param {number} windowMs - Time window in milliseconds
   * @param {string} userAgent - User agent string (optional, for bot detection)
   * @returns {boolean} - True if allowed, false if rate limited
   */
  check(identifier, maxRequests = 10, windowMs = 60000, userAgent = null) {
    // Always allow search engine bots
    if (userAgent && isSearchBot(userAgent)) {
      console.log(`✅ Search bot allowed: ${userAgent}`);
      return true;
    }

    const now = Date.now();
    const record = this.requests.get(identifier);

    // No previous requests
    if (!record) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    // Window expired, reset
    if (now > record.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    // Within window
    if (record.count >= maxRequests) {
      console.log(`⚠️ Rate limit exceeded for ${identifier}`);
      return false; // Rate limited
    }

    // Increment counter
    record.count++;
    return true;
  }

  /**
   * Clean up old entries (call periodically)
   */
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Global instance
const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

export default rateLimiter;
