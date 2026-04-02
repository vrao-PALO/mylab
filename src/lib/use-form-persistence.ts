import { useEffect, useState } from "react";

export function getFormStorageKey(key: string) {
  return `form_${key}`;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/**
 * Hook to persist form data to localStorage and restore on mount.
 * Automatically saves state on every change; hydrates from storage on first render.
 */
export function useFormPersistence<T extends JsonValue>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    const stored = localStorage.getItem(getFormStorageKey(key));
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch (error) {
        console.warn(`Failed to restore form state for ${key}`, error);
      }
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(getFormStorageKey(key), JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}