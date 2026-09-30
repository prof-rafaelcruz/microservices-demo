const requireAdmin = (req, res, next) => {
    if (req.headers['x-user-role'] !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem alterar produtos.' });
    }
    next();
};

module.exports = requireAdmin;