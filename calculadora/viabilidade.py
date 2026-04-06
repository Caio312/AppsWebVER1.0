"""
Motor financeiro — traduzido de viabilidade.js (linhas 141-262).
Funções puras: sem DOM, sem estado global.
"""
import math


def calcular_viabilidade(dados, areas, indiretos, impostos):
    """
    Calcula viabilidade financeira completa.
    Equivalente a calcularViabilidade() em JS.

    dados: dict com cub, terreno, qtdApts, areaApt
    areas: list de dict {qtd, area, equiv}
    indiretos: list de dict {pct}
    impostos: list de dict {pct, tipo}  tipo in {"imposto","corretagem","lucro"}
    """
    area_bruta = sum(a["qtd"] * a["area"] for a in areas)
    area_equiv = sum(a["qtd"] * a["area"] * a["equiv"] for a in areas)
    area_vend  = dados["qtdApts"] * dados["areaApt"]

    custo_construcao = area_equiv * dados["cub"]
    pct_ind          = sum(i["pct"] for i in indiretos)
    custo_ind        = custo_construcao * pct_ind / 100
    custo_total      = custo_construcao + custo_ind + dados["terreno"]

    imposto_items  = [x for x in impostos if x["tipo"] == "imposto"]
    corretagem_item = next((x for x in impostos if x["tipo"] == "corretagem"), {"pct": 0})
    lucro_item      = next((x for x in impostos if x["tipo"] == "lucro"), {"pct": 0})

    pct_imp  = sum(x["pct"] for x in imposto_items)
    pct_cor  = corretagem_item["pct"]
    pct_luc  = lucro_item["pct"]
    deducoes = pct_imp + pct_cor + pct_luc

    vgv         = custo_total / (1 - deducoes / 100)
    impostos_val = vgv * pct_imp / 100
    comissao_val = vgv * pct_cor / 100
    lucro_val    = vgv * pct_luc / 100
    preco_apt    = vgv / dados["qtdApts"] if dados["qtdApts"] > 0 else 0

    custo_m2  = custo_total / area_vend if area_vend > 0 else 0
    venda_m2  = vgv / area_vend if area_vend > 0 else 0
    margem_m2 = venda_m2 - custo_m2
    viavel    = margem_m2 >= 0
    roi       = lucro_val / custo_total if custo_total > 0 else 0
    margem_pct = lucro_val / vgv if vgv > 0 else 0

    return {
        "areaBruta":        area_bruta,
        "areaTotal":        area_bruta,
        "areaEquiv":        area_equiv,
        "areaVend":         area_vend,
        "custoConstrucao":  custo_construcao,
        "pctInd":           pct_ind,
        "custoInd":         custo_ind,
        "custoTotal":       custo_total,
        "pctImp":           pct_imp,
        "pctCor":           pct_cor,
        "pctLuc":           pct_luc,
        "deducoes":         deducoes,
        "vgv":              vgv,
        "impostosVal":      impostos_val,
        "comissaoVal":      comissao_val,
        "lucroVal":         lucro_val,
        "precoApt":         preco_apt,
        "custoM2":          custo_m2,
        "vendaM2":          venda_m2,
        "margemM2":         margem_m2,
        "viavel":           viavel,
        "roi":              roi,
        "margemPct":        margem_pct,
    }


def calcular_cenario(dados, areas, indiretos, impostos,
                     d_cub=0, d_venda=0, d_terreno=0):
    """
    Calcula cenário com deltas percentuais em CUB, preço de venda e terreno.
    Equivalente a calcularCenario() em JS.
    """
    import copy
    d2 = copy.copy(dados)
    d2["cub"]     = dados["cub"]     * (1 + d_cub / 100)
    d2["terreno"] = dados["terreno"] * (1 + d_terreno / 100)

    r = calcular_viabilidade(d2, areas, indiretos, impostos)
    venda_adj = r["vgv"] * (1 + d_venda / 100)
    area_vend = dados["qtdApts"] * dados["areaApt"]

    return {
        **r,
        "vgvAdj":      venda_adj,
        "lucroAdj":    venda_adj - r["custoTotal"] - r["impostosVal"] - r["comissaoVal"],
        "vendaM2Adj":  venda_adj / area_vend if area_vend > 0 else 0,
        "viavel":      (venda_adj / area_vend) >= r["custoM2"] if area_vend > 0 else False,
    }


