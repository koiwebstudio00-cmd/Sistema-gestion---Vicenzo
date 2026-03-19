import { Menu } from 'lucide-react';
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
  <div className="flex min-h-screen bg-[#0D1117] text-[#E6EDF3] font-sans">
    <Sidebar
      activeView={activeView}
      onChangeView={onChangeView}
      user={user}
      onLogout={onLogout}
      isOpen={isSidebarOpen}
      onClose={onCloseSidebar}
    />
    <main className="flex-1 h-screen overflow-hidden flex flex-col">
      <div className="lg:hidden p-4 border-b border-[#30363D] flex items-center justify-between bg-[#0D1117] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="text-[#E6EDF3] p-1 hover:bg-[#161B22] rounded-lg">
            <Menu size={24} />
          </button>
          <span className="font-display font-bold text-lg text-[#E6EDF3]">Vicenzo</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#161B22] border border-[#30363D] flex items-center justify-center text-[#C8A951] font-bold text-sm">
          {user.name[0]}
        </div>
      </div>

      <div className="flex-1 overflow-auto">{children}</div>
    </main>
  </div>
);
