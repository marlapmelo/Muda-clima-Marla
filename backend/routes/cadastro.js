const express = require('express');
const path = require('path');

// Cria um roteador exclusivo para as coisas de cadastro
const router = express.Router();

// Aqui você coloca todas as rotas relacionadas a cadastro
router.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/html/cadastro.html'));
});

// Rota para salvar no banco:
// router.post('/cadastro/salvar', (req, res) => { ... })

// No final, você exporta esse roteador para que o server.js possa pegá-lo
module.exports = router;