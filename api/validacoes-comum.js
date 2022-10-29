const { InvalidArgumentError } = require('./erros');

module.exports = {
    campoStringNaoNulo: (valor, nome) => {
        if(typeof valor !== 'string' || valor === 0 || valor == '') {
            throw new InvalidArgumentError(`É necessário preencher o campo ${nome}!`);
        }
    },

    campoTamanhoMinimo: (valor, nome, minimo) => {
        if(valor.length < minimo) {
            throw new InvalidArgumentError(`O campo ${nome} precisa ser maior que o ${minimo} de catacteres!`);
        }
    },

    campoTamanhoMaximo: (valor, nome, maximo) => {
        if(valor.length > maximo) {
            throw new InvalidArgumentError(`O campo ${nome} precisa ser menor que o ${maximo} de caracteres!`)
        }
    }
}