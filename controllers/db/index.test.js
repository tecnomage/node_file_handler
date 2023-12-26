const request = require('supertest');
const app = require('../../app'); // Assuming your app is exported from app.js
const db = require('../../db'); // Assuming your db module is exported from db.js

describe('File Endpoints', () => {
  beforeAll(async () => {
    // Set up your test database
    await db.run('CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, file_path TEXT)');
  });

  afterAll(async () => {
    // Clean up your test database
    await db.run('DROP TABLE IF EXISTS files');
  });

  it('should get all files', async () => {
    const response = await request(app).get('/allfiles');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should send a file', async () => {
    const response = await request(app)
      .post('/sendfiles')
      .attach('file', '/path/to/test/file.txt'); // Replace with the path to your test file

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('file_path');

    const fileId = response.body.id;
    const file = await db.get('SELECT * FROM files WHERE id = ?', [fileId]);
    expect(file).toBeTruthy();
    expect(file.file_path).toEqual(`${file.path}.gz`);
  });
});