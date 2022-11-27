import mongoose from 'mongoose';
import { IProductDocument } from '../interface/product';

const ProductSchema: mongoose.Schema<IProductDocument> =
  new mongoose.Schema<IProductDocument>({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  });

const ProductModel = mongoose.model<IProductDocument>('Product', ProductSchema);

export default ProductModel;
