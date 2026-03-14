/**
 * For testing auth.controller.ts and auth.middleware.ts
 */
import express from 'express';
import request from 'supertest';
import { Server } from 'http';
import MongoStore from 'connect-mongo';
import MongoConnection from '../../config/mongoConnection.ts';
import createExpressApp from '../../config/createExpressApp.ts';
import StatusCode from '../../util/statusCode.ts';
import { User } from '../../models/user.model.ts';
import Session from '../../models/session.model.ts';

let dbConnection: MongoConnection;
let sessionStore: MongoStore;
let app: express.Express;
let server: Server;
let agent: ReturnType<typeof request.agent>;

const cleanMongoObjArr = (objArr: any[]): any => {
  const dup = objArr.map((obj) => {
    const copy = { ...obj };
    delete copy._id;
    delete copy.__v;
    return copy;
  });
  return dup;
};

const testEmail = 'example@gmail.com';
const testPassword = '123456';
const testFirstName = 'testFirst';
const testLastName = 'testLast';
const user1 = {
  email: testEmail,
  firstName: testFirstName,
  lastName: testLastName,
  roles: ['admin'],
  verified: true,
};

const testEmail2 = 'testemail2@gmail.com';
const testPassword2 = '123456';
const testFirstName2 = 'test2First';
const testLastName2 = 'test3Last';
const user2 = {
  email: testEmail2,
  firstName: testFirstName2,
  lastName: testLastName2,
  roles: ['user'],
  verified: true,
};

const testEmail3 = 'testemail3@gmail.com';
const testPassword3 = '123456';
const testFirstName3 = 'test3First';
const testLastName3 = 'test3Last';
const user3 = {
  email: testEmail3,
  firstName: testFirstName3,
  lastName: testLastName3,
  roles: ['admin'],
  verified: true,
};

const testEmail4 = 'testemail4@gmail.com';
const testPassword4 = '123456';
const testFirstName4 = 'test4First';
const testLastName4 = 'test4Last';
const user4 = {
  email: testEmail4,
  firstName: testFirstName4,
  lastName: testLastName4,
  roles: ['user'],
  verified: true,
};

beforeAll(async () => {
  // connects to an in memory database since this is a testing environment
  dbConnection = await MongoConnection.getInstance();
  dbConnection.open();

  sessionStore = dbConnection.createSessionStore(); // for storing user sessions in the db
  app = createExpressApp(sessionStore); // instantiate express app
  server = app.listen(); // instantiate server to listen on some unused port
  agent = request.agent(server); // instantiate supertest agent
});

afterAll(async () => {
  sessionStore.close();
  dbConnection.close();
});

beforeEach(async () => {
  // Clear the database before each test
  dbConnection.clearInMemoryCollections();
});

