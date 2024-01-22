import Conta from "../types/Conta.js";
import { FormatoData } from "../types/FormatoData.js";
import { formatarData } from "../utils/formatters.js";

const elementoDataAcesso = document.querySelector(".block-saldo time");

renderizarData();
function renderizarData(): void {
  if (elementoDataAcesso) {
    elementoDataAcesso.textContent = formatarData(Conta.getDataAcesso(), FormatoData.DIA_SEMANA_DIA_MES_ANO);
  }
}

const DataComponent = {
  atualizar: () => {
    return renderizarData()
  }
}

export default DataComponent;