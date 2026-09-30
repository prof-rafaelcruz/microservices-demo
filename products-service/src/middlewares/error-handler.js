const errorHandler = (error, req, res, next) => {
    if (res.headersSent) return next(error);

    const status = error.status || error.statusCode || 500;
    const message = status >= 500 ? 'Erro interno ao processar a solicitação.' : error.message;
    if (status >= 500) console.error('[PRODUCTS-SERVICE]', error);

    res.status(status).json({ error: message });
};

module.exports = errorHandler;