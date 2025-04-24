import { useCallback, useEffect, useState } from "react";

interface useLocalStorageArgs<T> {
  key: string;
  initialValue: T;
}

export const useLocalStorage = <T>({
  key,
  initialValue,
}: useLocalStorageArgs<T>) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<T | null>(initialValue);

  const getStorageValue = useCallback((storageKey: string) => {
    try {
      const storageVal = window.localStorage.getItem(storageKey);

      if (storageVal !== null) {
        const deserialisedValue = JSON.parse(storageVal);
        setValue(deserialisedValue as T);
      }
    } catch {
      console.error("Error retrieving localStorage value");
    } finally {
      setLoading(false);
    }
  }, []);

  const setStorageValue = (newValue: T) => {
    try {
      const stringifiedVal = JSON.stringify(newValue);
      window.localStorage.setItem(key, stringifiedVal);
      setValue(newValue);
    } catch {
      console.error("Error setting localStorage value");
    }
  };

  useEffect(() => {
    setLoading(true);
    getStorageValue(key);
  }, [key, getStorageValue]);

  return { value, setStorageValue, loading };
};
