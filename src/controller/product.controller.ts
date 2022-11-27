import { Request, Response } from 'express';
import {
  CreateProductInput,
  UpdateProductInput,
  ReadProductInput,
  DeleteProductInput,
} from '../schema/product.schema';
import {
  createProduct,
  findProduct,
  findAndUpdateProduct,
  deleteProduct,
} from '../service/product.service';

export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) {
  const userId: string = res.locals.user._id;
  const newProduct = await createProduct({ ...req.body, user: userId });

  return res.status(201).json(newProduct);
}

export async function updateProductHandler(
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) {
  const userId: string = res.locals.user._id;
  const productId: string = req.params.productId;

  const product = await findProduct({ _id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct(
    { _id: productId },
    req.body,
    { new: true }
  );

  return res.status(201).json(updatedProduct);
}

export async function getProductHandler(
  req: Request<ReadProductInput['params']>,
  res: Response
) {
  const productId: string = req.params.productId;
  console.log(productId);
  const product = await findProduct({ _id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  return res.status(200).json(product);
}

export async function deleteProductHandler(
  req: Request<DeleteProductInput['params']>,
  res: Response
) {
  const userId: string = res.locals.user._id;
  const productId: string = req.params.productId;
  const product = await findProduct({ _id: productId });

  if (!product) {
    return res.sendStatus(404);
  }

  if (userId !== String(product.user)) {
    return res.sendStatus(403);
  }

  deleteProduct({ _id: productId });

  return res.sendStatus(200);
}
