import { BarChart3, ChevronLeft, Clock, FileText, LogOut, Package, Search, Settings } from 'lucide-react';
import { useState } from 'react';
import {
  AgendaView,
  CatalogView,
  CateringEventDetailView,
  CreateEventView,
  EventDetailView,
  EventListView,
  ExpensesView,
  LiquidacionesView,
  PaymentsView,
  ReportsView,
  UsersView,
  GuestListView,
  GestionCobrosView,
  AveriguacionesView,
  type User,
} from '../features/demo/DemoModule';
import { AppShell } from '../layouts/AppShell';
import { DEFAULT_VIEW_BY_ROLE } from '../router/routes';

interface RoleWorkspacePageProps {
  onLogout: () => void;
  user: User;
}

const CATERING_DETAIL_MOCK = {
  title: 'Quinceañera Valentina Suárez',
  date: 'Viernes 07 de marzo de 2025',
  time: '21:00 hs — 04:00 hs',
  salon: 'Vicenzo',
  clientName: 'Familia Suárez',
  clientPhone: '381 456-7890',
  guests: { confirmed: 155 },
  cateringObservations: [
    'Menú sin TACC para 2 invitados adultos.',
    'Torta de quinceañera llega a las 19:00 hs.',
    'Servicio de barra libre desde las 00:00 hs hasta cierre.',
  ],
};

