import type { User } from '../features/demo/DemoModule';
import { LoginView } from '../features/demo/DemoModule';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => <LoginView onLogin={onLogin} />;
