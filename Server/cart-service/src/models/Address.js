import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  label: String,
  line1: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
});

export default mongoose.model('Address', AddressSchema);