export const RoleWorkspacePage = ({ onLogout, user }: RoleWorkspacePageProps) => {
  const [currentView, setCurrentView] = useState<string>(DEFAULT_VIEW_BY_ROLE[user.role]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedEventId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectEvent = (id: string) => {
    setSelectedEventId(id);
    setCurrentView('FICHA');
  };

  const renderCurrentView = () => {
    if (currentView === 'AGENDA') {
      return <AgendaView onSelectEvent={handleSelectEvent} user={user} />;
    }

    if (currentView === 'AVERIGUACIONES') {
      return <AveriguacionesView user={user} />;
    }

    if (currentView === 'EVENTOS') {
      return (
        <EventListView
          onSelectEvent={handleSelectEvent}
          onCreateEvent={() => handleNavigate('NUEVO_EVENTO')}
          user={user}
        />
      );
    }

    if (currentView === 'NUEVO_EVENTO') {
      return <CreateEventView onBack={() => handleNavigate('EVENTOS')} />;
    }

    if (currentView === 'FICHA') {
      if (user.role === 'CATERING') {
        return (
          <div className="p-4 lg:p-8">
            <button onClick={() => handleNavigate('EVENTOS')} className="text-[#8B949E] hover:text-[#E6EDF3] flex items-center gap-1 mb-6">
              <ChevronLeft size={20} /> Volver
            </button>
            <CateringEventDetailView eventData={CATERING_DETAIL_MOCK} />
          </div>
        );
      }

      return <EventDetailView eventId={selectedEventId} onBack={() => handleNavigate('EVENTOS')} user={user} />;
    }

    if (currentView === 'CATALOGO') {
      return <CatalogView user={user} />;
    }

    if (currentView === 'PAGOS') {
      const isRestricted = ['RECEPCIONISTA', 'MILI', 'ENCARGADO', 'PRODUCCION', 'TIO_FRANCO', 'CATERING'].includes(user.role);
      if (isRestricted) return <AgendaView onSelectEvent={handleSelectEvent} user={user} />;
      return <PaymentsView onSelectEvent={handleSelectEvent} user={user} />;
    }

    if (currentView === 'REPORTES') {
      return <ReportsView />;
    }

    if (currentView === 'GASTOS') {
      return <ExpensesView />;
    }

    if (currentView === 'LIQUIDACIONES') {
      return <LiquidacionesView user={user} />;
    }

    if (currentView === 'GUESTS') {
      return <GuestListView user={user} />;
    }

    if (currentView === 'COBROS') {
      return <GestionCobrosView user={user} />;
    }

    if (currentView === 'PLANILLA') {
      return (
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#C8A951]/10 rounded-2xl text-[#C8A951]">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Planilla Operativa</h1>
                <p className="text-xs text-[#8B949E] uppercase tracking-widest">Detalles logísticos del evento</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    { label: 'Evento', value: '15 de Valentina Suárez' },
                    { label: 'Fecha', value: 'Viernes 07 de marzo de 2025' },
                    { label: 'Ubicación', value: 'Salón Vicenzo (Principal)' },
                    { label: 'Apertura de Puertas', value: '21:00 hs' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between border-b border-[#30363D]/50 pb-2">
                      <span className="text-[#8B949E] text-xs uppercase tracking-wider">{item.label}</span>
                      <span className="font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#C8A951]/5 border border-[#C8A951]/20 rounded-2xl">
                 <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-[#C8A951] mb-3">
                   <span>📝</span> Observaciones Importantes
                 </h4>
                 <p className="text-sm text-[#8B949E] leading-relaxed italic">
                   "El plato principal se servirá a las 23:30 hs. El grupo de baile tiene acceso a las 20:00 hs para prueba. Recordar la mesa de dulces sin TACC."
                 </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'CONFIGURACION') {
      return <UsersView currentUser={user} />;
    }

    if (currentView === 'MORE') {
      const menuItems = [
        { id: 'CATALOGO', label: 'Presupuesto', icon: Package, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING', 'ENCARGADO'] },
        { id: 'AVERIGUACIONES', label: 'Averiguaciones', icon: Search, roleSpecific: ['JEFE', 'RECEPCIONISTA', 'MILI', 'GUILLERMINA'] },
        { id: 'LIQUIDACIONES', label: 'Liquidaciones', icon: FileText, restricted: ['PRODUCCION', 'TIO_FRANCO', 'RECEPCIONISTA', 'MILI', 'ENCARGADO'] },
        { id: 'REPORTES', label: 'Reportes', icon: BarChart3, restricted: ['PRODUCCION', 'TIO_FRANCO', 'CATERING', 'INVITADO', 'RECEPCIONISTA', 'MILI', 'ENCARGADO'] },
        { id: 'CONFIGURACION', label: 'Configuración', icon: Settings },
      ];

      const filteredItems = menuItems.filter(item => {
        if (user.role === 'INVITADO') return false;
        if (user.role === 'CATERING') return ['LIQUIDACIONES'].includes(item.id);
        return !item.restricted || !item.restricted.includes(user.role);
      });

      return (
        <div className="p-4 lg:p-8 min-h-screen bg-[#0D1117] animate-in fade-in zoom-in-95">
          <header className="mb-10 text-center">
             <div className="w-20 h-20 bg-[#C8A951]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#C8A951]/20">
               <img src="https://i.postimg.cc/fTXLSgfS/images-removebg-preview.png" alt="Vicenzo" className="h-12 w-auto" />
             </div>
             <h1 className="text-2xl font-display font-black text-[#E6EDF3] tracking-tighter">Más Opciones</h1>
             <p className="text-[#8B949E] text-xs font-black uppercase tracking-widest mt-1">Gestión avanzada del salón</p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className="bg-[#161B22] border border-[#30363D] rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-xl hover:border-[#C8A951]/30"
              >
                <div className="w-12 h-12 bg-[#0D1117] border border-[#30363D] rounded-2xl flex items-center justify-center text-[#C8A951]">
                  <item.icon size={24} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#E6EDF3] text-center">{item.label}</span>
              </button>
            ))}
            <button
               onClick={onLogout}
               className="col-span-2 bg-[#F85149]/10 border border-[#F85149]/20 rounded-3xl p-5 flex items-center justify-center gap-3 mt-4 text-[#F85149] font-black uppercase tracking-widest text-[11px] active:scale-95 transition-all"
            >
               <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>

          <div className="mt-12 text-center opacity-30">
             <p className="text-[9px] font-black text-[#8B949E] uppercase tracking-[0.3em]">Vicenzo — v2.0.0-Mobile</p>
          </div>
        </div>
      );
    }

    return <AgendaView onSelectEvent={handleSelectEvent} user={user} />;
  };

  return (
    <AppShell
      activeView={currentView}
      isSidebarOpen={isSidebarOpen}
      onChangeView={handleNavigate}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      onLogout={onLogout}
      onOpenSidebar={() => setIsSidebarOpen(true)}
      user={user}
    >
      {renderCurrentView()}
    </AppShell>
  );
};
