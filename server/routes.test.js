const app = require('./routes');
const { pool } = require('../db');
const request = require('supertest');

const validProductId = 38322;
const invalidProductId = 3832200000;

beforeAll((done) => {
  done();
})

describe('GET questions', () => {
  describe('given an existing product id', () => {
    test('should return array of questions', async () => {
      const response = await request(app).get(`/qa/${validProductId}`);
      expect(Array.isArray(response.body)).toBe(true);
    });
    test('should return status code 200', async () => {
      const response = await request(app).get(`/qa/${validProductId}`);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('given a product id that does not exist', () => {
    test('should return status code 404', async () => {
      const response = await request(app).get(`/qa/${invalidProductId}`);
      expect(response.statusCode).toBe(404);
    });
  });
});

afterAll((done) => {
  pool.end();
  done();
})