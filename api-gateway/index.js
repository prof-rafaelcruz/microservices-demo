const express = require('express');
const proxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.API_GATEWAY_PORT || process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave';

const SERVICES = {
    AUTH: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    PRODUCTS: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002'
};

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error:'Muitas requisições originadas desse IP, tente novamente mais tarde'
    }
});

app.use(limiter);
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token =  authHeader && authHeader.split(' ')[1];

    if(!token)  {
        return res.status(401).json({error: 'Acesso negado. Token não fornecido.'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) =>{
        if(err) {
            return res.status(403).json({error: 'Token inválido ou expirado.'});
        }

        req.headers['x-user-id'] = user.id;
        req.headers['x-user-role'] = user.role;

        next();
    });
};

app.use((req, res, next)=>{
    console.log(`[GATEWAY] ${new Date().toISOString()} | ${req.method} -> ${req.url}`);
    next();
});

app.use('/auth', proxy(SERVICES.AUTH, {
    proxyReqPathResolver: (req) => `/auth${req.url}`
}));

app.use('/products', authenticateToken, proxy(SERVICES.PRODUCTS, {
    proxyReqPathResolver: (req) => `/products/${req.url}`,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['x-user-id'] = srcReq.headers['x-user-id'];
        proxyReqOpts.headers['x-user-role'] = srcReq.headers['x-user-role'];
        return proxyReqOpts;
    }
}));

app.use((req, res) => {
    res.status(404).json({error: 'Rota não encontrada no Qateway'});
});

app.listen(PORT, () => {
    console.log(`API GATEWAY rodando em http://localhost:${PORT}`);
});