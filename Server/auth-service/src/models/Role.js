import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  permissions: { type: [String], default: [] },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Role', RoleSchema);
