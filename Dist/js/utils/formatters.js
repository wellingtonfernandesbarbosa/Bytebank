import { FormatoData } from "../types/FormatoData.js";
export function formatarMoeda(saldo) {
    return saldo.toLocaleString("pt-br", { currency: "BRL", style: "currency" });
}
export function formatarData(data, formato = FormatoData.PADRAO) {
    switch (formato) {
        case FormatoData.DIA_SEMANA_DIA_MES_ANO:
            return data.toLocaleDateString("pt-br", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        case FormatoData.DIA_MES:
            return data.toLocaleDateString("pt-br", {
                day: "2-digit",
                month: "2-digit",
            });
        default:
            return data.toLocaleDateString("pt-br", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
    }
}
export function formatarInformacoes(valor, data, formatoData = FormatoData.PADRAO) {
    return `Data: ${formatarData(data, formatoData)}, Transação: ${formatarMoeda(valor)}`;
}