describe('testing admin routes', () => {
  describe('testing admin routes as admin', () => {
    // Want to log in a user and promote them to admin before each of these tests
    beforeEach(async () => {
      // Register users
      let response = await agent.post('/api/auth/register').send({
        email: testEmail,
        password: testPassword,
        firstName: testFirstName,
        lastName: testLastName,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail2,
        password: testPassword2,
        firstName: testFirstName2,
        lastName: testLastName2,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail2 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail3,
        password: testPassword3,
        firstName: testFirstName3,
        lastName: testLastName3,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail3 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail4,
        password: testPassword4,
        firstName: testFirstName4,
        lastName: testLastName4,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail4 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      // Login user3, promote to admin, and then logout
      response = await agent.post('/api/auth/login').send({
        email: testEmail3,
        password: testPassword3,
      });
      expect(response.status).toBe(StatusCode.OK);
      expect(await Session.countDocuments()).toBe(1);

      // Promote user3 to admin
      response = await agent.put('/api/admin/autopromote').send({
        email: testEmail3,
        role: 'admin',
      });
      expect(response.status).toBe(StatusCode.OK);
      const admin3 = await User.findOne({ email: testEmail3 });
      expect(admin3).toBeTruthy();
      expect(admin3!.roles).toContain('admin');

      // Logout user3
      response = await agent.post('/api/auth/logout');
      expect(response.status).toBe(StatusCode.OK);
      expect(await Session.countDocuments()).toBe(0);

      // Login user 1 and promote to admin
      response = await agent.post('/api/auth/login').send({
        email: testEmail,
        password: testPassword,
      });
      expect(response.status).toBe(StatusCode.OK);
      expect(await Session.countDocuments()).toBe(1);

      // Promote user to admin
      response = await agent.put('/api/admin/autopromote').send({
        email: testEmail,
        role: 'admin',
      });
      expect(response.status).toBe(StatusCode.OK);
      const admin = await User.findOne({ email: testEmail });
      expect(admin).toBeTruthy();
      expect(admin!.roles).toContain('admin');
    });

    describe('testing GET /api/admin/users', () => {
      it('admin can get all users', async () => {
        // get all users
        const response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.OK);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user1);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user2);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user3);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user4);
      });
    });

    describe('testing GET /api/admin/adminstatus', () => {
      it('admin calling /adminstatus is true', async () => {
        // check admin status
        const response = await agent.get('/api/admin/adminstatus').send();
        expect(response.status).toBe(StatusCode.OK);
      });
    });

    describe('testing PUT /api/admin/promote', () => {
      it('admin can promote user', async () => {
        // promote user
        const response = await agent
          .put('/api/admin/promote')
          .send({ email: testEmail2, role: 'admin' });
        expect(response.status).toBe(StatusCode.OK);
        const newAdmin = await User.findOne({ email: testEmail2 });
        expect(newAdmin).toBeTruthy();
        expect(newAdmin!.roles).toContain('admin');
      });

      it('admin promoting non-existant user throws error', async () => {
        // promote user
        const response = await agent
          .put('/api/admin/promote')
          .send({ email: 'emaildoesnotexist@gmail.com', role: 'admin' });
        expect(response.status).toBe(StatusCode.NOT_FOUND);
      });

      it('admin promoting self throws error', async () => {
        // promote user
        const response = await agent
          .put('/api/admin/promote')
          .send({ email: testEmail });
        expect(response.status).toBe(StatusCode.BAD_REQUEST);
      });

      it('admin promoting admin throws error', async () => {
        // promote user
        const response = await agent
          .put('/api/admin/promote')
          .send({ email: testEmail3 });
        expect(response.status).toBe(StatusCode.BAD_REQUEST);
      });

      it('promoting without sending body throws email', async () => {
        // promote user
        const response = await agent.put('/api/admin/promote').send();
        expect(response.status).toBe(StatusCode.BAD_REQUEST);
      });
    });

    describe('testing DELETE /api/admin/:email', () => {
      it('admin deleting user removes user', async () => {
        // delete user
        let response = await agent.delete(`/api/admin/${testEmail4}`).send();
        expect(response.status).toBe(StatusCode.OK);

        // check that user was deleted
        response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.OK);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user1);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user2);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user3);
        expect(cleanMongoObjArr(response.body)).not.toContainEqual(user4);
      });

      it('admin attempting to delete self throws error', async () => {
        let response = await agent.delete(`/api/admin/${testEmail}`).send();
        expect(response.status).toBe(StatusCode.BAD_REQUEST);

        response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.OK);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user1);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user2);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user3);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user4);
      });

      it('admin attempting to delete other admin throws error', async () => {
        let response = await agent.delete(`/api/admin/${testEmail3}`).send();
        expect(response.status).toBe(StatusCode.FORBIDDEN);

        response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.OK);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user1);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user2);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user3);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user4);
      });

      it('deleting non-existent user throws error', async () => {
        let response = await agent.delete(`/api/admin/notexistent`).send();
        expect(response.status).toBe(StatusCode.NOT_FOUND);

        response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.OK);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user1);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user2);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user3);
        expect(cleanMongoObjArr(response.body)).toContainEqual(user4);
      });
    });
  });

  describe('testing admin routes as non-admin', () => {
    // Want to log in a user and promote them to admin before each of these tests
    beforeEach(async () => {
      // Register users
      let response = await agent.post('/api/auth/register').send({
        email: testEmail,
        password: testPassword,
        firstName: testFirstName,
        lastName: testLastName,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail2,
        password: testPassword2,
        firstName: testFirstName2,
        lastName: testLastName2,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail2 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail3,
        password: testPassword3,
        firstName: testFirstName3,
        lastName: testLastName3,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail3 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      response = await agent.post('/api/auth/register').send({
        email: testEmail4,
        password: testPassword4,
        firstName: testFirstName4,
        lastName: testLastName4,
      });
      expect(response.status).toBe(StatusCode.CREATED);
      expect(await User.findOne({ email: testEmail4 })).toBeTruthy();
      expect(await Session.countDocuments()).toBe(0);

      // Login user1
      response = await agent.post('/api/auth/login').send({
        email: testEmail,
        password: testPassword,
      });
      expect(response.status).toBe(StatusCode.OK);
      expect(await Session.countDocuments()).toBe(1);
    });

    describe('testing GET /api/admin/users', () => {
      it('non admin cannot get all users', async () => {
        // get all users
        const response = await agent.get('/api/admin/all').send();
        expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      });
    });

    describe('testing GET /api/admin/adminstatus', () => {
      it('non admin calling /adminstatus throwsError', async () => {
        // check admin status
        const response = await agent.get('/api/admin/adminstatus').send();
        expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      });
    });

    describe('testing PUT /api/admin/promote', () => {
      it('nonadmin attempting to promote user throws error', async () => {
        // promote user
        const response = await agent
          .put('/api/admin/promote')
          .send({ email: testEmail2 });
        expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      });
    });

    describe('testing DELETE /api/admin/:email', () => {
      it('non admin attempting to delete user throws error', async () => {
        // delete user
        const response = await agent.delete(`/api/admin/${testEmail4}`).send();
        expect(response.status).toBe(StatusCode.UNAUTHORIZED);
      });
    });
  });
});

