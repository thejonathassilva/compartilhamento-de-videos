const categoria = require('../models/categoria');
const { InvalidArgumentError } = require('../erros');
const validacoes = require('../validacoes-comum');

class categoriaController {

    static async listarCategorias(req, res) {
        try {
            const todasAsCategorias = await categoria.find({});
            return res.status(200).json(todasAsCategorias);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async listarUmaCategoria(req, res) {
        const { id } = req.params;
        try {
            const umaCategoria = await categoria.findById(id);
            return res.status(200).json(umaCategoria);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async cadastrarCategoria(req, res) {
        let novaCategoria  = req.body;
        try {
            validacoes.campoStringNaoNulo(novaCategoria.titulo, 'titulo');
            validacoes.campoTamanhoMinimo(novaCategoria.titulo, 'titulo', 3);
            validacoes.campoStringNaoNulo(novaCategoria.cor, 'cor');
            const categoriaCriada = await categoria.create(novaCategoria);
            return res.status(200).json(categoriaCriada);
        } catch (error) {
            if (error instanceof InvalidArgumentError) {
                return res.status(422).json({ error: error.message })
            } else {
                return res.status(500).json(error.message);
            }
        }
    }

    static async atualizarCategoria(req, res) {
        const { id } = req.params;
        try {
            await categoria.findByIdAndUpdate(id, {$set: req.body})
            const categoriaAtualizada = await categoria.findById(id);
            return res.status(200).json(categoriaAtualizada);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async deletarCategoria(req, res) {
        const { id } = req.params;
        try {
            await categoria.findByIdAndDelete(id);
            return res.status(200).json({ message: `Categoria de Id ${id} deletado com sucesso!`})
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = categoriaController;