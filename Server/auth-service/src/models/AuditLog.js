import mongoose from 'mongoose';
import crypto from 'crypto';

const AuditLogSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  actorRole: { type: String, default: 'admin' },
  action: { type: String, required: true },
  targetEntity: { type: String, required: true },
  targetId: String,
  details: Object,
  before: Object,
  after: Object,
  ipAddress: { type: String, default: '127.0.0.1' },
  correlationId: String,
  previousHash: { type: String, default: '0000000000000000000000000000000000000000000000000000000000000000' },
  hash: { type: String }
}, { timestamps: true });

AuditLogSchema.pre('save', async function() {
  if (!this.hash) {
    // Find the latest audit log entry to get its hash
    const AuditLogModel = mongoose.model('AuditLog');
    const lastLog = await AuditLogModel.findOne().sort({ createdAt: -1, _id: -1 });
    if (lastLog && lastLog.hash) {
      this.previousHash = lastLog.hash;
    }
    
    const payload = [
      this.previousHash,
      this.adminId,
      this.action,
      this.targetEntity,
      this.targetId || '',
      JSON.stringify(this.details || {}),
      this.createdAt ? this.createdAt.getTime() : Date.now()
    ].join('|');

    this.hash = crypto.createHash('sha256').update(payload).digest('hex');
  }
});

export default mongoose.model('AuditLog', AuditLogSchema);
