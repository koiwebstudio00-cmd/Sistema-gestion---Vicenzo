import { useEffect, useState } from 'react';
import { APP_ROUTES, normalizePath, type AppPath } from './routes';

const getCurrentPath = (): AppPath => {
  if (typeof window === 'undefined') {
    return APP_ROUTES.login;
  }

  return normalizePath(window.location.pathname);
};

export const useAppRouter = () => {
  const [currentPath, setCurrentPath] = useState<AppPath>(getCurrentPath);

  useEffect(() => {
    const syncPath = () => setCurrentPath(getCurrentPath());
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const navigate = (nextPath: AppPath, options?: { replace?: boolean }) => {
    const targetPath = normalizePath(nextPath);
    const method = options?.replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', targetPath);
    setCurrentPath(targetPath);
  };

  return {
    currentPath,
    navigate,
  };
};
