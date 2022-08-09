/**
 * Default cache removal options.
 */
export const defaultCacheRemoveOptions: CacheRemoveOptions = {
   broadcast: false
};

/**
 * Default cache clear options.
 */
export const defaultCacheClearOptions: CacheClearOptions = {
   broadcast: false
};

/**
 * Determines how a cache item data looks like.
 */
export interface CacheItemData<D> {
   /**
    * Determines the data that's stored in the cache.
    */
   data: D | Promise<D>;

   /**
    * Determines the expiration date for the given set of data.
    */
   expiresAt?: Date | null;
}

/**
 * Determines the type of the cache items.
 */
export class CacheItem<D = any> {
   /**
    * Determines the data that's stored in the cache.
    */
   data: D | Promise<D>;

   /**
    * Determines the expiration date for the given set of data.
    */
   expiresAt: Date | null;

   /**
    * Creates the cache item given the data and expiration at.
    */
   constructor({ data, expiresAt = null }: CacheItemData<D>) {
      this.data = data;
      this.expiresAt = expiresAt;
   }

   /**
    * Determines if the current cache item is still being resolved.
    * This returns true if data is a promise, or false if type `D`.
    */
   isResolving(): boolean {
      return this.data instanceof Promise;
   }

   /**
    * Determines if the given cache item has expired.
    */
   hasExpired(): boolean {
      return this.expiresAt === null || this.expiresAt < new Date();
   }

   /**
    * Set the expiration time of the given cache item relative to now.
    */
   expiresIn(milliseconds: number): this {
      this.expiresAt = new Date();
      this.expiresAt.setMilliseconds(this.expiresAt.getMilliseconds() + milliseconds);
      return this;
   }
}

/**
 * Determines the cache item removal options.
 */
export interface CacheRemoveOptions {
   /**
    * Determines if the cache should broadcast the cache
    * change to subscribed handlers. That means telling them
    * the value now resolves to undefined.
    */
   broadcast: boolean;
}

/**
 * Determines the cache clear options.
 */
export type CacheClearOptions = CacheRemoveOptions;

/**
 * Represents the methods a cache should implement
 * in order to be usable by vue-swr.
 */
export interface AccioCache {
   /**
    * Gets an item from the cache.
    */
   get<D>(key: string): CacheItem<D>;

   /**
    * Sets an item to the cache.
    */
   set<D>(key: string, value: CacheItem<D>): void;

   /**
    * Removes a key-value pair from the cache.
    */
   remove(key: string, options?: Partial<CacheRemoveOptions>): void;

   /**
    * Removes all the key-value pairs from the cache.
    */
   clear(options?: Partial<CacheClearOptions>): void;

   /**
    * Determines if the cache has a given key.
    */
   has(key: string): boolean;
}

/**
 * Default cache implementation for vue-cache.
 */
export class DefaultCache implements AccioCache {
   /**
    * Stores the elements of the cache in a key-value pair.
    */
   private elements: Map<string, CacheItem> = new Map();

   /**
    * Gets an element from the cache.
    *
    * It is assumed the item always exist when
    * you get it. Use the has method to check
    * for the existence of it.
    */
   get<D>(key: string): CacheItem<D> {
      return this.elements.get(key) as CacheItem<D>;
   }

   /**
    * Sets an element to the cache.
    */
   set<D>(key: string, value: CacheItem<D>): void {
      this.elements.set(key, value);
   }

   /**
    * Removes an key-value pair from the cache.
    */
   remove(key: string, options?: Partial<CacheRemoveOptions>): void {
      this.elements.delete(key);
   }

   /**
    * Removes all the key-value pairs from the cache.
    */
   clear(options?: Partial<CacheClearOptions>): void {
      this.elements.clear();
   }

   /**
    * Determines if the given key exists
    * in the cache.
    */
   has(key: string): boolean {
      return this.elements.has(key);
   }
}
