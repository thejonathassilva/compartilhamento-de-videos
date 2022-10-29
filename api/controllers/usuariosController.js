const usuario = require('../models/usuarios.js');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comum');
const tokens = require('../models/tokens');
const { EmailVerificacao } = require('../models/emails');

function geraEndereco(rota, token) {
    const baseURL = process.env.BASE_URL;
    return `${baseURL}${rota}${token}`
  }

class usuarioController {

    static async criarUsuario(req, res) {
        const { nome, email, senha } = req.body;
        try {
            const emailDeUsuario = await usuario.find( { email: email } );
            console.log('usuario' + emailDeUsuario)
            console.log(emailDeUsuario.usuario)
            console.log(email)
            if (emailDeUsuario.email == email) {
                console.log('entrou')
                throw new InvalidArgumentError('O usuário ja existe');
            }
            const cadastro = { 
                nome: nome, 
                email: email, 
                senha: this.adicionaSenha(senha), 
                emailVerificado: false
            }
            const usuarioCriado = await usuario.create(cadastro);

            const token = tokens.verificacaoEmail.cria(usuarioCriado._id);
            const endereco = geraEndereco('/usuario/verifica_email/', token);
            const emailVerificacao = new EmailVerificacao(usuario, endereco);
            emailVerificacao.enviaEmail().catch(console.log);

            return res.status(201).json();
        } catch (error) {
            if(error instanceof InvalidArgumentError) {
                return res.status(422).json({ error: error.message });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }
    }

    static async login(req, res) {
        try {
            const acessToken = tokens.acess.cria(req.user._id);
            const refreshToken = await tokens.refresh.cria(req.user._id);
            res.set('Authorization', acessToken);
            return res.status(200).send({ refreshToken })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }        

    static async logout(req, res) {
        try {
            const token = req.token;
            await tokens.acess.invalida(token);
            return res.status(204).send();
        } catch(error) {
            return res.status(500).json({ error: error.message })
        }
    }

    static async buscaPorEmail(email) {
        const emailDeUsuario = await usuario.find( { email: { $eq: email } } );
        if(!emailDeUsuario) {
            return null;
        }
    }

    async adicionaSenha(senha) {
        validacoes.campoStringNaoNulo(senha, 'senha');
        validacoes.campoTamanhoMinimo(senha, 'senha', 8);
        validacoes.campoTamanhoMaximo(senha, 'senha', 64);

        await usuario.gerarSenhaHash(senha);
    }

    async gerarSenhaHash(senha) {
        const custoHash = 12;
        return bcrypt.hash(senha, custoHash);
    }

    static async atualizaUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;
        try {
            if (email) {
                throw new InvalidArgumentError('Não é possivel modificar o e-mail, favor entrar em contato com o administrador');
            }
            const atualizacao = { 
                nome: nome, 
                senha: usuario.adicionaSenha(senha), 
            }
            await usuario.findByIdAndUpdate(id, {$set: atualizacao});
            const usuarioAtualizado = await usuario.findById(id);
            return res.status(200).json(usuarioAtualizado);
        } catch (error) {
            if(error instanceof InvalidArgumentError) {
                return res.status(422).json({ error: error.message });
            } else {
                return res.status(500).json({ error: error.message })
            }
        }
    }

    static async deletaUsuario(req, res) {
        const { id } = req.params;
        try {
            await usuario.findByIdAndDelete(id);
            return res.status(200).send('Usuario deletado com sucesso!');
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = usuarioController;

