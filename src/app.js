import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { SERVER_PORT, SERVER_HOST } from './utils/constant.js';
import routes from "./routes/product.js"
import { db } from '../db/db.js';

const app = express()


app.use(express.static("public"))
app.use(express.json());
app.use('/api',routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });

app.listen(SERVER_PORT,SERVER_HOST,() =>
{ 
    console.log(`Server is running on http://${SERVER_HOST}:${SERVER_PORT}`)
})

