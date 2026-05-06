import Redis from 'ioredis';

let client = null;
let memoryStore = new Map();
let useMemoryFallback = false;

export const initRedis = async () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.warn('[redis] REDIS_URL not set – using in-memory fallback');
    useMemoryFallback = true;
    return;
  }

  client = new Redis(url, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
    retryStrategy: (times) => (times > 3 ? null : Math.min(times * 200, 1000)),
  });

  client.on('error', (err) => {
    if (!useMemoryFallback) {
      console.warn(`[redis] error → falling back to memory store: ${err.message}`);
      useMemoryFallback = true;
    }
  });

  try {
    await client.connect();
    await client.ping();
    console.log('[redis] connected');
  } catch (err) {
    console.warn(`[redis] connection failed → using in-memory fallback (${err.message})`);
    useMemoryFallback = true;
  }
};

const ensure = () => {
  if (useMemoryFallback || !client) return null;
  return client;
};

export const redis = {
  async get(key) {
    const c = ensure();
    if (!c) {
      const entry = memoryStore.get(key);
      if (!entry) return null;
      if (entry.expiresAt && entry.expiresAt < Date.now()) {
        memoryStore.delete(key);
        return null;
      }
      return entry.value;
    }
    return c.get(key);
  },

  async set(key, value, ttlSeconds) {
    const c = ensure();
    if (!c) {
      memoryStore.set(key, {
        value,
        expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
      });
      return 'OK';
    }
    if (ttlSeconds) return c.set(key, value, 'EX', ttlSeconds);
    return c.set(key, value);
  },

  async del(key) {
    const c = ensure();
    if (!c) return memoryStore.delete(key) ? 1 : 0;
    return c.del(key);
  },

  async expire(key, ttlSeconds) {
    const c = ensure();
    if (!c) {
      const entry = memoryStore.get(key);
      if (entry) entry.expiresAt = Date.now() + ttlSeconds * 1000;
      return 1;
    }
    return c.expire(key, ttlSeconds);
  },
};
