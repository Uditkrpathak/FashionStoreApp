import React from 'react';
import { useGetAdminUsersQuery } from '../../services/adminAuthApi';
import { Users, ArrowRight } from 'lucide-react';

export const FigmaContactsWidget = ({ onNavigateToUsers }) => {
  const { data: usersData, isLoading } = useGetAdminUsersQuery({ limit: 8 });
  const users = usersData?.users || [];

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#704F38] dark:text-[#E8B84E]" />
          <h3 className="text-sm font-black text-[#1F2029] dark:text-white uppercase tracking-wider">
            Contacts
          </h3>
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

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
          Loading registered accounts...
        </div>
      ) : users.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#797979] dark:text-[#A0AEC0]">
          No registered contacts yet.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {users.slice(0, 8).map((usr) => {
            const isBlocked = usr.status === 'blocked';
            const nameFirst = (usr.name || usr.email || 'U').charAt(0).toUpperCase();

            return (
              <div
                key={usr._id}
                className="flex flex-col items-center text-center group cursor-pointer"
                title={`${usr.name || 'User'} (${usr.email})`}
                onClick={() => onNavigateToUsers && onNavigateToUsers('users')}
              >
                {/* User Image / Avatar Box */}
                <div className="relative w-12 h-12 mb-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] dark:bg-[#11121E] border border-[#E2E8F0] dark:border-[#2A2C3F] shadow-sm flex items-center justify-center font-black text-sm text-[#704F38] dark:text-[#E8B84E] overflow-hidden group-hover:scale-105 transition-transform duration-200">
                    {usr.avatar ? (
                      <img
                        src={usr.avatar}
                        alt={usr.name || 'Avatar'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      nameFirst
                    )}
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#181926] absolute -bottom-0.5 -right-0.5 shadow-sm ${
                      isBlocked ? 'bg-[#EF4444]' : 'bg-[#10B981]'
                    }`}
                  />
                </div>

                <span className="text-[11px] font-black text-[#1F2029] dark:text-white truncate max-w-full">
                  {usr.name ? usr.name.split(' ')[0] : 'User'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
