export interface CacheItemData<D> {
   data: D | Promise<D>;
   expiresAt?: Date | null;
}

export class CacheItem<D = any> {
   data: D | Promise<D>;
   expiresAt: Date | null;

   constructor({ data, expiresAt = null }: CacheItemData<D>) {
      this.data = data;
      this.expiresAt = expiresAt;
   }

   isResolving(): boolean {
      return this.data instanceof Promise;
   }

   hasExpired(): boolean {
      return this.expiresAt === null || this.expiresAt < new Date();
   }

   expiresIn(milliseconds: number): this {
      this.expiresAt = new Date();
      this.expiresAt.setMilliseconds(this.expiresAt.getMilliseconds() + milliseconds);
      return this;
   }
}

export interface AccioCache {
   get<D>(key: string): CacheItem<D>;
   set<D>(key: string, value: CacheItem<D>): void;
   remove(key: string): void;
   clear(): void;
   has(key: string): boolean;
}

export class DefaultCache implements AccioCache {
   private elements: Map<string, CacheItem> = new Map();

   get<D>(key: string): CacheItem<D> {
      return this.elements.get(key) as CacheItem<D>;
   }

   set<D>(key: string, value: CacheItem<D>): void {
      this.elements.set(key, value);
   }

   remove(key: string): void {
      this.elements.delete(key);
   }

   clear(): void {
      this.elements.clear();
   }

   has(key: string): boolean {
      return this.elements.has(key);
   }
}