def calcular_tir(fluxos, max_iter=500, prec=1e-9):
    """
    TIR via Newton-Raphson.
    Equivalente a calcularTIR() em JS.
    """
    tir = 0.01
    for _ in range(max_iter):
        f  = sum(fc / math.pow(1 + tir, t) for t, fc in enumerate(fluxos))
        df = sum(-t * fc / math.pow(1 + tir, t + 1) for t, fc in enumerate(fluxos))
        if df == 0:
            return None
        dt = f / df
        tir -= dt
        if abs(dt) < prec:
            return tir
    return None


def calcular_vpl(fluxos, taxa):
    """
    VPL (Valor Presente Líquido).
    Equivalente a calcularVPL() em JS.
    """
    return sum(f / math.pow(1 + taxa, t) for t, f in enumerate(fluxos))


def gerar_fluxo_caixa(r, prazo, vv_pct, fin_pct, fases_pct=None):
    """
    Gera cronograma físico-financeiro mensal.
    Equivalente a gerarFluxoCaixa() em JS.

    r:        resultado de calcular_viabilidade()
    prazo:    duração da obra em meses
    vv_pct:   velocidade de vendas (% do VGV por mês)
    fin_pct:  percentual financiado
    fases_pct: dict com chaves fund/est/alv/ins/acab (percentuais); usa defaults se None
    """
    if fases_pct is None:
        fases_pct = {"fund": 10, "est": 35, "alv": 15, "ins": 20, "acab": 20}

    fases = [
        {"nome": "Fundação",    "pct": fases_pct.get("fund", 10), "cor": "#1B3A2D"},
        {"nome": "Estrutura",   "pct": fases_pct.get("est",  35), "cor": "#2E6B4F"},
        {"nome": "Alvenaria",   "pct": fases_pct.get("alv",  15), "cor": "#4A8C68"},
        {"nome": "Instalações", "pct": fases_pct.get("ins",  20), "cor": "#8BAF9A"},
        {"nome": "Acabamento",  "pct": fases_pct.get("acab", 20), "cor": "#C8A96E"},
    ]

    taxa_juro_fin = 0.011  # 1,1% a.m.
    custo_obra    = r["custoConstrucao"] + r["custoInd"]

    fluxos      = []
    venda_acum  = 0
    desembolso_acum = 0
    juros_acum  = 0

    for m in range(prazo):
        desembolso = custo_obra / prazo
        terreno    = (r["custoTotal"] - custo_obra) if m == 0 else 0
        receita_mes = min(vv_pct / 100 * r["vgv"], r["vgv"] - venda_acum)
        venda_acum += receita_mes
        juro_mes = (desembolso_acum * fin_pct / 100) * taxa_juro_fin
        juros_acum += juro_mes
        desembolso_acum += desembolso
        saida  = -(desembolso + terreno + juro_mes)
        entrada = receita_mes
        fluxos.append({
            "mes":    m + 1,
            "saida":  saida,
            "entrada": entrada,
            "fc":     entrada + saida,
        })

    # Meses pós-obra: vendas remanescentes
    m = prazo
    while venda_acum < r["vgv"]:
        m += 1
        rec = min(vv_pct / 100 * r["vgv"], r["vgv"] - venda_acum)
        venda_acum += rec
        fluxos.append({"mes": m, "saida": 0, "entrada": rec, "fc": rec})
        if m > 120:
            break

    return {"fluxos": fluxos, "jurosAcum": juros_acum, "fases": fases}
