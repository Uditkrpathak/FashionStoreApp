import React, { useState, useEffect } from 'react';
import { 
  useGetTicketsQuery, 
  useReplyTicketMutation, 
  useEscalateTicketMutation, 
  useCloseTicketMutation 
} from '../services/adminOrderApi';
import { useGetAdminUsersQuery } from '../services/adminAuthApi';
import { Search, MessageSquare, AlertTriangle, CheckCircle2, Clock, Send, ShieldAlert, X } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const TicketManagementPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedTicket(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data, isLoading, refetch } = useGetTicketsQuery({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    search: search || undefined,
  });

  const { data: usersData } = useGetAdminUsersQuery({ limit: 100 });
  const registeredUsers = usersData?.users || [];

  const [replyTicket, { isLoading: isReplying }] = useReplyTicketMutation();
  const [escalateTicket, { isLoading: isEscalating }] = useEscalateTicketMutation();
  const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation();

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyMsg.trim()) return;
    try {
      const res = await replyTicket({
        id: selectedTicket._id,
        message: replyMsg.trim(),
        isInternalNote: isInternal
      }).unwrap();
      setReplyMsg('');
      setSelectedTicket(res.ticket);
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to send reply');
    }
  };

  const handleEscalateClick = async () => {
    if (!selectedTicket) return;
    if (confirm('Escalate this ticket to Super Admin review?')) {
      try {
        const res = await escalateTicket({ id: selectedTicket._id, reason: 'High priority SLA escalation' }).unwrap();
        setSelectedTicket(res.ticket);
        refetch();
      } catch (err) {
        alert('Failed to escalate ticket');
      }
    }
  };

  const handleCloseClick = async () => {
    if (!selectedTicket) return;
    const notes = prompt('Enter resolution notes for closing ticket:', 'Issue resolved with customer satisfaction.');
    if (notes !== null) {
      try {
        const res = await closeTicket({ id: selectedTicket._id, resolutionNotes: notes }).unwrap();
        setSelectedTicket(res.ticket);
        refetch();
      } catch (err) {
        alert('Failed to close ticket');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-[#181926] p-4 rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm items-center transition-colors">
        <div className="w-full sm:w-72 flex items-center bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-2xl px-3.5 focus-within:border-[#704F38] dark:focus-within:border-[#E8B84E]">
          <Search className="w-4 h-4 text-[#797979] dark:text-[#A0AEC0] mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Tickets by # or Subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-xs font-bold text-[#1F2029] dark:text-white placeholder-[#797979] dark:placeholder-[#A0AEC0]"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#797979] dark:text-[#A0AEC0] ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto py-1">
          {['', 'open', 'in_progress', 'escalated', 'closed'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-[#704F38] text-white shadow-md'
                  : 'bg-[#FDFBF9] dark:bg-[#11121E] text-[#797979] dark:text-[#A0AEC0] border border-[#EDEDED] dark:border-[#2A2C3F] hover:text-[#1F2029] dark:hover:text-white'
              }`}
            >
              {s ? s.toUpperCase().replace('_', ' ') : 'ALL STATUS'}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-[#181926] rounded-3xl border border-[#EDEDED] dark:border-[#262838] shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#FDFBF9] dark:bg-[#11121E] border-b border-[#EDEDED] dark:border-[#262838] text-[#797979] dark:text-[#A0AEC0] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Ticket #</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">SLA Status</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED] dark:divide-[#262838]">
              {isLoading ? (
                <tr><td colSpan="7"><Loader message="Loading Support Tickets..." /></td></tr>
              ) : data?.tickets?.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979] dark:text-[#A0AEC0] font-bold">No support tickets found.</td></tr>
              ) : (
                data?.tickets?.map((ticket) => {
                  const custEmail = (ticket.userEmail || '').toLowerCase();
                  const custName = ticket.userName || 'Customer';
                  const custFirstChar = custName.charAt(0).toUpperCase();

                  const matchingUser = registeredUsers.find(
                    (u) => u._id === ticket.userId ||
                           (u.email && u.email.toLowerCase() === custEmail) ||
                           (u.name && u.name.toLowerCase() === custName.toLowerCase())
                  );

                  const custAvatar = matchingUser?.avatar;

                  return (
                    <tr key={ticket._id} className="hover:bg-[#FDFBF9]/50 dark:hover:bg-[#1C1D2C] transition-colors">
                      <td className="px-5 py-4 font-mono font-black text-xs text-[#704F38] dark:text-[#E8B84E] select-all whitespace-nowrap">
                        #{ticket.ticketNumber || ('TKT-' + ticket._id.slice(-6).toUpperCase())}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-[#1F2029] dark:text-white">
                        <div>{ticket.subject}</div>
                        {ticket.orderId && (
                          <div className="text-[10px] text-[#704F38] dark:text-[#E8B84E] font-mono mt-0.5 select-all">
                            Order: #ORD-{ticket.orderId.slice(-6).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-[#F8FAFC] dark:bg-[#11121E] border border-[#E2E8F0] dark:border-[#2A2C3F] flex items-center justify-center font-black text-xs text-[#704F38] dark:text-[#E8B84E] shadow-sm flex-shrink-0 overflow-hidden">
                            {custAvatar ? (
                              <img
                                src={custAvatar}
                                alt={custName}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              custFirstChar
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-[#1F2029] dark:text-white text-xs">{custName}</div>
                            <div className="text-[10px] text-[#797979] dark:text-[#A0AEC0] font-medium">{ticket.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          ticket.priority === 'urgent' ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border border-[#FECACA] dark:border-[#7F1D1D]/50' :
                          ticket.priority === 'high' ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#B45309]/50' : 'bg-gray-100 dark:bg-[#11121E] text-gray-700 dark:text-[#A0AEC0] border border-gray-200 dark:border-[#2A2C3F]'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                          ticket.slaStatus === 'Breached' ? 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]/50 animate-pulse' :
                          ticket.slaStatus === 'At Risk' ? 'bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#B45309]/50' :
                          'bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border-[#A7F3D0] dark:border-[#064E3B]/50'
                        }`}>
                          {ticket.slaStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] text-[#1F2029] dark:text-white">
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3.5 py-1.5 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl text-xs font-black shadow-md shadow-[#704F38]/20 transition-all"
                        >
                          Open Thread
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#181926] rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl border border-[#EDEDED] dark:border-[#262838] transition-colors">
            <div>
              <div className="flex justify-between items-center border-b border-[#EDEDED] dark:border-[#262838] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#1F2029] dark:text-white">{selectedTicket.ticketNumber} • {selectedTicket.subject}</h3>
                    <span className="bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] text-[10px] font-black px-2 py-0.5 rounded-lg border border-[#FDE68A] dark:border-[#B45309]/50">
                      SLA: {selectedTicket.slaStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#797979] dark:text-[#A0AEC0] mt-0.5">Customer: {selectedTicket.userName} ({selectedTicket.userEmail})</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-[#797979] dark:text-[#A0AEC0] hover:text-[#1F2029] dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleEscalateClick}
                  disabled={isEscalating || selectedTicket.status === 'escalated'}
                  className="px-3.5 py-1.5 bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#B45309]/50 hover:bg-[#FDE68A] rounded-xl text-xs font-black flex items-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Escalate to Admin
                </button>
                <button
                  onClick={handleCloseClick}
                  disabled={isClosing || selectedTicket.status === 'closed'}
                  className="px-3.5 py-1.5 bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#047857] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#064E3B]/50 hover:bg-[#A7F3D0] rounded-xl text-xs font-black flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Close Ticket
                </button>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#FDFBF9] dark:bg-[#11121E] rounded-2xl border border-[#EDEDED] dark:border-[#2A2C3F] mb-4">
                {selectedTicket.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                      msg.isInternalNote ? 'bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-[#1F2029] dark:text-white ml-auto' :
                      msg.role === 'user' ? 'bg-white dark:bg-[#181926] border border-[#EDEDED] dark:border-[#262838] text-[#1F2029] dark:text-white mr-auto' :
                      'bg-[#704F38] text-white ml-auto'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 gap-4">
                      <span className="font-extrabold">{msg.senderName} ({msg.role.toUpperCase()})</span>
                      <span className="text-[10px] opacity-75">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {msg.isInternalNote && <div className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-300 mb-1">[INTERNAL NOTE]</div>}
                    <p className="font-medium">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Form */}
            {selectedTicket.status !== 'closed' && (
              <form onSubmit={handleSendReply} className="space-y-3 border-t border-[#EDEDED] dark:border-[#262838] pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="internalNote"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="accent-[#704F38]"
                  />
                  <label htmlFor="internalNote" className="text-xs font-bold text-[#797979] dark:text-[#A0AEC0]">Post as internal note (hidden from customer)</label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type your reply or internal notes..."
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#FDFBF9] dark:bg-[#11121E] border border-[#EDEDED] dark:border-[#2A2C3F] rounded-xl text-xs font-medium text-[#1F2029] dark:text-white outline-none focus:border-[#704F38] dark:focus:border-[#E8B84E]"
                  />
                  <button
                    type="submit"
                    disabled={isReplying}
                    className="px-5 py-2.5 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
