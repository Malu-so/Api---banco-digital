const { json } = require('body-parser');
const bancoDeDados = require('../bancodedados');

const listarContas = (req, res) => {
    const { senha_banco } = req.query;
    const { banco, contas } = bancoDeDados;

    if (!senha_banco) {
        return res.status(400).json({ mensagem: 'É obrigatório o envio da senha!' });
    }

    if (senha_banco !== banco.senha) {
        return res.status(400).json({ mensagem: 'Senha informada inválida!' });
    }

    return res.status(200).json(contas);
}

const criarConta = (req, res) => {
    const body = req.body;
    let { contas } = bancoDeDados;

    if (!body.nome) {
        return res.status(400).json({ mensagem: 'O envio do nome é obrigatório!' });
    }

    if (!body.cpf) {
        return res.status(400).json({ mensagem: 'O envio do cpf é obrigatório!' });
    }

    if (!body.data_nascimento) {
        return res.status(400).json({ mensagem: 'O envio da data de nascimento é obrigatório!' });
    }

    if (!body.telefone) {
        return res.status(400).json({ mensagem: 'O envio do telefone é obrigatório!' });
    }

    if (!body.email) {
        return res.status(400).json({ mensagem: 'O envio do email é obrigatório!' });
    }

    if (!body.senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    if (contas.length > 0) {
        const filtrarCpf = contas.find((conta) => {
            return conta.usuario.cpf === body.cpf;
        })

        if (filtrarCpf) {
            return res.status(400).json({ mensagem: 'Esse cpf já está registrado!' });
        }

        const filtrarEmail = contas.find((conta) => {
            return conta.usuario.email === body.email;
        })


        if (filtrarEmail) {
            return res.status(400).json({ mensagem: 'Esse email já está registrado!' });
        }
    }


    let identificador = 1;

    let novaConta = {
        numero: identificador,
        saldo: 0,
        usuario: {
            nome: body.nome,
            cpf: body.cpf,
            data_nascimento: body.data_nascimento,
            telefone: body.telefone,
            email: body.email,
            senha: body.senha
        }
    }

    const ultimaConta = contas.slice(-1);

    if (contas.length > 0) {
        const novoIdentificador = ultimaConta[0].numero;
        novaConta.numero = novoIdentificador + 1;
    }

    contas.push(novaConta);

    return res.status(201).json();
}

const atualizarUsuario = (req, res) => {
    const body = req.body;
    const { numeroConta } = req.params;
    const { contas } = bancoDeDados;

    if (!body.nome) {
        return res.status(400).json({ mensagem: 'O envio do nome é obrigatório!' });
    }

    if (!body.cpf) {
        return res.status(400).json({ mensagem: 'O envio do cpf é obrigatório!' });
    }

    if (!body.data_nascimento) {
        return res.status(400).json({ mensagem: 'O envio da data de nascimento é obrigatório!' });
    }

    if (!body.telefone) {
        return res.status(400).json({ mensagem: 'O envio do telefone é obrigatório!' });
    }

    if (!body.email) {
        return res.status(400).json({ mensagem: 'O envio do email é obrigatório!' });
    }

    if (!body.senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    const filtrarCpf = contas.find((conta) => {
        return conta.usuario.cpf === body.cpf;
    })

    if (filtrarCpf) {
        return res.status(400).json({ mensagem: 'Esse cpf já está registrado!' });
    }

    const filtrarEmail = contas.find((conta) => {
        return conta.usuario.email === body.email;
    })

    if (filtrarEmail) {
        return res.status(400).json({ mensagem: 'Esse email já está registrado!' });
    }

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Esse usuário não existe!' });
    }

    acharConta.usuario.nome = body.nome;
    acharConta.usuario.cpf = body.cpf;
    acharConta.usuario.data_nascimento = body.data_nascimento;
    acharConta.usuario.telefone = body.telefone;
    acharConta.usuario.email = body.email;
    acharConta.usuario.senha = body.senha;

    return res.status(204).json();
}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;
    let { contas } = bancoDeDados;

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Essa conta não foi encontrada!' });
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    })

    return res.status(204).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    let { contas, depositos } = bancoDeDados;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O envio do número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O envio do valor é obrigatório!' });
    }

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Essa conta não foi encontrada!' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Valores abaixo de zero não são permitidos!' });
    }

    acharConta.saldo += valor;

    const novoDeposito = {
        numero_conta: numero_conta,
        valor: valor
    }

    depositos.push(novoDeposito);

    return res.status(204).json();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    let { contas, saques } = bancoDeDados;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O envio do número da conta é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O envio do valor é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Essa conta não foi encontrada!' });
    }

    if (senha !== acharConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha informada inválida!' });
    }

    if (!acharConta.saldo >= valor) {
        return res.status(404).json({ mensagem: 'Não há saldo suficiente!' });
    }

    acharConta.saldo -= valor;

    const novoSaque = {
        numero_conta: numero_conta,
        valor: valor
    }

    saques.push(novoSaque);

    return res.status(204).json();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, senha, valor } = req.body;
    let { contas, transferencias } = bancoDeDados;

    if (!numero_conta_origem) {
        return res.status(400).json({ mensagem: 'O envio do número da conta de origem é obrigatório!' });
    }

    if (!numero_conta_destino) {
        return res.status(400).json({ mensagem: 'O envio do número da conta de destino é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    if (!valor) {
        return res.status(400).json({ mensagem: 'O envio do valor é obrigatório!' });
    }

    let acharContaDeOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    })

    if (!acharContaDeOrigem) {
        return res.status(404).json({ mensagem: 'A conta de origem não foi encontrada!' });
    }

    let acharContaDeDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    })

    if (!acharContaDeDestino) {
        return res.status(404).json({ mensagem: 'A conta de destino não foi encontrada!' });
    }

    if (senha !== acharContaDeOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha informada inválida!' });
    }

    if (!acharContaDeOrigem.saldo >= valor) {
        return res.status(404).json({ mensagem: 'Não há saldo suficiente para a transferência!' });
    }

    acharContaDeOrigem.saldo -= valor;
    acharContaDeDestino.saldo += valor;

    const transferenciaEnviada = {
        numero_conta: numero_conta_origem,
        valor: valor
    }

    const transferenciaRecebida = {
        numero_conta: numero_conta_destino,
        valor: valor
    }

    const todasTrnsferencias = {
        transferenciaEnviada,
        transferenciaRecebida
    }

    transferencias.push(todasTrnsferencias);

    return res.status(204).json();
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    const { contas } = bancoDeDados;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O envio do número da conta é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Essa conta não foi encontrada!' });
    }

    if (senha !== acharConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha informada inválida!' });
    }

    return res.status(200).json(`O saldo da conta é de: ${acharConta.saldo}`);
}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    const { contas, depositos, saques, transferencias } = bancoDeDados;

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'O envio do número da conta é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O envio da senha é obrigatório!' });
    }

    const acharConta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })

    if (!acharConta) {
        return res.status(404).json({ mensagem: 'Essa conta não foi encontrada!' });
    }

    if (senha !== acharConta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha informada inválida!' });
    }

    const resposta = {
        depositos: depositos,
        saques: saques,
        transferencias: transferencias
    }

    return res.status(200).json(resposta);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}