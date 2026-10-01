const { Prisma } = require('@prisma/client');
const { prisma } = require('../database/prisma');

// Função que transforma o Date em uma String no fuso horário de São Paulo
const formatToTimeZone = (date) => {
    if (!date) return null;
    
    // Intl.DateTimeFormat garante que a string gerada terá exatamente a hora de São Paulo
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
    // Retorna no formato estável: "DD/MM/AAAA, HH:MM:SS"
};

const toProduct = (product) => ({
    ...product,
    price: Number(product.price),
    createdAt: formatToTimeZone(product.createdAt),
    updatedAt: formatToTimeZone(product.updatedAt)
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