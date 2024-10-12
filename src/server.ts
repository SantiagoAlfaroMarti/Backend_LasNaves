import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './database/db';
import router from './router';

const app = express();

app.use(cors())

app.use(express.json())

const PORT = process.env.PORT || 4000;

app.use('/api', router)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch(error => {
        console.log(error)
    })