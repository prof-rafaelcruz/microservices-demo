const express = require('express');
const productRoutes = require('./routes/products.routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();

app.use(express.json());
app.use('/products', productRoutes);
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
app.use(errorHandler);

module.exports = app;