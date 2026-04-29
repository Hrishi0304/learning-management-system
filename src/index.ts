import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handlers';
import { AppError } from './utils/app-error';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  // res.json({"message":"Server is ok"});
   // We are "throwing" a manual error to test our handler
  throw new AppError("Testing our pro error handler!", 403);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
