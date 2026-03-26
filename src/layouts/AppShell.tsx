import { Calendar, Menu, Package, Tag, DollarSign, Users, FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User } from '../features/demo/DemoModule';
import { Sidebar } from '../features/demo/DemoModule';

interface AppShellProps {
  activeView: string;
  children: ReactNode;
  isSidebarOpen: boolean;
  onChangeView: (view: string) => void;
  onCloseSidebar: () => void;
  onLogout: () => void;
  onOpenSidebar: () => void;
  user: User;
}

export const AppShell = ({
  activeView,
  children,
  isSidebarOpen,
  onChangeView,
  onCloseSidebar,
  onLogout,
  onOpenSidebar,
  user,
}: AppShellProps) => (
  <div className="flex h-screen bg-[#0D1117] text-[#E6EDF3] font-sans overflow-hidden">
    <div className="hidden lg:block">
      <Sidebar
        activeView={activeView}
        onChangeView={onChangeView}
        user={user}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={onCloseSidebar}
      />
    </div>

    <main className="flex-1 h-full flex flex-col overflow-hidden relative">
      {/* Top Bar - Mobile Only */}
      <div className="lg:hidden p-4 border-b border-[#30363D] flex items-center justify-between bg-[#161B22] shrink-0 z-40">
        <div className="flex items-center gap-2">
           <img src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png" alt="Logo" className="h-8 w-auto object-contain" />
           <span className="font-display font-black text-sm text-[#E6EDF3] tracking-tighter uppercase italic">Vicenzo</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0D1117] border border-[#C8A951]/30 flex items-center justify-center text-[#C8A951] font-black text-xs">
            {user.name[0]}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#161B22]/90 backdrop-blur-xl border border-[#30363D] rounded-3xl z-50 flex items-center justify-around px-4 shadow-2xl overflow-hidden shadow-[#000]/50">
        {user.role === 'INVITADO' || user.role === 'CLIENTE' || user.role === 'CONTROL' ? (
          <>
            {[
              { id: 'GUESTS', icon: Users, label: 'Invitados' },
              ...(user.role === 'CONTROL' ? [] : [{ id: 'PLANILLA', icon: FileText, label: 'Planilla' }]),
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-[#C8A951] scale-110' : 'text-[#8B949E] opacity-50'}`}
              >
                <item.icon size={20} className={activeView === item.id ? "stroke-[3px]" : "stroke-[2px]"} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
          </>
        ) : (
          <>
            {[
              { id: 'AGENDA', icon: Calendar, label: 'Agenda' },
              { id: 'EVENTOS', icon: Tag, label: 'Eventos' },
              { id: 'PAGOS', icon: DollarSign, label: 'Pagos' },
              { id: 'GASTOS', icon: Package, label: 'Gastos' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${activeView === item.id ? 'text-[#C8A951] scale-110' : 'text-[#8B949E] opacity-50'}`}
              >
                <item.icon size={20} className={activeView === item.id ? "stroke-[3px]" : "stroke-[2px]"} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              </button>
            ))}
          </>
        )}
        <button 
          onClick={() => onChangeView('MORE')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'MORE' ? 'text-[#C8A951] scale-110' : 'text-[#8B949E] opacity-50'}`}
        >
          <Menu size={20} className={activeView === 'MORE' ? "stroke-[3px]" : "stroke-[2px]"} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Más</span>
        </button>
      </div>
    </main>
  </div>
);
