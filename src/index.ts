import { Server } from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

const PORT = process.env.PORT || '8888';
const DB_URL = process.env.DB_URL || '';

let server: Server;
// Initialize Database then server
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB.');
    server = app.listen(PORT, () => {
      console.log(`Server running on ${PORT}.`);
    });
  })
  .catch((err) => console.log(`Failed to connect to MongoDB: ${err}`));

// Cleanup process
process.on('SIGINT', () => {
  console.log('Stopping server');
  if (server) {
    server.close((sErr) => {
      if (sErr) {
        console.error(`Error when stopping server: ${sErr}`);
      }
    });
  }
  mongoose.connection.close((dbErr) => {
    if (dbErr) {
      console.error(`Error when closing db connection: ${dbErr}`);
    }
  });
});
