import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceSnapshot: { type: Number, required: true },
    titleSnapshot: { type: String, required: true },
    imageSnapshot: { type: String, default: '' },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.recalc = function () {
  this.totalItems = this.items.reduce((s, i) => s + i.quantity, 0);
  this.totalPrice = +this.items.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0).toFixed(2);
};

export default mongoose.model('Cart', cartSchema);
