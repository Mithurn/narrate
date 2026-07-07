/**
 * StorageService: thin wrapper around window.localStorage, namespaced per-repository
 */
class StorageService {
  constructor(private namespace: string) {}

  private key(key: string): string {
    return `${this.namespace}:${key}`;
  }

  get<T>(key: string): T | undefined {
    try {
      const raw = window.localStorage.getItem(this.key(key));
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(this.key(key), JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }

  remove(key: string): void {
    window.localStorage.removeItem(this.key(key));
  }

  /**
   * Clear all keys belonging to this namespace
   */
  clear(): void {
    const prefix = `${this.namespace}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(prefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => window.localStorage.removeItem(k));
  }

  /**
   * Approximate byte size of all keys in this namespace
   */
  getSize(): number {
    const prefix = `${this.namespace}:`;
    let size = 0;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith(prefix)) {
        const value = window.localStorage.getItem(k) ?? "";
        size += k.length + value.length;
      }
    }
    return size;
  }
}

export default StorageService;