// ─── Role-guard tests ────────────────────────────────────────────────────────
// Each `it` block starts with a clean DB (outer beforeEach clears collections),
// so the agent has no valid session at the start of each test.

const rgUserEmail = 'rg-user@gmail.com';
const rgUserPassword = 'password123';
const rgAdminEmail = 'rg-admin@gmail.com';
const rgAdminPassword = 'password123';
const rgSuperadminEmail = 'rg-superadmin@gmail.com';
const rgSuperadminPassword = 'password123';
const rgTargetEmail = 'rg-target@gmail.com';
const rgTargetPassword = 'password123';

describe('role-guard tests', () => {
  describe('GET /api/admin/all — role guard', () => {
    it('returns 401 when not authenticated', async () => {
      const response = await agent.get('/api/admin/all').send();
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 401 when authenticated as user role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgUserEmail,
        password: rgUserPassword,
        firstName: 'RG',
        lastName: 'User',
      });
      await agent.post('/api/auth/login').send({
        email: rgUserEmail,
        password: rgUserPassword,
      });
      const response = await agent.get('/api/admin/all').send();
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 200 when authenticated as admin role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
        firstName: 'RG',
        lastName: 'Admin',
      });
      await agent.put('/api/admin/autopromote').send({
        email: rgAdminEmail,
        role: 'admin',
      });
      await agent.post('/api/auth/login').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
      });
      const response = await agent.get('/api/admin/all').send();
      expect(response.status).toBe(StatusCode.OK);
    });

    it('returns 200 when authenticated as superadmin role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgSuperadminEmail,
        password: rgSuperadminPassword,
        firstName: 'RG',
        lastName: 'Superadmin',
      });
      await agent.put('/api/admin/autopromote').send({
        email: rgSuperadminEmail,
        role: 'superadmin',
      });
      await agent.post('/api/auth/login').send({
        email: rgSuperadminEmail,
        password: rgSuperadminPassword,
      });
      const response = await agent.get('/api/admin/all').send();
      expect(response.status).toBe(StatusCode.OK);
    });
  });

  describe('DELETE /api/admin/:email — role guard', () => {
    it('returns 401 when not authenticated', async () => {
      // isAuthenticated runs before the controller, so missing session → 401
      // regardless of whether the target user exists
      const response = await agent
        .delete(`/api/admin/${rgTargetEmail}`)
        .send();
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 401 when authenticated as user role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgUserEmail,
        password: rgUserPassword,
        firstName: 'RG',
        lastName: 'User',
      });
      await agent.post('/api/auth/register').send({
        email: rgTargetEmail,
        password: rgTargetPassword,
        firstName: 'RG',
        lastName: 'Target',
      });
      await agent.post('/api/auth/login').send({
        email: rgUserEmail,
        password: rgUserPassword,
      });
      const response = await agent
        .delete(`/api/admin/${rgTargetEmail}`)
        .send();
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 200 when authenticated as admin role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
        firstName: 'RG',
        lastName: 'Admin',
      });
      await agent.post('/api/auth/register').send({
        email: rgTargetEmail,
        password: rgTargetPassword,
        firstName: 'RG',
        lastName: 'Target',
      });
      await agent.put('/api/admin/autopromote').send({
        email: rgAdminEmail,
        role: 'admin',
      });
      await agent.post('/api/auth/login').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
      });
      const response = await agent
        .delete(`/api/admin/${rgTargetEmail}`)
        .send();
      expect(response.status).toBe(StatusCode.OK);
    });
  });

  describe('PUT /api/admin/promote — role guard', () => {
    it('returns 401 when not authenticated', async () => {
      const response = await agent
        .put('/api/admin/promote')
        .send({ email: rgTargetEmail, role: 'admin' });
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 401 when authenticated as user role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgUserEmail,
        password: rgUserPassword,
        firstName: 'RG',
        lastName: 'User',
      });
      await agent.post('/api/auth/register').send({
        email: rgTargetEmail,
        password: rgTargetPassword,
        firstName: 'RG',
        lastName: 'Target',
      });
      await agent.post('/api/auth/login').send({
        email: rgUserEmail,
        password: rgUserPassword,
      });
      const response = await agent
        .put('/api/admin/promote')
        .send({ email: rgTargetEmail, role: 'admin' });
      expect(response.status).toBe(StatusCode.UNAUTHORIZED);
    });

    it('returns 400 for invalid role value', async () => {
      await agent.post('/api/auth/register').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
        firstName: 'RG',
        lastName: 'Admin',
      });
      await agent.post('/api/auth/register').send({
        email: rgTargetEmail,
        password: rgTargetPassword,
        firstName: 'RG',
        lastName: 'Target',
      });
      await agent.put('/api/admin/autopromote').send({
        email: rgAdminEmail,
        role: 'admin',
      });
      await agent.post('/api/auth/login').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
      });
      const response = await agent
        .put('/api/admin/promote')
        .send({ email: rgTargetEmail, role: 'invalidrole' });
      expect(response.status).toBe(StatusCode.BAD_REQUEST);
    });

    it('returns 200 when authenticated as admin role with valid role', async () => {
      await agent.post('/api/auth/register').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
        firstName: 'RG',
        lastName: 'Admin',
      });
      await agent.post('/api/auth/register').send({
        email: rgTargetEmail,
        password: rgTargetPassword,
        firstName: 'RG',
        lastName: 'Target',
      });
      await agent.put('/api/admin/autopromote').send({
        email: rgAdminEmail,
        role: 'admin',
      });
      await agent.post('/api/auth/login').send({
        email: rgAdminEmail,
        password: rgAdminPassword,
      });
      const response = await agent
        .put('/api/admin/promote')
        .send({ email: rgTargetEmail, role: 'admin' });
      expect(response.status).toBe(StatusCode.OK);
    });
  });
});
