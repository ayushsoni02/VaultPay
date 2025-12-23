const request = require('supertest');
const app = require('../../index');
const { userModel } = require('../../db');

describe('User API', () => {
  afterEach(async () => {
    await userModel.deleteMany({});
  });

  describe('POST /api/v1/user/signup', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Signup succeeded');
      expect(response.body).toHaveProperty('token');
    });

    it('should not create user with existing email', async () => {
      // First create a user
      await userModel.create({
        email: 'existing@example.com',
        password: 'hashed_password',
        firstName: 'Existing',
        lastName: 'User'
      });

      const response = await request(app)
        .post('/api/v1/user/signup')
        .send({
          email: 'existing@example.com',
          password: 'Test@123',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(409);

      expect(response.body).toHaveProperty('message');
    });
  });
});