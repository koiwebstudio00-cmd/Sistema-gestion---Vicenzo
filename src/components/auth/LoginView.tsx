import { type FormEvent, useState } from 'react';
import type { User } from '../../features/demo/demoShared';
import { USERS } from '../../features/demo/demoShared';
import { CustomSelect } from '../ui/CustomSelect';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView = ({ onLogin }: LoginViewProps) => {
  const [selectedUser, setSelectedUser] = useState<string>(USERS[0].id);
  const [salon, setSalon] = useState('Vicenzo');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.id === selectedUser);
    if (user) onLogin(user);
  };

  const salonOptions = [
    { value: 'Vicenzo', label: 'Vicenzo' },
    { value: 'Casita San Javier', label: 'Casita San Javier' },
  ];

  const userOptions = USERS.map(user => ({
    value: user.id,
    label: `${user.name} (${user.role})`,
  }));

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans">
      <div className="w-full max-w-[420px] mx-4 bg-[#161B22] border border-[#30363D] rounded-xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png"
            alt="Vicenzo Logo"
            className="h-12 object-contain mb-4"
          />
          <h2 className="text-xl font-display font-semibold text-[#E6EDF3]">Sistema de Gestión de Eventos</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Salón activo</label>
            <CustomSelect value={salon} onChange={setSalon} options={salonOptions} label="Salón activo" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Usuario</label>
            <CustomSelect value={selectedUser} onChange={setSelectedUser} options={userOptions} label="Usuario" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C8A951] hover:bg-[#D4B96A] text-[#0D1117] font-bold py-3 rounded-lg transition-colors"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};
