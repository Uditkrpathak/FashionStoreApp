import React, { memo } from 'react';
import { Star, MoreHorizontal, Mail, Phone, MessageSquare, Activity, Shield, UserCheck, UserX } from 'lucide-react';

export const UserCard = memo(({
  user,
  isStarred,
  onToggleStar,
  onOpenDetail,
  onOpenRoleModal,
  onOpenStatusModal
}) => {
  const isBlocked = user.status === 'blocked';

  return (
    <div className="bg-white dark:bg-[#181926] p-6 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center relative flex flex-col items-center justify-between group">
      {/* Top Bar: Star & Dropdown Options */}
      <div className="w-full flex items-center justify-between mb-2">
        <button
          onClick={() => onToggleStar(user._id)}
          className={`p-1.5 rounded-xl transition-colors ${
            isStarred
              ? 'text-[#E8B84E]'
              : 'text-[#CBD5E1] dark:text-[#475569] hover:text-[#E8B84E]'
          }`}
          title={isStarred ? 'Unstar User' : 'Star User'}
        >
          <Star className="w-4 h-4 fill-current" />
        </button>

        <div className="relative group/menu">
          <button className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#1F2029] dark:hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <div className="absolute right-0 top-7 w-44 bg-white dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-2xl shadow-xl py-2 hidden group-hover/menu:block z-30">
            <button
              onClick={() => onOpenDetail(user)}
              className="w-full px-4 py-2 text-left text-xs font-extrabold text-[#1F2029] dark:text-white hover:bg-[#FDFBF9] dark:hover:bg-[#1C1D2C] flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5" /> View Profile
            </button>
            <button
              onClick={() => onOpenRoleModal(user)}
              className="w-full px-4 py-2 text-left text-xs font-extrabold text-[#3B82F6] hover:bg-[#FDFBF9] dark:hover:bg-[#1C1D2C] flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" /> Edit Role
            </button>
            <button
              onClick={() => onOpenStatusModal(user)}
              className={`w-full px-4 py-2 text-left text-xs font-extrabold flex items-center gap-2 ${
                isBlocked ? 'text-[#4CAF50]' : 'text-[#E57373]'
              } hover:bg-[#FDFBF9] dark:hover:bg-[#1C1D2C]`}
            >
              {isBlocked ? (
                <><UserCheck className="w-3.5 h-3.5" /> Unblock</>
              ) : (
                <><UserX className="w-3.5 h-3.5" /> Block Account</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Large Avatar with Status Dot */}
      <div className="relative my-2">
        <div className="w-20 h-20 rounded-2xl bg-[#F8FAFC] dark:bg-[#11121E] border border-[#E2E8F0] dark:border-[#2A2C3F] shadow-inner flex items-center justify-center text-2xl font-black text-[#704F38] dark:text-[#E8B84E] overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User Avatar'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            (user.name || user.email || 'U').charAt(0).toUpperCase()
          )}
        </div>
        <span
          className={`w-4 h-4 rounded-full border-2 border-white dark:border-[#181926] absolute -bottom-1 -right-1 shadow-sm ${
            isBlocked ? 'bg-[#EF4444]' : 'bg-[#10B981]'
          }`}
          title={isBlocked ? 'Blocked Account' : 'Active Account'}
        />
      </div>

      {/* User Details */}
      <div className="w-full mb-4 px-2">
        <h4 className="text-base font-black text-[#1F2029] dark:text-white truncate">
          {user.name || 'Anonymous User'}
        </h4>
        <p className="text-xs font-extrabold text-[#797979] dark:text-[#A0AEC0] mt-0.5 uppercase tracking-wider truncate">
          {(user.role || 'user').replace('_', ' ')}
        </p>
      </div>

      {/* 3 Circular Action Buttons (Figma Style) */}
      <div className="flex items-center justify-center gap-3 w-full pt-4 border-t border-[#EDEDED] dark:border-[#262838]">
        <a
          href={`mailto:${user.email}`}
          title={`Send Email to ${user.email}`}
          className="w-10 h-10 rounded-2xl bg-[#F1F5F9] dark:bg-[#11121E] hover:bg-[#704F38] dark:hover:bg-[#E8B84E] text-[#475569] dark:text-[#94A3B8] hover:text-white dark:hover:text-[#1F2029] flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <Mail className="w-4 h-4" />
        </a>
        <button
          onClick={() => alert(`Phone: ${user.phone || 'No phone number linked'}`)}
          title="View Contact Phone"
          className="w-10 h-10 rounded-2xl bg-[#F1F5F9] dark:bg-[#11121E] hover:bg-[#704F38] dark:hover:bg-[#E8B84E] text-[#475569] dark:text-[#94A3B8] hover:text-white dark:hover:text-[#1F2029] flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          onClick={() => onOpenDetail(user)}
          title="View User Details"
          className="w-10 h-10 rounded-2xl bg-[#F1F5F9] dark:bg-[#11121E] hover:bg-[#704F38] dark:hover:bg-[#E8B84E] text-[#475569] dark:text-[#94A3B8] hover:text-white dark:hover:text-[#1F2029] flex items-center justify-center transition-all duration-200 shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
