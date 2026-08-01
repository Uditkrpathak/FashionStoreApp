import React from 'react';
import { useGetAdminUsersQuery } from '../../services/adminAuthApi';
import { PieChart } from 'lucide-react';

export const RoleDonutChart = () => {
  const { data: usersData } = useGetAdminUsersQuery({ limit: 100 });
  const users = usersData?.users || [];

  const customerCount = users.filter((u) => u.role === 'user' || !u.role).length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const superAdminCount = users.filter((u) => u.role === 'super_admin').length;
  const total = users.length || 1;

  const customerPct = Math.round((customerCount / total) * 100);
  const adminPct = Math.round((adminCount / total) * 100);
  const superAdminPct = Math.max(0, 100 - customerPct - adminPct);

  // SVG Donut Calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashCustomer = (customerPct / 100) * circumference;
  const strokeDashAdmin = (adminPct / 100) * circumference;

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          User Profile
        </h3>
        <span className="text-xs font-bold text-[#797979] dark:text-[#A0AEC0]">
          {users.length} Registered
        </span>
      </div>

      {/* Donut Chart SVG */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="16"
            fill="transparent"
            className="dark:stroke-[#11121E]"
          />
          {/* Customers (Purple/Brown) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#704F38"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={`${strokeDashCustomer} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
          {/* Admin (Gold/Orange) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#F59E0B"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={`${strokeDashAdmin} ${circumference}`}
            strokeDashoffset={`-${strokeDashCustomer}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>

        {/* Center Percentage */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-black text-[#1F2029] dark:text-white">
            {customerPct}%
          </span>
          <span className="text-[10px] font-extrabold text-[#797979] dark:text-[#A0AEC0] uppercase">
            Customers
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 pt-3 border-t border-[#EDEDED] dark:border-[#262838]">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
            <span className="w-3 h-3 rounded-full bg-[#704F38]" /> Customers
          </span>
          <span className="text-[#1F2029] dark:text-white">{customerPct}%</span>
        </div>
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> Platform Admins
          </span>
          <span className="text-[#1F2029] dark:text-white">{adminPct}%</span>
        </div>
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1]">
            <span className="w-3 h-3 rounded-full bg-[#3B82F6]" /> Super Admin
          </span>
          <span className="text-[#1F2029] dark:text-white">{superAdminPct}%</span>
        </div>
      </div>
    </div>
  );
};
