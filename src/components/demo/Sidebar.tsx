import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  FileText,
  LogOut,
  Package,
  Settings,
  X,
  Users,
  Wallet,
} from 'lucide-react';
import type { User } from '../../features/demo/demoShared';

interface SidebarProps {
  activeView: string;
  isOpen: boolean;
  onChangeView: (view: string) => void;
  onClose: () => void;
  onLogout: () => void;
  user: User;
}

export const Sidebar = ({ activeView, onChangeView, user, onLogout, isOpen, onClose }: SidebarProps) => {
  const [salon, setSalon] = useState('Vicenzo');

  const menuItems = [
    { id: 'AGENDA', label: 'Agenda', icon: Calendar },
    { id: 'EVENTOS', label: 'Eventos', icon: FileText },
    { id: 'CATALOGO', label: 'Presupuesto', icon: Package, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING'] },
    { id: 'PAGOS', label: 'Historial de Cobros', icon: CreditCard, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING'] },
    { id: 'LIQUIDACIONES', label: 'Liquidaciones', icon: FileText, restricted: ['PRODUCCION', 'TIO_FRANCO'] },
    { id: 'REPORTES', label: 'Reportes', icon: BarChart3, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING', 'INVITADO'] },
    { id: 'GASTOS', label: 'Gastos Semanales', icon: DollarSign, restricted: ['RECEPCIONISTA', 'PRODUCCION', 'CATERING', 'INVITADO'] },
    { id: 'COBROS', label: 'Mis Cobros', icon: Wallet, roleSpecific: ['GUILLERMINA', 'JEFE'] },
    { id: 'GUESTS', label: 'Lista de Invitados', icon: Users, roleSpecific: ['INVITADO'] },
    { id: 'PLANILLA', label: 'Planilla Operativa', icon: FileText, roleSpecific: ['INVITADO'] },
  ];

  const filteredItems = menuItems.filter(item => {
    if (user.role === 'INVITADO') {
      return ['GUESTS', 'PLANILLA'].includes(item.id);
    }
    if (user.role === 'CATERING') {
      return ['AGENDA', 'EVENTOS', 'LIQUIDACIONES'].includes(item.id);
    }
    if (user.role === 'GUILLERMINA') {
      return ['COBROS'].includes(item.id);
    }
    // Filter out roleSpecific items for general roles unless specified
    if (item.roleSpecific && !item.roleSpecific.includes(user.role)) return false;
    
    return !item.restricted || !item.restricted.includes(user.role);
  });

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0D1117] border-r border-[#30363D] 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="p-6 flex flex-col items-center border-b border-[#30363D]/50 relative">
          <button onClick={onClose} className="absolute top-2 right-2 p-2 text-[#8B949E] hover:text-[#E6EDF3] lg:hidden">
            <X size={20} />
          </button>

          <img
            src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png"
            alt="Vicenzo"
            className="h-20 object-contain "
          />

          <div className="relative w-full">
            <select
              value={salon}
              onChange={e => setSalon(e.target.value)}
              className="w-full bg-[#161B22] border border-[#30363D] text-[#E6EDF3] text-sm rounded-lg px-3 py-2 appearance-none focus:outline-none focus:border-[#C8A951]"
            >
              <option value="Vicenzo">Vicenzo</option>
              <option value="Casita San Javier">Casita San Javier</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-3.5 w-3.5 text-[#8B949E] pointer-events-none" />
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#C8A951]/15 text-[#C8A951]' : 'text-[#E6EDF3] hover:bg-[#161B22]'}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {user.role !== 'INVITADO' && user.role !== 'GUILLERMINA' && (
          <div className="px-3 py-4 space-y-1">
            <button
              onClick={() => {
                onChangeView('CONFIGURACION');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeView === 'CONFIGURACION' ? 'bg-[#C8A951]/15 text-[#C8A951]' : 'text-[#E6EDF3] hover:bg-[#161B22]'}`}
            >
              <Settings size={18} />
              Configuración
            </button>
          </div>
        )}

        <div className="p-4 border-t border-[#30363D]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#C8A951] font-bold">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#E6EDF3] truncate">{user.name}</p>
              <p className="text-xs text-[#8B949E] truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-[#F85149] hover:bg-[#F85149]/10 px-2 py-1.5 rounded text-sm transition-colors"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
};
