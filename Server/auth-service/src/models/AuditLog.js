import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  action: { type: String, required: true },
  targetEntity: { type: String, required: true },
  targetId: String,
  details: Object,
  ipAddress: String
}, { timestamps: true });

export default mongoose.model('AuditLog', AuditLogSchema);
