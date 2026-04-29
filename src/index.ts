import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import pool from './config/db-config';
import { tryCatch } from './utils/try-catch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({"message":"Server is ok"});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
