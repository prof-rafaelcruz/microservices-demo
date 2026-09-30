const { Prisma } = require('@prisma/client');
const { prisma } = require('../database/prisma');

const toProduct = (product) => ({
    ...product,
    price: Number(product.price)
});

const findAll = async () => {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    return products.map(toProduct);
};

const findById = async (id) => {
    const product = await prisma.product.findUnique({ where: { id } });
    return product ? toProduct(product) : null;
};

const create = async (data) => {
    const product = await prisma.product.create({
        data: { ...data, price: new Prisma.Decimal(data.price) }
    });
    return toProduct(product);
};

const update = async (id, data) => {
    const product = await prisma.product.update({
        where: { id },
        data: {
            ...data,
            ...(data.price !== undefined && { price: new Prisma.Decimal(data.price) })
        }
    });
    return toProduct(product);
};

const remove = async (id) => prisma.product.delete({ where: { id } });

module.exports = { findAll, findById, create, update, remove };