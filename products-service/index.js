const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PRODUCTS_SERVICE_PORT || process.env.PORT || 3002;

app.use(express.json());

const PRODUCTS = [
    {id: 1, name: 'Notebook Dell XPS', price: 8500.00},
    {id: 2, name: 'Teclado Mecânico Keychron', price: 650.00},
    {id: 3, name: 'Minitor Ultraide 34"', price: 2900.00}
];

app.get('/products', (req, res) => {
    const userId = req.headers['x-user-id'];
    console.log(`[PRODUCTS-SERVICE] Busca realizada pelo usuário ID: ${userId}`);

    res.json({
        service: 'Products Services',
        requestedBy: userId,
        data: PRODUCTS
    });
});

app.post('/products', (req, res) => {
    const userRole = req.headers['x-user-role'];

    if(userRole !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar.' });
    };

    const { name, price } = req.body;

    const newProduct = { id: PRODUCTS.length + 1, name, price };
    PRODUCTS.push(newProduct);

    res.status(201).json(newProduct);

});

app.listen(PORT, () => {
    console.log(`Products Service rodando na porta ${PORT}`);
})