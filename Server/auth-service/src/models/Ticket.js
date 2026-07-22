import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, default: 'open', enum: ['open', 'in_progress', 'resolved', 'closed'] },
  priority: { type: String, default: 'medium', enum: ['low', 'medium', 'high', 'critical'] },
  messages: [{
    sender: { type: String, required: true }, // 'customer' or 'admin'
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Ticket', TicketSchema);
