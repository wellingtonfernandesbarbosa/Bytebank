import Conta from "../types/Conta.js";
import { formatarInformacoes } from "../utils/formatters.js";
import ExtratoComponent from "./extrato-component.js";
import SaldoComponent from "./saldo-component.js";
import { FormatoData } from "../types/FormatoData.js";
console.log('Valor total de depósitos: ' + Conta.agruparTransacoes().totalDepositos);
console.log('Valor total de transferências: ' + Conta.agruparTransacoes().totalTransferencias);
console.log('Valor total de pagamentos de boletos: ' + Conta.agruparTransacoes().totalPagamentosBoleto);
console.log(formatarInformacoes(42, new Date(), FormatoData.DIA_SEMANA_DIA_MES_ANO));
const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', event => {
    try {
        event.preventDefault();
        if (!elementoFormulario.checkValidity()) {
            alert('Por favor, preencha todas as informações solicitadas!');
            return;
        }
        const inputTipoTransacao = elementoFormulario.querySelector("#tipoTransacao");
        const inputValor = elementoFormulario.querySelector('#valor');
        const inputData = elementoFormulario.querySelector('#data');
        const tipoTransacao = inputTipoTransacao.value;
        const valor = inputValor.valueAsNumber;
        const data = new Date(inputData.value + " 00:00:00");
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data
        };
        Conta.registrarTransacao(novaTransacao);
        Conta.agruparTransacoes();
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        elementoFormulario.reset();
    }
    catch (error) {
        console.log(error.message);
    }
});
