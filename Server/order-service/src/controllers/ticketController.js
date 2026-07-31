import Ticket from '../models/Ticket.js';

export const getAllTickets = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const now = new Date();
    // Annotate each ticket with SLA status
    const ticketsWithSla = tickets.map(t => {
      let slaStatus = 'On Track';
      if (t.status !== 'resolved' && t.status !== 'closed' && t.slaDeadline) {
        const deadline = new Date(t.slaDeadline);
        const diffHours = (deadline - now) / (1000 * 60 * 60);
        if (diffHours < 0) {
          slaStatus = 'Breached';
        } else if (diffHours <= 4) {
          slaStatus = 'At Risk';
        }
      }
      return { ...t, slaStatus };
    });

    const total = await Ticket.countDocuments(query);

    res.json({
      success: true,
      tickets: ticketsWithSla,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id).lean();
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const now = new Date();
    let slaStatus = 'On Track';
    if (ticket.status !== 'resolved' && ticket.status !== 'closed' && ticket.slaDeadline) {
      const deadline = new Date(ticket.slaDeadline);
      const diffHours = (deadline - now) / (1000 * 60 * 60);
      if (diffHours < 0) slaStatus = 'Breached';
      else if (diffHours <= 4) slaStatus = 'At Risk';
    }

    res.json({ success: true, ticket: { ...ticket, slaStatus } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    const userName = req.headers['x-user-name'] || req.body.userName || 'Customer';
    const userEmail = req.headers['x-user-email'] || req.body.userEmail || '';
    const { orderId, subject, category, priority, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    const ticketNumber = `TCK-${Math.floor(100000 + Math.random() * 900000)}`;

    const ticket = new Ticket({
      ticketNumber,
      userId,
      userName,
      userEmail,
      orderId,
      subject,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'open',
      messages: [{
        senderId: userId,
        senderName: userName,
        role: 'user',
        message
      }]
    });

    await ticket.save();
    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const replyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.headers['x-user-id'] || 'support';
    const senderName = req.headers['x-user-name'] || 'Support Agent';
    const senderRole = req.headers['x-user-role'] || 'support';
    const { message, isInternalNote, attachments } = req.body;

    if (!message) return res.status(400).json({ success: false, message: 'Message cannot be empty' });

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    ticket.messages.push({
      senderId,
      senderName,
      role: senderRole,
      message,
      isInternalNote: !!isInternalNote,
      attachments: attachments || []
    });

    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    res.json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const escalateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    ticket.status = 'escalated';
    ticket.escalatedAt = new Date();
    ticket.escalatedReason = reason || 'Escalated for administrative review';

    ticket.messages.push({
      senderId: req.headers['x-user-id'] || 'system',
      senderName: 'System Escalation',
      role: 'system',
      message: `Ticket escalated to Admin Review: ${reason || 'SLA / Urgent Priority Escalation'}`
    });

    await ticket.save();
    res.json({ success: true, message: 'Ticket escalated to Super Admin review', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    ticket.status = 'closed';
    ticket.resolutionNotes = resolutionNotes || 'Issue resolved.';
    ticket.closedAt = new Date();

    ticket.messages.push({
      senderId: req.headers['x-user-id'] || 'system',
      senderName: 'Support Agent',
      role: 'support',
      message: `Ticket Closed. Resolution: ${resolutionNotes || 'Issue resolved.'}`
    });

    await ticket.save();
    res.json({ success: true, message: 'Ticket closed successfully', ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
