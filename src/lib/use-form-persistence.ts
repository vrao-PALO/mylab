import { useEffect, useState } from "react";
import { RequirementIntake, AssessmentScope, DataInputCatalog } from "@/types/domain";

type FormState = RequirementIntake | AssessmentScope | DataInputCatalog;

/**
 * Hook to persist form data to localStorage and restore on mount.
 * Automatically saves state on every change; hydrates from storage on first render.
 */
export function useFormPersistence<T extends FormState>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {

  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    
    const stored = localStorage.getItem(`form_${key}`);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch (e) {
        console.warn(`Failed to restore form state for ${key}`, e);
      }
    }
    return initialValue;
  });

  // Persist to localStorage on value change
  useEffect(() => {
    localStorage.setItem(`form_${key}`, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
