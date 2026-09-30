const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = require('./app');
const { prisma } = require('./database/prisma');

const PORT = process.env.PRODUCTS_SERVICE_PORT || process.env.PORT || 3002;
const server = app.listen(PORT, () => {
    console.log(`Products Service rodando na porta ${PORT}`);
});

const shutdown = async () => {
    server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);