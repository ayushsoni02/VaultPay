const request = require('supertest');
const app = require('../../index');
const { userModel, AccountModel } = require('../../db');

async function createAuthedUser(agent, { email, firstName, lastName, password }) {
  await agent
    .post('/api/v1/user/signup')
    .send({ email, firstName, lastName, password })
    .expect(200);

  const user = await userModel.findOne({ email });
  const account = await AccountModel.findOne({ userId: user._id });

  return { user, account };
}

describe('Account API', () => {
  it('should return balance for authenticated user', async () => {
    const agent = request.agent(app);

    const { user } = await createAuthedUser(agent, {
      email: 'balance@example.com',
      password: 'Test@123',
      firstName: 'Bal',
      lastName: 'User'
    });

    const res = await agent
      .get('/api/v1/account/balance')
      .expect(200);

    expect(res.body).toHaveProperty('balance');

    const account = await AccountModel.findOne({ userId: user._id });
    expect(res.body.balance).toBe(account.balance);
  });

  it('should transfer money between two users', async () => {
    const agentA = request.agent(app);

    const { user: userA } = await createAuthedUser(agentA, {
      email: 'sender@example.com',
      password: 'Test@123',
      firstName: 'Sender',
      lastName: 'User'
    });

    const agentB = request.agent(app);
    const { user: userB } = await createAuthedUser(agentB, {
      email: 'receiver@example.com',
      password: 'Test@123',
      firstName: 'Receiver',
      lastName: 'User'
    });

    // Ensure sender has enough balance
    await AccountModel.updateOne({ userId: userA._id }, { $set: { balance: 5000 } });

    await agentA
      .post('/api/v1/account/transfer')
      .send({ amount: 1000, to: userB._id.toString() })
      .expect(200);

    const accountA = await AccountModel.findOne({ userId: userA._id });
    const accountB = await AccountModel.findOne({ userId: userB._id });

    expect(accountA.balance).toBe(4000);
    expect(accountB.balance).toBeGreaterThanOrEqual(1000);
  });

  it('should fail transfer when insufficient balance', async () => {
    const agentA = request.agent(app);

    const { user: userA } = await createAuthedUser(agentA, {
      email: 'lowbal@example.com',
      password: 'Test@123',
      firstName: 'Low',
      lastName: 'Bal'
    });

    const agentB = request.agent(app);
    const { user: userB } = await createAuthedUser(agentB, {
      email: 'lowbal-recv@example.com',
      password: 'Test@123',
      firstName: 'Recv',
      lastName: 'User'
    });

    await AccountModel.updateOne({ userId: userA._id }, { $set: { balance: 10 } });

    const res = await agentA
      .post('/api/v1/account/transfer')
      .send({ amount: 1000, to: userB._id.toString() })
      .expect(400);

    expect(res.body).toHaveProperty('message', 'Insufficient balance');
  });
});
