import { TipoTransacao } from "./TipoTransacao.js";
let saldo = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes = JSON.parse(localStorage.getItem('transacoes'), (key, value) => {
    if (key === "data") {
        return new Date(value);
    }
    return value;
}) || [];
const depositar = (valor) => {
    if (valor <= 0) {
        throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
};
const debitar = (valor) => {
    if (valor > saldo) {
        throw new Error("Saldo insuficiente");
    }
    else if (valor === 0) {
        throw new Error("O valor a ser debitado deve ser maior que zero!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", JSON.stringify(saldo));
};
const Conta = {
    getSaldo() {
        return saldo;
    },
    getDataAcesso() {
        return new Date();
    },
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(transacoes);
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao = "";
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-br", { month: "long", year: "numeric" });
            if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        return gruposTransacoes;
    },
    registrarTransacao(novaTranscao) {
        if (novaTranscao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTranscao.valor);
        }
        else if (novaTranscao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTranscao.tipoTransacao == TipoTransacao.PAGAMENTO_DE_BOLETO) {
            debitar(novaTranscao.valor);
            novaTranscao.valor *= -1;
        }
        else {
            throw new Error('Tipo de operação desconhecido');
        }
        transacoes.push(novaTranscao);
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    },
    agruparTransacoes() {
        const resumo = {
            totalTransferencias: 0,
            totalDepositos: 0,
            totalPagamentosBoleto: 0
        };
        // this.transacoes.forEach()
        for (let transacao of transacoes) {
            switch (transacao.tipoTransacao) {
                case TipoTransacao.DEPOSITO:
                    resumo.totalDepositos += transacao.valor;
                    break;
                case TipoTransacao.TRANSFERENCIA:
                    resumo.totalTransferencias += transacao.valor;
                    break;
                case TipoTransacao.PAGAMENTO_DE_BOLETO:
                    resumo.totalPagamentosBoleto += transacao.valor;
                    break;
            }
        }
        return resumo;
    }
};
Conta.getGruposTransacoes();
export default Conta;
