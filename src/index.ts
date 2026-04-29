import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handlers';
import courseRouter from './routes/course.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/courses',courseRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({"message":"Server is ok"});
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
