// /* eslint-disable no-console */
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Task from '../models/task';

const endpoint = '/task';

beforeAll(() => {
  mongoose
    .connect(process.env.MONGO_URL || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to test db.');
    })
    .catch((err) => console.log(`Failed to connect to test db: ${err}`));
});

afterAll(() => {
  mongoose.disconnect();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('Test GET /task', () => {
  test("should return empty array when there's no data", async () => {
    const res = await request(app).get(`${endpoint}`);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveLength(0);
    expect(res.body).toEqual([]);
  });

  test('should return array with all object in database', async () => {
    const taskObj1 = {
      title: 'Do the dishes',
      description: 'Remember to do the dishes',
    };
    const taskObj2 = {
      title: 'Do some work',
      description: 'Have to finish by 5',
    };
    await Task.create(taskObj1);
    await Task.create(taskObj2);
    const res = await request(app).get(`${endpoint}`);
    const [created1, created2] = res.body;
    expect(res.status).toEqual(200);
    expect(created1.title).toEqual(taskObj1.title);
    expect(created1.description).toEqual(taskObj1.description);
    expect(created1.done).toEqual(false);
    expect(created2.title).toEqual(taskObj2.title);
    expect(created2.description).toEqual(taskObj2.description);
    expect(created2.done).toEqual(false);
    expect(res.body).toHaveLength(2);
  });
});

describe('Test POST /task', () => {
  test('should create new task', async () => {
    const taskObj = {
      title: 'Do the dishes',
      description: 'Remember to do the dishes',
    };
    const res = await request(app).post(`${endpoint}`).send(taskObj);
    const task = await Task.find({});
    expect(res.status).toEqual(201);
    expect(task).toHaveLength(1);
    expect(task[0].title).toEqual(taskObj.title);
    expect(task[0].description).toEqual(taskObj.description);
    expect(task[0].done).toEqual(false);
  });

  test('should create 2 new merchant when endpoint is called twice', async () => {
    const taskObj1 = {
      title: 'Do the dishes',
      description: 'Remember to do the dishes',
    };
    const taskObj2 = {
      title: 'Do the dishes',
      description: 'Remember to do the dishes',
    };
    const res1 = await request(app).post(`${endpoint}`).send(taskObj1);
    const res2 = await request(app).post(`${endpoint}`).send(taskObj2);
    const tasks = await Task.find({});
    expect(res1.status).toEqual(201);
    expect(res2.status).toEqual(201);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toEqual(taskObj1.title);
    expect(tasks[0].description).toEqual(taskObj1.description);
    expect(tasks[0].done).toEqual(false);
    expect(tasks[1].title).toEqual(taskObj2.title);
    expect(tasks[1].description).toEqual(taskObj2.description);
    expect(tasks[1].done).toEqual(false);
  });

  test('should return 400 with error message when request body is empty', async () => {
    const res = await request(app).post(`${endpoint}`).send({});
    const tasks = await Task.find({});
    expect(res.status).toEqual(400);
    expect(tasks).toHaveLength(0);
  });
});
