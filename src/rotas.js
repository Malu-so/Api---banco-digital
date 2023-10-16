const express = require('express');

const rota = express();

const controladores = require('./controladores/banco');

rota.get('/contas', controladores.listarContas);
rota.post('/contas', controladores.criarConta);
rota.put('/contas/:numeroConta/usuario', controladores.atualizarUsuario);
rota.delete('/contas/:numeroConta', controladores.excluirConta);
rota.post('/transacoes/depositar', controladores.depositar);
rota.post('/transacoes/sacar', controladores.sacar);
rota.post('/transacoes/transferir', controladores.transferir);
rota.get('/transacoes/saldo', controladores.saldo);
rota.get('/contas/extrato', controladores.extrato);

module.exports = rota;