export function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
