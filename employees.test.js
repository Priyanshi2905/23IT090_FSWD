const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const path = require('path');

describe('Employee API Endpoints', () => {
  let authToken = 'YOUR_TEST_AUTH_TOKEN'; // Replace with a valid token or mock auth middleware

  beforeAll(async () => {
    // Connect to test database if needed
    // await mongoose.connect('mongodb://localhost/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Disconnect from test database
    // await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up employees after each test
    await Employee.deleteMany({});
  });

  test('GET /employees should return empty array initially', async () => {
    const res = await request(app)
      .get('/employees')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /employees should add a new employee', async () => {
    const res = await request(app)
      .post('/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .field('name', 'Test User')
      .field('email', 'testuser@example.com')
      .field('phone', '1234567890')
      .field('employeeType', 'Full-Time')
      .attach('profilePic', path.resolve(__dirname, 'test-pic.jpg')); // Ensure test-pic.jpg exists or remove this line

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test User');
    expect(res.body.email).toBe('testuser@example.com');
  });

  test('GET /employees should return array with added employee', async () => {
    // Add employee first
    await new Employee({
      name: 'Existing User',
      email: 'existing@example.com',
      phone: '0987654321',
      employeeType: 'Part-Time',
    }).save();

    const res = await request(app)
      .get('/employees')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe('existing@example.com');
  });
});
