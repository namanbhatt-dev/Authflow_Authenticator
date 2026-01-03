const request = require('supertest');
const app = require('./server');

describe('Server Routes', () => {
  it('should return index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  it('should require authentication for profile route', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual('Unauthorized');
  });

  it('should return isAuthenticated true if user is authenticated', async () => {
    const res = await request(app).get('/is-authenticated');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('isAuthenticated');
    expect(res.body.isAuthenticated).toEqual(true);
  });

  it('should return isAuthenticated false if user is not authenticated', async () => {
    const res = await request(app).get('/is-authenticated');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('isAuthenticated');
    expect(res.body.isAuthenticated).toEqual(false);
  });

  it('should enroll user in AuthFlow Authenticator', async () => {
    const res = await request(app)
      .post('/enroll-authflow')
      .set('Authorization', 'Bearer <access_token>')
      .send({ password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('You choose to not enroll in AuthFlow');
  });
});const assert = require('assert');
const winston = require('winston');

describe('Logger', () => {
  it('should log to error.log when level is set to error', () => {
    const logger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'client_side.log' })
      ],
    });

    logger.error('Test error message');

    // Assert that the error.log file contains the logged error message
    // You may need to use a file system library to read the file contents and perform the assertion
    assert.strictEqual(/* Assertion code here */);
  });

  it('should log to client_side.log when level is set to info', () => {
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'client_side.log' })
      ],
    });

    logger.info('Test info message');

    // Assert that the client_side.log file contains the logged info message
    // You may need to use a file system library to read the file contents and perform the assertion
    assert.strictEqual(/* Assertion code here */);
  });
});