import React, { useState } from 'react';
import { 
  useGetTicketsQuery, 
  useReplyTicketMutation, 
  useEscalateTicketMutation, 
  useCloseTicketMutation 
} from '../services/adminOrderApi';
import { Search, MessageSquare, AlertTriangle, CheckCircle2, Clock, Send, ShieldAlert, X } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const TicketManagementPage = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const { data, isLoading, refetch } = useGetTicketsQuery({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    search: search || undefined,
  });

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
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#EDEDED] shadow-sm items-center">
        <div className="w-full sm:w-72 flex items-center bg-[#FDFBF9] border border-[#EDEDED] rounded-xl px-3.5">
          <Search className="w-4 h-4 text-[#797979] mr-2" />
          <input
            type="text"
            placeholder="Search Tickets by Ticket # or Subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 bg-transparent border-none outline-none text-sm text-[#1F2029]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['', 'open', 'in_progress', 'escalated', 'closed'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === s ? 'bg-[#704F38] text-white shadow-md' : 'bg-[#FDFBF9] text-[#797979] border border-[#EDEDED]'
              }`}
            >
              {s ? s.toUpperCase().replace('_', ' ') : 'ALL STATUS'}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-[#EDEDED] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#FDFBF9] border-b border-[#EDEDED] text-[#797979] text-[11px] font-extrabold uppercase tracking-wider">
                <th className="px-5 py-4">Ticket #</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">SLA Status</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]">
              {isLoading ? (
                <tr><td colSpan="7"><Loader message="Loading Support Tickets..." /></td></tr>
              ) : data?.tickets?.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-[#797979]">No support tickets found.</td></tr>
              ) : (
                data?.tickets?.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-[#FDFBF9]/50 transition-colors">
                    <td className="px-5 py-4 font-black text-[#1F2029]">{ticket.ticketNumber}</td>
                    <td className="px-5 py-4 font-bold text-[#1F2029]">
                      {ticket.subject}
                      {ticket.orderId && <div className="text-[10px] text-[#797979] font-mono">Order: #{ticket.orderId.slice(-8).toUpperCase()}</div>}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-[#797979]">{ticket.userName} ({ticket.userEmail})</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${
                        ticket.slaStatus === 'Breached' ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] animate-pulse' :
                        ticket.slaStatus === 'At Risk' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' :
                        'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                      }`}>
                        {ticket.slaStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase bg-[#FDFBF9] border border-[#EDEDED] text-[#1F2029]">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1.5 bg-[#704F38] text-white rounded-lg text-xs font-extrabold shadow-sm"
                      >
                        Open Thread
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Conversation Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl border border-[#EDEDED]">
            <div>
              <div className="flex justify-between items-center border-b border-[#EDEDED] pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#1F2029]">{selectedTicket.ticketNumber} • {selectedTicket.subject}</h3>
                    <span className="bg-[#FFFBEB] text-[#B45309] text-[10px] font-black px-2 py-0.5 rounded border border-[#FDE68A]">
                      SLA: {selectedTicket.slaStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#797979] mt-0.5">Customer: {selectedTicket.userName} ({selectedTicket.userEmail})</p>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-[#797979] hover:text-[#1F2029]"><X className="w-5 h-5" /></button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleEscalateClick}
                  disabled={isEscalating || selectedTicket.status === 'escalated'}
                  className="px-3 py-1.5 bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Escalate to Admin
                </button>
                <button
                  onClick={handleCloseClick}
                  disabled={isClosing || selectedTicket.status === 'closed'}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Close Ticket
                </button>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto p-3 bg-[#FDFBF9] rounded-xl border border-[#EDEDED] mb-4">
                {selectedTicket.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl text-xs max-w-[85%] ${
                      msg.isInternalNote ? 'bg-amber-50 border border-amber-200 ml-auto' :
                      msg.role === 'user' ? 'bg-white border border-[#EDEDED] mr-auto' :
                      'bg-[#704F38] text-white ml-auto'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 gap-4">
                      <span className="font-extrabold">{msg.senderName} ({msg.role.toUpperCase()})</span>
                      <span className="text-[10px] opacity-75">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                    {msg.isInternalNote && <div className="text-[9px] font-black uppercase text-amber-700 mb-1">[INTERNAL NOTE]</div>}
                    <p className="font-medium">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Form */}
            {selectedTicket.status !== 'closed' && (
              <form onSubmit={handleSendReply} className="space-y-3 border-t border-[#EDEDED] pt-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="internalNote"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="accent-[#704F38]"
                  />
                  <label htmlFor="internalNote" className="text-xs font-bold text-[#797979]">Post as internal note (hidden from customer)</label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Type your reply or internal notes..."
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-[#FDFBF9] border border-[#EDEDED] rounded-xl text-xs font-medium outline-none focus:border-[#704F38]"
                  />
                  <button
                    type="submit"
                    disabled={isReplying}
                    className="px-5 py-2.5 bg-[#704F38] text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5"
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
