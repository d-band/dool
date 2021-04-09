import fs from 'fs';
import { join } from 'path';
import request from 'supertest';
import { server } from '../src';

const app = server({
  cwd: join(__dirname, 'fixtures', 'es6')
});

afterAll((done) => {
  app.close(() => done());
});

test('should server work', async () => {
  const dist = join(__dirname, 'expect/server/index.js');
  const res = await request('http://localhost:8000').get('/index.js');
  if (process.env.GEN_EXPECT) {
    fs.writeFileSync(dist, res.text);
  }
  const content = fs.readFileSync(dist, 'utf-8');
  expect(res.text).toBe(content);
});
