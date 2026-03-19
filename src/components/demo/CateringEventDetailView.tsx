import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, Calendar, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, DollarSign, Edit2, FileText, Filter, Mail, MapPin, Package, Phone, Plus, Printer, Scale, Search, Tag, Trash2, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { CATALOG_DATA, EVENTS_DATA, PACK_PREMIUM_ITEMS, USERS, formatCurrency, type EventStatus, type ServiceItem, type User } from "../../features/demo/demoShared";
import { Modal } from "../ui/Modal";


export const CateringEventDetailView = ({ eventData }: { eventData: any }) => {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-display font-bold text-[#E6EDF3] mb-4">{eventData.title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#8B949E]">
            <Calendar size={16} />
            <span>{eventData.date}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8B949E]">
            <Clock size={16} />
            <span>{eventData.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8B949E]">
            <MapPin size={16} />
            <span>{eventData.salon}</span>
          </div>
        </div>

        <div className="bg-[#0D1117] rounded-lg p-4 border border-[#30363D]">
          <h3 className="text-[#C8A951] font-medium mb-3">Cantidades</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Invitados (Total):</span>
              <span className="text-[#E6EDF3] font-bold">{eventData.guests.confirmed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B949E]">Mozos:</span>
              <span className="text-[#E6EDF3] font-bold">8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6 p-4 bg-[#0D1117] rounded-lg border border-[#30363D]/50">
        <div>
          <h3 className="text-[#8B949E] text-xs font-bold uppercase tracking-wider mb-2">Contacto del Cliente</h3>
          <div className="space-y-1">
            <div className="text-[#E6EDF3] font-medium flex items-center gap-2">
              <Users size={14} className="text-[#C8A951]" /> {eventData.clientName || 'No especificado'}
            </div>
            <div className="text-[#E6EDF3] font-mono flex items-center gap-2">
              <Phone size={14} className="text-[#C8A951]" /> {eventData.clientPhone || 'No especificado'}
            </div>
          </div>
        </div>
      </div>
      
      {eventData.cateringObservations && eventData.cateringObservations.length > 0 && (
        <div className="mt-2 pt-6 border-t border-[#30363D]">
          <h3 className="text-[#C8A951] font-display font-bold uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <FileText size={14} /> Observaciones para Catering
          </h3>
          <div className="bg-[#0D1117] rounded-xl p-4 border border-[#30363D]/50 text-sm">
            <ul className="space-y-3">
              {eventData.cateringObservations.map((obs: string, i: number) => (
                <li key={i} className="flex gap-3 text-[#E6EDF3] leading-relaxed">
                  <span className="text-[#C8A951] shrink-0 mt-1">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

