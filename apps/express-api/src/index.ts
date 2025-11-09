import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: ['http://192.168.56.10', 'http://localhost:5173'],
    credentials: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

app.get('/api/hello', (req, res) => {
  console.log('jhded');
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
