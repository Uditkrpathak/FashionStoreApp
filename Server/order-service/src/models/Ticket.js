import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, default: 'Customer' },
  userEmail: { type: String, default: '' },
  orderId: String,
  subject: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['order', 'refund', 'product', 'delivery', 'return', 'exchange', 'general', 'order issue'], 
    default: 'general' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent', 'normal'], 
    default: 'medium' 
  },
  status: { type: String, enum: ['open', 'in_progress', 'escalated', 'resolved', 'closed'], default: 'open' },
  messages: [{
    senderId: String,
    senderName: String,
    role: { type: String, enum: ['user', 'support', 'admin', 'system'], default: 'user' },
    message: String,
    attachments: [String],
    isInternalNote: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  slaDeadline: Date,
  escalatedAt: Date,
  escalatedReason: String,
  resolutionNotes: String,
  closedAt: Date
}, { timestamps: true });

TicketSchema.pre('save', function() {
  if (this.isNew && !this.slaDeadline) {
    // Priority-based SLA calculation
    const hours = this.priority === 'urgent' ? 4 : this.priority === 'high' ? 12 : this.priority === 'medium' ? 24 : 48;
    this.slaDeadline = new Date(Date.now() + hours * 60 * 60 * 1000);
  }
});

export default mongoose.model('Ticket', TicketSchema);
