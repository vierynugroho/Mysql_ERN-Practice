import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';

import productRouter from './routes/product-router.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// product route
app.use(productRouter);

app.listen(PORT, () => {
	console.log(`Server running in http://localhost:${PORT}`);
});
