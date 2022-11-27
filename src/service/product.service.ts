import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { IProductDocument } from '../interface/product';
import ProductModel from '../model/product.model';

export async function createProduct(
  input: DocumentDefinition<Omit<IProductDocument, 'createdAt' | 'updatedAt'>>
) {
  return await ProductModel.create(input);
}

export async function findProduct(
  query: FilterQuery<IProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return await ProductModel.findOne(query, {}, options);
}

export async function findAndUpdateProduct(
  query: FilterQuery<IProductDocument>,
  update: UpdateQuery<IProductDocument>,
  options: QueryOptions = { lean: true }
) {
  return await ProductModel.findOneAndUpdate(query, update, options);
}

export async function deleteProduct(query: FilterQuery<IProductDocument>) {
  return await ProductModel.deleteOne(query);
}
