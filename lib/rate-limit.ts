type RateLimitRecord = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting.
// Keys are typically IP addresses or user IDs.
const store = new Map<string, RateLimitRecord>();

/**
 * A lightweight in-memory rate limiter for the MVP.
 * Limits the number of requests a given identifier can make within a time window.
 * 
 * @param identifier The unique identifier for the requester (e.g., IP address, email)
 * @param limit Max number of requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns { success: boolean, remaining: number, resetTime: number }
 */
export async function rateLimit(identifier: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const record = store.get(identifier);

  // Clean up expired records occasionally
  if (store.size > 1000) {
    for (const [key, val] of Array.from(store.entries())) {
      if (now > val.resetTime) {
        store.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
