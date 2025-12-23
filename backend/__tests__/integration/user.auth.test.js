const request = require('supertest');
const app = require('../../index');

describe('User API - auth flows', () => {
  it('should signin after signup and set auth cookie', async () => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/user/signup')
      .send({
        email: 'auth@example.com',
        password: 'Test@123',
        firstName: 'Auth',
        lastName: 'User'
      })
      .expect(200);

    const res = await agent
      .post('/api/v1/user/signin')
      .send({
        email: 'auth@example.com',
        password: 'Test@123'
      })
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Signin succeeded');
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'auth@example.com');

    const setCookie = res.headers['set-cookie'] || [];
    expect(Array.isArray(setCookie)).toBe(true);
    expect(setCookie.join(';')).toContain('token=');
  });

  it('should return 401 for /me when no token provided', async () => {
    await request(app)
      .get('/api/v1/user/me')
      .expect(401);
  });

  it('should return user profile for /me when authenticated via cookie', async () => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/user/signup')
      .send({
        email: 'me@example.com',
        password: 'Test@123',
        firstName: 'Me',
        lastName: 'User'
      })
      .expect(200);

    const res = await agent
      .get('/api/v1/user/me')
      .expect(200);

    expect(res.body).toHaveProperty('email', 'me@example.com');
    expect(res.body).toHaveProperty('firstName', 'Me');
    expect(res.body).toHaveProperty('lastName', 'User');
  });

  it('should update profile with PUT / when authenticated', async () => {
    const agent = request.agent(app);

    await agent
      .post('/api/v1/user/signup')
      .send({
        email: 'update@example.com',
        password: 'Test@123',
        firstName: 'Old',
        lastName: 'Name'
      })
      .expect(200);

    await agent
      .put('/api/v1/user')
      .send({
        firstName: 'New',
        lastName: 'Name'
      })
      .expect(200);

    const res = await agent
      .get('/api/v1/user/me')
      .expect(200);

    expect(res.body).toHaveProperty('firstName', 'New');
    expect(res.body).toHaveProperty('lastName', 'Name');
  });
});
