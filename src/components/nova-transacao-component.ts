import Conta from "../types/Conta.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import { Transacao } from "../types/Transacao.js";
import { formatarInformacoes } from "../utils/formatters.js";
import ExtratoComponent from "./extrato-component.js";
import SaldoComponent from "./saldo-component.js";
import { FormatoData } from "../types/FormatoData.js";

console.log('Valor total de depósitos: ' + Conta.agruparTransacoes().totalDepositos)
console.log('Valor total de transferências: ' + Conta.agruparTransacoes().totalTransferencias)
console.log('Valor total de pagamentos de boletos: ' + Conta.agruparTransacoes().totalPagamentosBoleto)
console.log(formatarInformacoes(42, new Date(), FormatoData.DIA_SEMANA_DIA_MES_ANO))

const elementoFormulario = document.querySelector('.block-nova-transacao form') as HTMLFormElement;

elementoFormulario.addEventListener('submit', event => {
  try {
    event.preventDefault();
    if (!elementoFormulario.checkValidity()) {
      alert('Por favor, preencha todas as informações solicitadas!');
      return;
    }
  
    const inputTipoTransacao = elementoFormulario.querySelector("#tipoTransacao") as HTMLSelectElement;
    const inputValor = elementoFormulario.querySelector('#valor') as HTMLInputElement;
    const inputData = elementoFormulario.querySelector('#data') as HTMLInputElement;
    
    const tipoTransacao : TipoTransacao = inputTipoTransacao.value as TipoTransacao;
    const valor : number = inputValor.valueAsNumber;
    const data : Date = new Date(inputData.value + " 00:00:00");
    
    const novaTransacao: Transacao = {
      tipoTransacao: tipoTransacao,
      valor: valor,
      data: data
    }
    
    Conta.registrarTransacao(novaTransacao);
    Conta.agruparTransacoes();

    
    SaldoComponent.atualizar();
    ExtratoComponent.atualizar();
    elementoFormulario.reset();
    
  } catch (error) {
    console.log(error.message)
  }
})
