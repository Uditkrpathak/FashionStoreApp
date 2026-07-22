import React, { useState } from 'react';
import { useGetTicketsQuery, useReplyToTicketMutation } from '../services/adminAuthApi';
import { MessageSquare, Clock, Send, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { Loader } from '../shared/components/Loader';

export const TicketManagementPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const { data, isLoading, refetch } = useGetTicketsQuery({
    status: filterStatus || undefined,
    priority: filterPriority || undefined
  });

  const [replyToTicket, { isLoading: isReplying }] = useReplyToTicketMutation();

  const tickets = data?.tickets || [];
  const selectedTicket = tickets.find(t => t._id === selectedTicketId) || tickets[0];

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!selectedTicket || (!replyText && !selectedTicket.status)) return;
    try {
      await replyToTicket({
        id: selectedTicket._id,
        text: replyText.trim(),
        status: selectedTicket.status, // preserve or update via separate actions
        priority: selectedTicket.priority
      }).unwrap();
      setReplyText('');
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to send reply');
    }
  };

  const handleStatusChange = async (targetStatus) => {
    if (!selectedTicket) return;
    try {
      await replyToTicket({
        id: selectedTicket._id,
        status: targetStatus,
        priority: selectedTicket.priority
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to update ticket status');
    }
  };

  const handlePriorityChange = async (targetPriority) => {
    if (!selectedTicket) return;
    try {
      await replyToTicket({
        id: selectedTicket._id,
        status: selectedTicket.status,
        priority: targetPriority
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err.data?.message || 'Failed to update ticket priority');
    }
  };

  if (isLoading) {
    return <Loader message="Fetching Customer Support Tickets..." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      {/* Left Column: Tickets Queue */}
      <div className="lg:col-span-5 bg-white rounded-xl border border-[#EDEDED] shadow-sm flex flex-col overflow-hidden">
        {/* Header and Filters */}
        <div className="p-4 border-b border-[#EDEDED] space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1F2029] uppercase tracking-wider">Ticketing Queue</h3>
            <button onClick={() => refetch()} className="p-1.5 hover:bg-[#FDFBF9] border border-[#EDEDED] rounded-lg transition-colors">
              <RefreshCw className="w-3.5 h-3.5 text-[#1F2029]" />
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-[#EDEDED] bg-[#FDFBF9] text-xs font-bold text-[#797979] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex-1 p-2 rounded-lg border border-[#EDEDED] bg-[#FDFBF9] text-xs font-bold text-[#797979] outline-none"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EDEDED]">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-[#797979] text-xs font-bold">
              <MessageSquare className="w-8 h-8 text-[#D4C4B7] mx-auto mb-2" />
              No support tickets found matching filters.
            </div>
          ) : (
            tickets.map((t) => {
              const isActive = selectedTicket?._id === t._id;
              const lastMessage = t.messages?.[t.messages.length - 1];
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTicketId(t._id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isActive ? 'bg-[#FDFBF9] border-l-4 border-l-[#704F38]' : 'hover:bg-[#FDFBF9]/40'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-extrabold text-xs text-[#1F2029] truncate">{t.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase border ${
                      t.priority === 'critical' ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]' :
                      t.priority === 'high' ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' :
                      t.priority === 'medium' ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' :
                      'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <p className="text-xs text-[#797979] font-medium truncate mt-1.5">
                    {lastMessage ? `${lastMessage.sender === 'admin' ? 'You: ' : 'User: '}${lastMessage.text}` : 'No conversation yet'}
                  </p>

                  <div className="flex justify-between items-center mt-3 text-[10px] text-[#9A9AB0] font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      t.status === 'open' ? 'bg-[#FEF2F2] text-[#E57373]' :
                      t.status === 'in_progress' ? 'bg-[#FFFBEB] text-[#B45309]' :
                      t.status === 'resolved' ? 'bg-[#ECFDF5] text-[#047857]' :
                      'bg-[#F3F4F6] text-[#797979]'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Console */}
      <div className="lg:col-span-7 bg-white rounded-xl border border-[#EDEDED] shadow-sm flex flex-col overflow-hidden">
        {selectedTicket ? (
          <>
            {/* Active Ticket Header */}
            <div className="p-4 border-b border-[#EDEDED] flex flex-wrap justify-between items-center gap-3 bg-[#FDFBF9]">
              <div>
                <h4 className="text-sm font-extrabold text-[#1F2029]">{selectedTicket.title}</h4>
                <div className="text-[10px] text-[#797979] font-medium mt-1">Ticket ID: #{selectedTicket._id.slice(-8).toUpperCase()}</div>
              </div>

              <div className="flex gap-2">
                {/* Status selector */}
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="p-1.5 rounded-lg border border-[#EDEDED] bg-white text-xs font-bold text-[#1F2029] outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                {/* Priority selector */}
                <select
                  value={selectedTicket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="p-1.5 rounded-lg border border-[#EDEDED] bg-white text-xs font-bold text-[#1F2029] outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF9]/30">
              {selectedTicket.messages?.map((msg, index) => {
                const isAdmin = msg.sender === 'admin';
                return (
                  <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                      isAdmin 
                        ? 'bg-[#704F38] text-white rounded-tr-none' 
                        : 'bg-[#FDFBF9] border border-[#EDEDED] text-[#1F2029] rounded-tl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <div className={`text-[9px] font-bold mt-1.5 text-right ${isAdmin ? 'text-[#D4C4B7]' : 'text-[#9A9AB0]'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Text Input Panel */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-[#EDEDED] bg-white flex gap-2 items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official reply to customer here..."
                className="flex-1 p-3.5 rounded-xl border border-[#EDEDED] bg-[#FDFBF9] text-xs font-medium outline-none focus:border-[#704F38] text-[#1F2029]"
              />
              <button
                type="submit"
                disabled={isReplying || !replyText.trim()}
                className="p-3.5 bg-[#704F38] hover:bg-[#8C6244] text-white rounded-xl shadow-md transition-all hover:scale-105 flex-shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-[#797979]">
            <ShieldAlert className="w-12 h-12 text-[#D4C4B7] mb-3" />
            <div className="font-extrabold text-sm">No Active Tickets Selected</div>
            <div className="text-xs font-medium mt-1">Select a ticket from the left panel to begin.</div>
          </div>
        )}
      </div>
    </div>
  );
};
