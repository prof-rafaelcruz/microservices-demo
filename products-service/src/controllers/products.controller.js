const productService = require('../services/product.service');

const list = async (req, res) => {
    const userId = req.headers['x-user-id'];
    console.log(`[PRODUCTS-SERVICE] Busca realizada pelo usuário ID: ${userId}`);
    const products = await productService.listProducts();

    res.json({
        service: 'Products Service',
        requestedBy: userId,
        data: products
    });
};

const get = async (req, res) => {
    res.json(await productService.getProduct(req.params.id));
};

const create = async (req, res) => {
    res.status(201).json(await productService.createProduct(req.body));
};

const replace = async (req, res) => {
    res.json(await productService.updateProduct(req.params.id, req.body, false));
};

const update = async (req, res) => {
    res.json(await productService.updateProduct(req.params.id, req.body));
};

const remove = async (req, res) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
};

module.exports = { list, get, create, replace, update, remove };