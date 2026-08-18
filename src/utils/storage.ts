/**
 * Storage utility: provides a safe interface for persistence across browser and Node.js.
 * Implements a simple 'fs'-like interface for the SaveManager to avoid direct node dependencies in the build.
 */

const IS_BROWSER = typeof window !== 'undefined';

export const storage = {
  save: (name: string, data: string) => {
    if (IS_BROWSER) {
      localStorage.setItem(`p3s_${name}`, data);
    } else {
      // Node.js fallback (handled via SaveManager's dynamic imports if possible, 
      // but here we provide a dummy for the build)
      console.warn('Storage.save: FS not available in browser build.');
    }
  },

  load: (name: string): string | null => {
    if (IS_BROWSER) {
      return localStorage.getItem(`p3s_${name}`);
    }
    return null;
  },

  list: (): string[] => {
    if (IS_BROWSER) {
      return Object.keys(localStorage)
        .filter(key => key.startsWith('p3s_'))
        .map(key => key.replace('p3s_', ''));
    }
    return [];
  },

  remove: (name: string) => {
    if (IS_BROWSER) {
      localStorage.removeItem(`p3s_${name}`);
    }
  }
};
