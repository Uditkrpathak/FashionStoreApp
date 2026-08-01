import React from 'react';
import { useGetAdminUsersQuery } from '../../services/adminAuthApi';
import { Users, Shield, UserCheck, ArrowRight } from 'lucide-react';

export const UserShowcaseWidget = ({ onNavigateToUsers }) => {
  const { data: usersData, isLoading } = useGetAdminUsersQuery({ page: 1, limit: 5 });

  const users = usersData?.users || [];
  const totalUsers = usersData?.pagination?.total || users.length;

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-2xl border border-[#EDEDED] dark:border-[#262838] shadow-sm flex flex-col justify-between transition-colors duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#3B82F6] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
                Platform Users
              </h3>
              <p className="text-xs text-[#797979] dark:text-[#A0AEC0] font-medium">
                {totalUsers} registered accounts
              </p>
            </div>
          </div>

          {onNavigateToUsers && (
            <button
              onClick={() => onNavigateToUsers('users')}
              className="text-xs font-black text-[#704F38] dark:text-[#E8B84E] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Real Users List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              Loading user registry...
            </div>
          ) : users.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
              No registered users found.
            </div>
          ) : (
            users.map((user) => {
              const isSuperAdmin = user.role === 'super_admin';
              const isAdmin = user.role === 'admin';
              const isBlocked = user.status === 'blocked';

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#26283A] hover:border-[#704F38]/30 dark:hover:border-[#E8B84E]/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white uppercase flex-shrink-0 shadow-sm ${
                        isSuperAdmin
                          ? 'bg-[#E8B84E] text-[#1F2029]'
                          : isAdmin
                          ? 'bg-[#704F38]'
                          : 'bg-[#3B82F6]'
                      }`}
                    >
                      {(user.name || user.email || 'U').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#1F2029] dark:text-white truncate">
                        {user.name || 'Anonymous Customer'}
                      </div>
                      <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] truncate font-medium">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isSuperAdmin
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : isAdmin
                          ? 'bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]'
                          : 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                      }`}
                    >
                      {(user.role || 'user').replace('_', ' ')}
                    </span>

                    {isBlocked ? (
                      <span className="w-2 h-2 rounded-full bg-[#E57373]" title="Blocked Account" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#4CAF50]" title="Active Account" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
