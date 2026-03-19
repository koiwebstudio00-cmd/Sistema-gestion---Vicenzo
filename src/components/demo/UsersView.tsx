import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const UsersView = ({ currentUser }: { currentUser: User }) => {
  const isJefe = currentUser.role === 'JEFE';

  return (
    <div className="p-4 lg:p-8 h-full flex flex-col overflow-y-auto">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 lg:gap-0">
        <h1 className="text-2xl font-display font-bold text-[#E6EDF3]">Gestión de Usuarios</h1>
        {isJefe ? (
          <button className="bg-[#C8A951] text-[#0D1117] px-4 py-2 rounded-lg font-bold hover:bg-[#D4B96A] transition-colors flex items-center gap-2">
            <Plus size={18} /> Agregar usuario
          </button>
        ) : (
          <button
            disabled
            title="Solo Franco u Orlando pueden gestionar usuarios"
            className="bg-[#30363D] text-[#8B949E] px-4 py-2 rounded-lg font-bold cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} /> Agregar usuario
          </button>
        )}
      </div>

      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#30363D] text-[#8B949E] text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Usuario</th>
                <th className="p-4 font-medium">Rol</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30363D]">
              {USERS.map(u => (
                <tr key={u.id} className="hover:bg-[#C8A951]/5 transition-colors group">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#30363D] flex items-center justify-center text-[#C8A951] font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span className="text-[#E6EDF3] font-medium">{u.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#1F6FEB]/10 text-[#1F6FEB] border border-[#1F6FEB]/20 uppercase">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-[#3FB950] text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" /> Activo
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {isJefe ? (
                      <button className="p-2 text-[#8B949E] hover:text-[#F85149] hover:bg-[#F85149]/10 rounded transition-colors" title="Eliminar usuario">
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <button
                        disabled
                        title="Solo Franco u Orlando pueden gestionar usuarios"
                        className="p-2 text-[#30363D] cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-lg">
        <p className="text-sm text-[#C8A951] flex items-center gap-2">
          <AlertTriangle size={16} />
          <strong>Seguridad:</strong> Solo los roles JEFE (Franco y Orlando) tienen permisos para modificar la nómina de usuarios del sistema.
        </p>
      </div>
    </div>
  );
};

