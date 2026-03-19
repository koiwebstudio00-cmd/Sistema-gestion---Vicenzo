import { useEffect, useState } from 'react';
import { type User } from './features/demo/DemoModule';
import { LoginPage } from './pages/LoginPage';
import { RoleWorkspacePage } from './pages/RoleWorkspacePage';
import { APP_ROUTES, getHomeRouteForRole } from './router/routes';
import { useAppRouter } from './router/useAppRouter';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { currentPath, navigate } = useAppRouter();

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigate(getHomeRouteForRole(user.role));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate(APP_ROUTES.login);
  };

  useEffect(() => {
    if (!currentUser) {
      if (currentPath !== APP_ROUTES.login) {
        navigate(APP_ROUTES.login, { replace: true });
      }
      return;
    }

    const expectedPath = getHomeRouteForRole(currentUser.role);
    if (currentPath !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [currentPath, currentUser, navigate]);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <RoleWorkspacePage onLogout={handleLogout} user={currentUser} />;
}
