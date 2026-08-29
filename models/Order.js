import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customer: {
    name: { type: String },
    email: { type: String }
  },
  items: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
      weight: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: 'Order Placed' },
  date: { type: Number, required: true, default: Date.now }
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
