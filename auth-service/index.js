const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave';

app.use(express.json());

const USERS = [
    {id: 'usr_1', email: 'admin@empresa.com.br', password: 'password123', role: 'admin'},
    {id: 'usr_2', email: 'user@empresa.com.br', password: 'password123', role: 'user'}
];

app.post('/auth/login', (req, res) => {
    const {email, password} = req.body;

    const user = USERS.find(u => u.email === email && u.password === password);

    if(!user) {
        return res.status(401).json({error: 'Credenciais inválidas.'});
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h'}
    );

    return res.json({
        message: 'Autenticação realizada com sucesso',
        token
    });
});

app.listen(PORT, () => {
    console.log(` Auth Service rodando na porta ${PORT}`);
})