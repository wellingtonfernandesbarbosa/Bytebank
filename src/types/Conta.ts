import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";


let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;

const transacoes: Transacao [] = JSON.parse(localStorage.getItem('transacoes'), (key: string, value: string) => {
  if (key === "data") {
    return new Date(value);
  }

  return value;
}) || [];

const depositar = (valor: number) => {
  if (valor <= 0) {
    throw new Error("O valor a ser depositado deve ser maior que zero!");
  }

  saldo += valor;
  localStorage.setItem("saldo", JSON.stringify(saldo));
};

const debitar = (valor: number) => {
  if (valor > saldo) {
    throw new Error("Saldo insuficiente");
  } else if (valor === 0) {
    throw new Error("O valor a ser debitado deve ser maior que zero!");
  }

  saldo -= valor;
  localStorage.setItem("saldo", JSON.stringify(saldo));
}

const Conta = {
  getSaldo() {
    return saldo;
  },

  getDataAcesso() {
    return new Date();
  },

  getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes = structuredClone(transacoes);
    const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime())
    
    let labelAtualGrupoTransacao: string = "";

    for (let transacao of transacoesOrdenadas) {
      let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", {month: "long", year: "numeric"});

      if (labelAtualGrupoTransacao !== labelGrupoTransacao) {
        labelAtualGrupoTransacao = labelGrupoTransacao;
        gruposTransacoes.push({
          label: labelGrupoTransacao,
          transacoes: []
        })
      }

      gruposTransacoes.at(-1).transacoes.push(transacao);
    }

    return gruposTransacoes;
  },

  registrarTransacao(novaTranscao: Transacao): void {
    if (novaTranscao.tipoTransacao == TipoTransacao.DEPOSITO){
      depositar(novaTranscao.valor);
    } else if (novaTranscao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTranscao.tipoTransacao == TipoTransacao.PAGAMENTO_DE_BOLETO) {
      debitar(novaTranscao.valor);
      novaTranscao.valor *= -1;
    } else {
      throw new Error('Tipo de operação desconhecido');
    }

    transacoes.push(novaTranscao);
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  },

  agruparTransacoes(): ResumoTransacoes {
    const resumo: ResumoTransacoes = {
      totalTransferencias: 0,
      totalDepositos: 0,
      totalPagamentosBoleto: 0
    }

    // this.transacoes.forEach()

    for (let transacao of transacoes) {
      switch(transacao.tipoTransacao){
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
}

Conta.getGruposTransacoes();
export default Conta;
