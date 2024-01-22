import Conta from "../types/Conta.js";
import { formatarMoeda } from "../utils/formatters.js";
const elementoSaldo = document.querySelector('.cc .valor');
renderizarSaldo();
function renderizarSaldo() {
    if (elementoSaldo) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
}
const SaldoComponent = {
    atualizar: () => {
        renderizarSaldo();
    }
};
export default SaldoComponent;
