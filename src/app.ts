import express from 'express';

const app = express();

// Middlewares
app.use(express.json());

// Routes (aquí agregarás tus rutas en el futuro)
app.get('/', (req, res) => {
    res.send('Hello, world!');
  });
  
// app.use('/auth', authRoutes);

export default app;
