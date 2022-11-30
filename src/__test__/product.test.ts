import supertest from 'supertest';
import { createServer } from '../utils/createServer';
import mongoose from 'mongoose';
import connectDB from '../utils/connect';
import { signJwt } from '../utils/jwt.utils';
import { IProductInput } from '../interface/product';

const app = createServer();

describe('product', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get product route', () => {
    it('should return 404 - route does not exist', async () => {
      const productId: string = new mongoose.Types.ObjectId().toString();
      const res = await supertest(app).get(`/api/products/${productId}`);
      expect(res.statusCode).toBe(404);
    });

    it('should return 200 - product exist', async () => {
      // this is an existing document in database
      const newProductRes = {
        __v: 0,
        _id: '6384e5b48e8b03b44ee7abd0',
        user: '6384e5b48e8b03b44ee7abcf',
        title: 'product title',
        description:
          'this is an example description of a product above. the product description often describes the spesification of the products, the conditions, and many more',
        price: 230,
        image: 'http://image.com/mock.png',
      };

      const res = await supertest(app).get(
        `/api/products/${newProductRes._id}`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual(newProductRes);
    });
  });

  describe('create product route', () => {
    it('should return 403 - user not logged in', async () => {
      const { statusCode } = await supertest(app).post('/api/products');
      expect(statusCode).toBe(403);
    });

    it.skip('should return 201 - user logged in', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const userPayload = {
        _id: userId,
        email: 'hisyam@email.com',
        name: 'Hisyam',
      };
      const productPayload: IProductInput = {
        title: 'title',
        description:
          'this is a product description. It has to match certain conditions such as the minimum chars required in this case is 120 characters minimum. the description property often describes about the spesifications of the product',
        price: 10,
        image: 'http://mock.image.com/1.png',
        user: userId,
      };

      const jwt = signJwt(userPayload);
      const { statusCode, body } = await supertest(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${jwt}`)
        .send(productPayload);

      expect(statusCode).toBe(201);
      expect(body).toEqual(expect.objectContaining(productPayload));
    });
  });
});
