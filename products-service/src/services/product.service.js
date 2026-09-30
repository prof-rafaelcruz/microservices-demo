const productRepository = require('../repositories/product.repository');

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const parseId = (value) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1) {
        throw new HttpError(400, 'ID do produto inválido.');
    }
    return id;
};

const validateProduct = (data, partial = false) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new HttpError(400, 'Informe os dados do produto.');
    }

    const product = {};
    if (!partial || Object.hasOwn(data, 'name')) {
        if (typeof data.name !== 'string' || !data.name.trim() || data.name.trim().length > 255) {
            throw new HttpError(400, 'O nome deve ter entre 1 e 255 caracteres.');
        }
        product.name = data.name.trim();
    }

    if (!partial || Object.hasOwn(data, 'price')) {
        if (typeof data.price !== 'number' || !Number.isFinite(data.price) || data.price < 0) {
            throw new HttpError(400, 'O preço deve ser um número maior ou igual a zero.');
        }
        product.price = data.price;
    }

    if (partial && Object.keys(product).length === 0) {
        throw new HttpError(400, 'Informe ao menos nome ou preço para atualizar.');
    }

    return product;
};

const listProducts = () => productRepository.findAll();

const getProduct = async (value) => {
    const product = await productRepository.findById(parseId(value));
    if (!product) throw new HttpError(404, 'Produto não encontrado.');
    return product;
};

const createProduct = (data) => productRepository.create(validateProduct(data));

const updateProduct = async (value, data, partial = true) => {
    try {
        return await productRepository.update(parseId(value), validateProduct(data, partial));
    } catch (error) {
        if (error.code === 'P2025') throw new HttpError(404, 'Produto não encontrado.');
        throw error;
    }
};

const deleteProduct = async (value) => {
    try {
        await productRepository.remove(parseId(value));
    } catch (error) {
        if (error.code === 'P2025') throw new HttpError(404, 'Produto não encontrado.');
        throw error;
    }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };