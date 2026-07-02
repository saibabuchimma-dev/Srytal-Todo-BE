import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/not-found.middleware';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
setupSwagger(app);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running 🚀',
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;