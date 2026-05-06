import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    brand: { type: String, default: 'Generic' },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.virtual('discountPct').get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
