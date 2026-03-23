import { type FormEvent, useState } from 'react';
import { ChevronDown, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import type { User } from '../../features/demo/demoShared';
import { USERS } from '../../features/demo/demoShared';

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] p-4 lg:p-0 font-sans">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-[#161B22] rounded-[40px] shadow-2xl border border-[#30363D] overflow-hidden min-h-[700px]">
        
        {/* Left Side: Image Panel */}
        <div className="hidden lg:block lg:w-[45%] relative p-8">
          <div className="w-full h-full rounded-[30px] overflow-hidden relative group">
            <img
              src="https://i.postimg.cc/KjQrfxjZ/Chat-GPT-Image-23-mar-2026-01-59-22-p-m.webp"
              alt="Artistic Visual"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Info removed */}

            {/* Bottom info removed */}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col p-10 lg:p-20 bg-[#161B22]">
          <div className="mb-0">
            {/* Header removed */}
          </div>

          <div className="mb-12">
            <h2 className="text-5xl font-black text-[#E6EDF3] tracking-tight mb-3">¡Hola!</h2>
            <p className="text-[#8B949E] font-medium text-lg">Bienvenid@ a la plataforma de gestión Vicenzo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <label className="absolute left-4 top-3 px-1 bg-[#161B22] text-[9px] font-black text-[#8B949E] uppercase tracking-[0.2em] group-focus-within:text-[#F85149] transition-colors z-10">Usuario o Email</label>
              <div className="relative uppercase">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-5 mt-5 text-xs font-black text-[#E6EDF3] appearance-none focus:outline-none focus:border-[#F85149] transition-all"
                >
                  {USERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-[2.4rem] text-[#8B949E] pointer-events-none" size={18} />
              </div>
            </div>

            <div className="relative group">
              <label className="absolute left-4 top-3 px-1 bg-[#161B22] text-[9px] font-black text-[#8B949E] uppercase tracking-[0.2em] group-focus-within:text-[#F85149] transition-colors z-10">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-5 mt-5 font-bold text-[#E6EDF3] focus:outline-none focus:border-[#F85149] transition-all placeholder:text-[#30363D]"
              />
              <button type="button" className="absolute right-4 bottom-4 text-[9px] font-black text-[#F85149] uppercase tracking-widest hover:underline">¿Olvidaste tu contraseña?</button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F85149] hover:bg-[#E0453D] text-white font-black py-5 rounded-xl uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-[#F85149]/20 active:scale-95"
            >
              Entrar al Sistema
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
