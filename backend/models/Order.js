import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: String,
      line1: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      phone: String,
    },
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    subTotal: Number,
    tax: Number,
    shippingFee: Number,
    grandTotal: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
