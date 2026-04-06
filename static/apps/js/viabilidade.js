'use strict';

// ====================================================
// CAMADA 1 — TIPOLOGIAS (banco de empreendimentos)
// ====================================================
const TIPOLOGIAS = {
  condhoriz: {
    label:"Condomínio Horizontal ",
    cliente:"xxxx", obra:"Condomínio xxxxx", local:"São Luís — MA",
    cub:2096.27, terreno:1500000, qtdApts:14, areaApt:120, precoMercado:8617,
    areas:[
      {nome:"Casas Residenciais",  qtd:14, area:120,    equiv:1.00},
      {nome:"Portaria",            qtd:1,  area:33.99,  equiv:1.00},
      {nome:"Estacionamento",      qtd:1,  area:100,    equiv:0.10},
      {nome:"Lixeira",             qtd:1,  area:31.95,  equiv:0.75},
      {nome:"Área de Lazer",       qtd:1,  area:444.05, equiv:0.50},
      {nome:"Reservatório",        qtd:1,  area:64.20,  equiv:0.50},
    ],
    indiretos:[
      {nome:"Adm. central",pct:2.0},{nome:"Adm. local",pct:3.5},
      {nome:"Mobilização/desmob.",pct:1.5},{nome:"Despesas financeiras",pct:1.5},
      {nome:"Riscos e eventuais",pct:1.5},{nome:"Mov. de terra",pct:4.0},
      {nome:"Projetos (arq/est/inst)",pct:4.0},
    ],
    impostos:[
      {nome:"PIS",pct:0.65,tipo:"imposto"},
      {nome:"COFINS",pct:3.0,tipo:"imposto"},
      {nome:"ISS",pct:5.0,tipo:"imposto"},
      {nome:"IRPJ",pct:1.2,tipo:"imposto"},
      {nome:"CSLL",pct:1.08,tipo:"imposto"},
      {nome:"Corretagem",pct:6.0,tipo:"corretagem"},
      {nome:"Lucro requerido",pct:35.0,tipo:"lucro"},
    ],
  },
  vertical: {
    label:"Edifício Residencial Vertical",
    cliente:"", obra:"Residencial Alto", local:"São Luís — MA",
    cub:1866.08, terreno:2000000, qtdApts:32, areaApt:80, precoMercado:8617,
    areas:[
      {nome:"Apartamentos (8 pav × 4 apts)",qtd:32,area:80,equiv:1.00},
      {nome:"Hall/Circulação",qtd:8,area:40,equiv:0.50},
      {nome:"Garagem coberta",qtd:32,area:12.5,equiv:0.50},
      {nome:"Área de lazer",qtd:1,area:300,equiv:0.50},
      {nome:"Reservatório/Casa de máq.",qtd:1,area:60,equiv:0.50},
    ],
    indiretos:[
      {nome:"Adm. central",pct:2.0},{nome:"Adm. local",pct:4.0},
      {nome:"Mobilização/desmob.",pct:1.0},{nome:"Despesas financeiras",pct:2.0},
      {nome:"Riscos e eventuais",pct:1.5},{nome:"Projetos",pct:5.0},
      {nome:"Elevadores (excl. CUB)",pct:3.0},
    ],
    impostos:[
      {nome:"PIS",pct:0.65,tipo:"imposto"},{nome:"COFINS",pct:3.0,tipo:"imposto"},
      {nome:"ISS",pct:5.0,tipo:"imposto"},{nome:"IRPJ",pct:1.2,tipo:"imposto"},
      {nome:"CSLL",pct:1.08,tipo:"imposto"},{nome:"Corretagem",pct:6.0,tipo:"corretagem"},
      {nome:"Lucro requerido",pct:20.0,tipo:"lucro"},
    ],
  },
  mcmv: {
    label:"MCMV / Habitação de Interesse Social",
    cliente:"", obra:"Residencial Popular", local:"São Luís — MA",
    cub:1915.89, terreno:500000, qtdApts:48, areaApt:48, precoMercado:4500,
    areas:[
      {nome:"Apartamentos HIS",qtd:48,area:48,equiv:1.00},
      {nome:"Circulação/Hall",qtd:4,area:30,equiv:0.50},
      {nome:"Estacionamento descoberto",qtd:24,area:12,equiv:0.10},
    ],
    indiretos:[
      {nome:"Adm. central",pct:1.5},{nome:"Adm. local",pct:3.0},
      {nome:"Mobilização/desmob.",pct:0.5},{nome:"Riscos e eventuais",pct:1.0},
      {nome:"Projetos",pct:3.0},
    ],
    impostos:[
      {nome:"PIS (RET MCMV)",pct:0.50,tipo:"imposto"},{nome:"COFINS (RET MCMV)",pct:0.50,tipo:"imposto"},
      {nome:"ISS",pct:3.0,tipo:"imposto"},{nome:"IRPJ (RET)",pct:0.29,tipo:"imposto"},
      {nome:"CSLL (RET)",pct:0.26,tipo:"imposto"},{nome:"Corretagem",pct:4.0,tipo:"corretagem"},
      {nome:"Lucro requerido",pct:12.0,tipo:"lucro"},
    ],
  },
  comercial: {
    label:"Comercial / Sala e Loja",
    cliente:"", obra:"Centro Comercial", local:"São Luís — MA",
    cub:1866.82, terreno:1200000, qtdApts:20, areaApt:60, precoMercado:7000,
    areas:[
      {nome:"Salas comerciais",qtd:20,area:60,equiv:1.00},
      {nome:"Lojas térreas",qtd:4,area:80,equiv:1.00},
      {nome:"Circulação/Hall",qtd:1,area:200,equiv:0.50},
      {nome:"Estacionamento",qtd:24,area:13,equiv:0.50},
    ],
    indiretos:[
      {nome:"Adm. central",pct:2.0},{nome:"Adm. local",pct:4.0},
      {nome:"Despesas financeiras",pct:2.0},{nome:"Riscos e eventuais",pct:1.5},
      {nome:"Projetos especiais",pct:5.0},
    ],
    impostos:[
      {nome:"PIS",pct:0.65,tipo:"imposto"},{nome:"COFINS",pct:3.0,tipo:"imposto"},
      {nome:"ISS",pct:5.0,tipo:"imposto"},{nome:"IRPJ",pct:1.2,tipo:"imposto"},
      {nome:"CSLL",pct:1.08,tipo:"imposto"},{nome:"Corretagem",pct:6.0,tipo:"corretagem"},
      {nome:"Lucro requerido",pct:25.0,tipo:"lucro"},
    ],
  },
  custom: {
    label:"Personalizado",
    cliente:"", obra:"Meu Empreendimento", local:"",
    cub:2096.27, terreno:500000, qtdApts:10, areaApt:100, precoMercado:8617,
    areas:[{nome:"Área principal",qtd:10,area:100,equiv:1.00}],
    indiretos:[
      {nome:"Adm. central",pct:2.0},{nome:"Adm. local",pct:3.5},
      {nome:"Projetos",pct:4.0},{nome:"Riscos e eventuais",pct:1.5},
    ],
    impostos:[
      {nome:"PIS",pct:0.65,tipo:"imposto"},{nome:"COFINS",pct:3.0,tipo:"imposto"},
      {nome:"ISS",pct:5.0,tipo:"imposto"},{nome:"IRPJ",pct:1.2,tipo:"imposto"},
      {nome:"CSLL",pct:1.08,tipo:"imposto"},{nome:"Corretagem",pct:6.0,tipo:"corretagem"},
      {nome:"Lucro requerido",pct:20.0,tipo:"lucro"},
    ],
  },
};

// Estado vivo (mutável pelo usuário)
let AREAS = JSON.parse(JSON.stringify(TIPOLOGIAS.condhoriz.areas));
let INDIRETOS = JSON.parse(JSON.stringify(TIPOLOGIAS.condhoriz.indiretos));
let IMPOSTOS  = JSON.parse(JSON.stringify(TIPOLOGIAS.condhoriz.impostos));

const PIE_COLORS=["#2E6B4F","#C8A96E","#1B3A2D","#8BAF9A","#E8D5B0","#4A8C68","#A0C4AD","#D4B896"];

// ====================================================
// UTILITÁRIOS
// ====================================================
const fmt   = v => "R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtM  = v => v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})+" m²";
const fmtP  = v => v.toFixed(2)+"%";
const fmtPn = v => (v>=0?"+":"")+v.toFixed(1)+"%";
const $     = id => document.getElementById(id);
const set   = (id,v)=>{ const e=$(id); if(e) e.textContent=v; };
const html  = (id,v)=>{ const e=$(id); if(e) e.innerHTML=v; };

// ====================================================
// CAMADA 2 — MOTOR FINANCEIRO (puro, sem DOM)
// ====================================================
function calcularViabilidade(dados, areas, indiretos, impostos){
  const areaBruta  = areas.reduce((s,a)=>s+a.qtd*a.area,0);
  const areaTotal  = areaBruta;
  const areaEquiv  = areas.reduce((s,a)=>s+(a.qtd*a.area*a.equiv),0);
  const areaVend   = dados.qtdApts * dados.areaApt;

  const custoConstrucao = areaEquiv * dados.cub;
  const pctInd          = indiretos.reduce((s,i)=>s+i.pct,0);
  const custoInd        = custoConstrucao * pctInd / 100;
  const custoTotal      = custoConstrucao + custoInd + dados.terreno;

  const impostoItems  = impostos.filter(x=>x.tipo==="imposto");
  const corretagemItem= impostos.find(x=>x.tipo==="corretagem") || {pct:0};
  const lucroItem     = impostos.find(x=>x.tipo==="lucro") || {pct:0};

  const pctImp  = impostoItems.reduce((s,i)=>s+i.pct,0);
  const pctCor  = corretagemItem.pct;
  const pctLuc  = lucroItem.pct;
  const deducoes= pctImp + pctCor + pctLuc;

  const vgv        = custoTotal / (1 - deducoes/100);
  const impostosVal= vgv * pctImp / 100;
  const comissaoVal= vgv * pctCor / 100;
  const lucroVal   = vgv * pctLuc / 100;
  const precoApt   = dados.qtdApts > 0 ? vgv / dados.qtdApts : 0;

  const custoM2  = areaVend > 0 ? custoTotal / areaVend : 0;
  const vendaM2  = areaVend > 0 ? vgv / areaVend : 0;
  const margemM2 = vendaM2 - custoM2;
  const viavel   = margemM2 >= 0;
  const roi      = custoTotal > 0 ? lucroVal / custoTotal : 0;
  const margemPct= vgv > 0 ? lucroVal / vgv : 0;

  return {
    areaBruta,areaTotal,areaEquiv,areaVend,
    custoConstrucao,pctInd,custoInd,custoTotal,
    pctImp,pctCor,pctLuc,deducoes,
    vgv,impostosVal,comissaoVal,lucroVal,precoApt,
    custoM2,vendaM2,margemM2,viavel,roi,margemPct,
  };
}

function calcularCenario(dados,areas,indiretos,impostos,dCub,dVenda,dTerreno){
  const d2 = {
    ...dados,
    cub:     dados.cub * (1 + dCub/100),
    terreno: dados.terreno * (1 + dTerreno/100),
  };
  const r = calcularViabilidade(d2, areas, indiretos, impostos);
  const vendaAdj = r.vgv * (1 + dVenda/100);
  return {
    ...r,
    vgvAdj:    vendaAdj,
    lucroAdj:  vendaAdj - r.custoTotal - r.impostosVal - r.comissaoVal,
    vendaM2Adj: dados.qtdApts*dados.areaApt > 0 ? vendaAdj/(dados.qtdApts*dados.areaApt) : 0,
    viavel:    (vendaAdj/(dados.qtdApts*dados.areaApt)) >= r.custoM2,
  };
}

// TIR por Newton-Raphson
function calcularTIR(fluxos, maxIter=500, prec=1e-9){
  let tir = 0.01;
  for(let i=0;i<maxIter;i++){
    let f=0, df=0;
    fluxos.forEach((fc,t)=>{ f+=fc/Math.pow(1+tir,t); df-=t*fc/Math.pow(1+tir,t+1); });
    const dt = f/df;
    tir -= dt;
    if(Math.abs(dt)<prec) return tir;
  }
  return null;
}

function calcularVPL(fluxos, taxa){
  return fluxos.reduce((acc,f,t)=> acc + f/Math.pow(1+taxa,t), 0);
}

// Cronograma físico-financeiro simplificado
function gerarFluxoCaixa(r, prazo, vv, finPct){
  const fases = [
    {nome:"Fundação",       pct:parseFloat($("fc-fund").value)||10, cor:"#1B3A2D"},
    {nome:"Estrutura",      pct:parseFloat($("fc-est").value)||35,  cor:"#2E6B4F"},
    {nome:"Alvenaria",      pct:parseFloat($("fc-alv").value)||15,  cor:"#4A8C68"},
    {nome:"Instalações",    pct:parseFloat($("fc-ins").value)||20,  cor:"#8BAF9A"},
    {nome:"Acabamento",     pct:parseFloat($("fc-acab").value)||20, cor:"#C8A96E"},
  ];
  const totalFasePct = fases.reduce((s,f)=>s+f.pct,0);
  const custoObra = r.custoConstrucao + r.custoInd;
  const taxaJuroFin = 0.011; // 1,1% a.m.
  const finVal = custoObra * finPct/100;
  const propFase = prazo / totalFasePct;

  let fluxos = [];
  let vendaAcum = 0;
  let desembolsoAcum = 0;
  let jurosAcum = 0;

  for(let m=0;m<prazo;m++){
    // Desembolso: distribui proporcionalmente nas fases ao longo do prazo
    const desembolso = (custoObra / prazo);
    // Terreno: pago no mês 0
    const terreno = m === 0 ? r.custoTotal - custoObra : 0;
    // Receita de vendas
    const receitaMes = Math.min(vv/100 * r.vgv, r.vgv - vendaAcum);
    vendaAcum += receitaMes;
    // Juros sobre financiamento
    const juroMes = (desembolsoAcum * finPct/100) * taxaJuroFin;
    jurosAcum += juroMes;
    desembolsoAcum += desembolso;
    const saida = -(desembolso + terreno + juroMes);
    const entrada = receitaMes;
    fluxos.push({mes:m+1, saida, entrada, fc: entrada + saida});
  }
  // Meses após obra (vendas remanescentes)
  while(vendaAcum < r.vgv){
    const m = fluxos.length + 1;
    const rec = Math.min(vv/100 * r.vgv, r.vgv - vendaAcum);
    vendaAcum += rec;
    fluxos.push({mes:m, saida:0, entrada:rec, fc:rec});
    if(m > 120) break;
  }
  return {fluxos, jurosAcum, fases};
}

// ====================================================
// CAMADA 3 — INTERFACE (apenas atualiza DOM)
// ====================================================
function getDados(){
  return {
    cub:          parseFloat($("cub").value)||0,
    terreno:      parseFloat($("terreno").value)||0,
    qtdApts:      parseFloat($("qtd-apts").value)||0,
    areaApt:      parseFloat($("area-apt").value)||0,
    precoMercado: parseFloat($("preco-mercado").value)||8617,
  };
}

function render(){
  const dados = getDados();
  const r = calcularViabilidade(dados, AREAS, INDIRETOS, IMPOSTOS);
  atualizarEntrada(r, dados);
  atualizarResultado(r, dados);
  atualizarPDF(r, dados);
  renderScenarios();
  renderFluxo();
  renderSensib();
}

function atualizarEntrada(r, dados){
  // Totais da tabela
  set("ft-area-bruta", fmtM(r.areaBruta));
  set("ft-area-total", fmtM(r.areaTotal));
  set("ft-area-equiv", fmtM(r.areaEquiv));
  AREAS.forEach((a,i)=>{
    const tot = a.qtd * a.area;
    const eq  = tot * a.equiv;
    const e1 = $("pav-tot-"+i); if(e1) e1.textContent=fmtM(tot);
    const e2 = $("pav-eq-"+i);  if(e2) e2.textContent=fmtM(eq);
    const e3 = $("pav-pct-"+i); if(e3) e3.textContent=r.areaBruta>0?((tot/r.areaBruta)*100).toFixed(1)+"%":"—";
  });
  // Métricas
  set("r-area-bruta",  fmtM(r.areaBruta));
  set("r-area-total",  fmtM(r.areaTotal));
  set("r-area-equiv",  fmtM(r.areaEquiv));
  set("r-area-vend",   fmtM(r.areaVend));
  set("r-pct-ind",     fmtP(r.pctInd));
  set("r-custo-constr",fmt(r.custoConstrucao));
  set("r-pct-imp",     fmtP(r.pctImp));
  set("r-pct-cor",     fmtP(r.pctCor));
  set("r-pct-ded",     fmtP(r.deducoes));
  // Pie
  const pd=[], pl=[];
  AREAS.forEach(a=>{ pd.push(a.qtd*a.area); pl.push(a.nome); });
  drawPie("pie-chart","chart-legend",pd,pl,PIE_COLORS,72);
  drawPie("pdf-pie","pdf-pie-legend",pd,pl,PIE_COLORS,50);
}

function atualizarResultado(r, dados){
  set("s-constr",       fmt(r.custoConstrucao));
  set("s-constr-det",   fmtM(r.areaEquiv)+" × "+fmt(dados.cub)+"/m²");
  set("s-indiretos",    fmt(r.custoInd));
  set("s-terreno",      fmt(dados.terreno));
  set("s-custo-total",  fmt(r.custoTotal));
  set("s-custo-m2-det", fmt(r.custoM2)+"/m²");
  set("s-impostos",     fmt(r.impostosVal));
  set("s-comissao",     fmt(r.comissaoVal));
  set("s-lucro",        fmt(r.lucroVal));
  set("s-preco-final",  fmt(r.vgv));
  set("s-preco-apt",    fmt(r.precoApt));
  set("s-preco-apt-sub",dados.qtdApts>0?`${dados.qtdApts} unidades · ${dados.areaApt} m² cada`:"—");
  set("s-custo-m2",     fmt(r.custoM2)+"/m²");
  set("s-venda-m2",     fmt(r.vendaM2)+"/m²");
  set("s-mercado-m2",   fmt(dados.precoMercado)+"/m²");
  set("s-lucro2",       fmt(r.lucroVal));
  set("v-custo-m2",     fmt(r.custoM2)+"/m²");
  set("v-venda-m2",     fmt(r.vendaM2)+"/m²");
  const mEl=$("v-margem-m2");
  if(mEl){mEl.textContent=fmt(r.margemM2)+"/m²";mEl.style.color=r.viavel?"var(--success)":"var(--danger)";}
  const strip=$("viavel-strip");
  if(strip) strip.className="viavel "+(r.viavel?"yes":"no");
  set("viavel-text", r.viavel?"✓  Empreendimento Viável":"✗  Empreendimento Inviável");
  set("viavel-val",  fmt(r.margemM2)+"/m²");
  // Mercado
  const dif = dados.precoMercado > 0 ? ((r.vendaM2/dados.precoMercado-1)*100) : 0;
  const mktMsg = r.vendaM2 > 0 ? (r.vendaM2 <= dados.precoMercado
    ? `✅ Preço calculado (${fmt(r.vendaM2)}/m²) está ${Math.abs(dif).toFixed(1)}% ABAIXO do mercado (${fmt(dados.precoMercado)}/m²) — produto competitivo. Fonte: FipeZAP Dez/2025.`
    : `⚠️ Preço calculado (${fmt(r.vendaM2)}/m²) está ${Math.abs(dif).toFixed(1)}% ACIMA do mercado (${fmt(dados.precoMercado)}/m²). Revisar margens ou custos. Fonte: FipeZAP Dez/2025.`)
    : "—";
  set("mkt-box", mktMsg);
  // KPIs
  set("kpi-vgv",        fmt(r.vgv));
  set("kpi-custo",      fmt(r.custoTotal));
  set("kpi-lucro",      fmt(r.lucroVal));
  const mpEl=$("kpi-margem-pct");
  if(mpEl){mpEl.textContent=fmtP(r.margemPct*100);mpEl.className="metric-val"+(r.margemPct>0.10?" green":r.margemPct>0?" gold":" red");}
  const roiEl=$("kpi-roi");
  if(roiEl){roiEl.textContent=fmtP(r.roi*100);roiEl.className="metric-val"+(r.roi>0.15?" green":r.roi>0?" gold":" red");}
}

function renderScenarios(){
  const dados = getDados();
  const defs = [
    {id:"sc-opt-body", cls:"opt", label:"⬆ OTIMISTA",
      dCub:parseFloat($("sc-cub-ot").value)||0,
      dV:  parseFloat($("sc-venda-ot").value)||0,
      dT:  parseFloat($("sc-ter-ot").value)||0},
    {id:"sc-re-body",  cls:"real",label:"◆ REALISTA",
      dCub:parseFloat($("sc-cub-re").value)||0,
      dV:  parseFloat($("sc-venda-re").value)||0,
      dT:  parseFloat($("sc-ter-re").value)||0},
    {id:"sc-pe-body",  cls:"pess",label:"⬇ PESSIMISTA",
      dCub:parseFloat($("sc-cub-pe").value)||0,
      dV:  parseFloat($("sc-venda-pe").value)||0,
      dT:  parseFloat($("sc-ter-pe").value)||0},
  ];
  defs.forEach(d=>{
    const r = calcularCenario(dados,AREAS,INDIRETOS,IMPOSTOS,d.dCub,d.dV,d.dT);
    const v = r.viavel ? "✓ Viável" : "✗ Inviável";
    html(d.id,`
      <div class="sc-row"><span class="sl">CUB adotado</span><span class="sv">${fmtP(100+d.dCub)} (${fmtPn(d.dCub)})</span></div>
      <div class="sc-row"><span class="sl">Custo construção</span><span class="sv">${fmt(r.custoConstrucao)}</span></div>
      <div class="sc-row"><span class="sl">Custo total</span><span class="sv">${fmt(r.custoTotal)}</span></div>
      <div class="sc-row"><span class="sl">VGV ajustado</span><span class="sv">${fmt(r.vgvAdj||r.vgv)}</span></div>
      <div class="sc-row"><span class="sl">Venda/m²</span><span class="sv">${fmt(r.vendaM2Adj||r.vendaM2)}/m²</span></div>
      <div class="sc-row"><span class="sl">Custo/m²</span><span class="sv">${fmt(r.custoM2)}/m²</span></div>
      <div class="sc-row"><span class="sl">Margem/m²</span><span class="sv">${fmt((r.vendaM2Adj||r.vendaM2)-r.custoM2)}/m²</span></div>
      <div class="sc-row"><span class="sl">Lucro total</span><span class="sv">${fmt(r.lucroAdj||r.lucroVal)}</span></div>
      <div class="sc-row"><span class="sl">Veredicto</span><span class="sv">${v}</span></div>
    `);
  });
  // PDF cenários
  let pdfSc = "";
  const scLabels = ["OTIMISTA","REALISTA","PESSIMISTA"];
  const scCls   = ["opt","real","pess"];
  defs.forEach((d,i)=>{
    const r = calcularCenario(dados,AREAS,INDIRETOS,IMPOSTOS,d.dCub,d.dV,d.dT);
    pdfSc += `<div class="pdf-sc-c ${scCls[i]}">
      <div class="pdf-sc-t">${scLabels[i]}</div>
      <div class="pdf-sc-r"><span>CUB</span><span>${fmtPn(d.dCub)}</span></div>
      <div class="pdf-sc-r"><span>VGV</span><span>${fmt(r.vgvAdj||r.vgv)}</span></div>
      <div class="pdf-sc-r"><span>Venda/m²</span><span>${fmt(r.vendaM2Adj||r.vendaM2)}/m²</span></div>
      <div class="pdf-sc-r"><span>Custo/m²</span><span>${fmt(r.custoM2)}/m²</span></div>
      <div class="pdf-sc-r"><span>Margem/m²</span><span>${fmt((r.vendaM2Adj||r.vendaM2)-r.custoM2)}/m²</span></div>
      <div class="pdf-sc-r"><span>Lucro</span><span>${fmt(r.lucroAdj||r.lucroVal)}</span></div>
      <div class="pdf-sc-r"><span>Veredicto</span><span>${r.viavel?"✓ Viável":"✗ Inviável"}</span></div>
    </div>`;
  });
  html("pdf-sc-cards", pdfSc);
}

function renderFluxo(){
  const dados = getDados();
  const r = calcularViabilidade(dados, AREAS, INDIRETOS, IMPOSTOS);
  const prazo = parseInt($("fc-prazo").value)||18;
  const vv    = parseFloat($("fc-vv").value)||6;
  const tma   = parseFloat($("fc-tma").value)||1.0;
  const finPct= parseFloat($("fc-fin").value)||0;

  const {fluxos, jurosAcum, fases} = gerarFluxoCaixa(r, prazo, vv, finPct);
  const fcVals = fluxos.map(f=>f.fc);
  // Inclui investimento inicial (terreno) como negativo no mês 0
  const fluxosVPL = [-(dados.terreno), ...fcVals];
  const tir = calcularTIR(fluxosVPL);
  const vpl = calcularVPL(fluxosVPL, tma/100);
  const tirAnual = tir !== null ? Math.pow(1+tir,12)-1 : null;
  // Payback: mês em que o fluxo acumulado fica positivo
  let acum = 0, payback = null;
  fluxos.forEach((f,i)=>{ acum+=f.fc; if(payback===null && acum>=0) payback=i+1; });

  // KPIs
  const vplEl=$("kpi-vpl"); if(vplEl){vplEl.textContent=fmt(vpl);vplEl.className="kpi-val"+(vpl>=0?" green":" red");}
  const tirMEl=$("kpi-tir-m");
  if(tirMEl && tir!==null){tirMEl.textContent=fmtP(tir*100);tirMEl.className="kpi-val"+(tir>tma/100?" green":" red");}
  else if(tirMEl) tirMEl.textContent="N/D";
  const tirAEl=$("kpi-tir-a");
  if(tirAEl && tirAnual!==null){tirAEl.textContent=fmtP(tirAnual*100);tirAEl.className="kpi-val"+(tirAnual>0.12?" green":" red");}
  else if(tirAEl) tirAEl.textContent="N/D";
  set("kpi-payback", payback ? payback+" meses" : ">"+fluxos.length+" m");
  set("kpi-juro",    fmt(jurosAcum));

  // Cronograma visual
  const faseTotal = fases.reduce((s,f)=>s+f.pct,0)||100;
  let cronoBars = `<div class="crono-bar">`;
  let faseMeses = 0;
  fases.forEach(f=>{
    const p = f.pct/faseTotal;
    cronoBars += `<div class="crono-seg" style="flex:${p};background:${f.cor};" title="${f.nome}: ${f.pct}%">${p>0.1?f.nome:""}</div>`;
  });
  cronoBars += `</div><div class="crono-legend">`;
  fases.forEach(f=>{
    cronoBars += `<div class="crono-item"><div class="crono-dot" style="background:${f.cor}"></div>${f.nome} (${f.pct}%)</div>`;
  });
  cronoBars += `</div>`;
  html("crono-container", cronoBars);

  // Tabela de fluxo (resumo quinquenal)
  let tblHtml = `<table class="fc-table"><thead><tr>
    <th style="text-align:left">Mês</th>
    <th>Desembolso (R$)</th><th>Receita (R$)</th><th>FC Mensal (R$)</th><th>FC Acumulado (R$)</th>
  </tr></thead><tbody>`;
  let acumFC = 0;
  fluxos.forEach((f,i)=>{
    acumFC += f.fc;
    if(i<prazo+6){
      const pos = f.fc >= 0 ? " pos" : " neg";
      const posAcum = acumFC >= 0 ? " pos" : " neg";
      tblHtml += `<tr>
        <td>Mês ${f.mes}</td>
        <td class="neg">${f.saida < 0 ? fmt(Math.abs(f.saida)) : "—"}</td>
        <td class="pos">${f.entrada > 0 ? fmt(f.entrada) : "—"}</td>
        <td class="${pos}">${fmt(f.fc)}</td>
        <td class="${posAcum}">${fmt(acumFC)}</td>
      </tr>`;
    }
  });
  tblHtml += `<tr style="font-weight:800;">
    <td>TOTAL</td>
    <td class="neg">${fmt(Math.abs(fluxos.reduce((s,f)=>s+(f.saida<0?f.saida:0),0)))}</td>
    <td class="pos">${fmt(fluxos.reduce((s,f)=>s+f.entrada,0))}</td>
    <td class="${acumFC>=0?" pos":" neg"}">${fmt(acumFC)}</td>
    <td class="${acumFC>=0?" pos":" neg"}">${fmt(acumFC)}</td>
  </tr></tbody></table>`;
  html("fc-table-container", tblHtml);
}

function renderSensib(){
  const dados = getDados();
  const variaveis = [
    {nome:"CUB (custo de construção)", var:"cub"},
    {nome:"Preço de venda/m² de mercado", var:"preco"},
    {nome:"Custo do terreno", var:"terreno"},
    {nome:"% Lucro requerido", var:"lucro"},
    {nome:"% Corretagem", var:"corretagem"},
  ];
  const deltas = [-20,-15,-10,-5,0,5,10,15,20];
  let html2 = "";
  variaveis.forEach(v=>{
    html2 += `<tr><td>${v.nome}</td>`;
    deltas.forEach(d=>{
      let r2;
      if(v.var==="cub"){
        const d2={...dados,cub:dados.cub*(1+d/100)};
        r2=calcularViabilidade(d2,AREAS,INDIRETOS,IMPOSTOS);
      } else if(v.var==="preco"){
        r2=calcularViabilidade(dados,AREAS,INDIRETOS,IMPOSTOS);
        // simula mudança no preço de mercado (só afeta a comparação, não o VGV)
        const vendaRef = dados.precoMercado*(1+d/100);
        const viav = r2.vendaM2 <= vendaRef;
        const marg = r2.vendaM2 - r2.custoM2;
        const cls = viav ? (marg/r2.vendaM2 > 0.05?"cell-pos":"cell-neu") : "cell-neg";
        html2 += `<td class="${cls}">${fmtP(marg/r2.vendaM2*100)}</td>`;
        return;
      } else if(v.var==="terreno"){
        const d2={...dados,terreno:dados.terreno*(1+d/100)};
        r2=calcularViabilidade(d2,AREAS,INDIRETOS,IMPOSTOS);
      } else if(v.var==="lucro"){
        const imp2=IMPOSTOS.map(x=>x.tipo==="lucro"?{...x,pct:x.pct*(1+d/100)}:x);
        r2=calcularViabilidade(dados,AREAS,INDIRETOS,imp2);
      } else if(v.var==="corretagem"){
        const imp2=IMPOSTOS.map(x=>x.tipo==="corretagem"?{...x,pct:x.pct*(1+d/100)}:x);
        r2=calcularViabilidade(dados,AREAS,INDIRETOS,imp2);
      }
      const marg = r2.margemPct*100;
      const cls = r2.viavel ? (marg > 5?"cell-pos":"cell-neu") : "cell-neg";
      html2 += `<td class="${cls}">${fmtP(marg)}</td>`;
    });
    html2 += `</tr>`;
  });
  $("sens-tbody").innerHTML = html2;
}

function atualizarPDF(r, dados){
  const cliente = $("h-cliente").value.trim()||"Cliente";
  const obra    = $("h-obra").value.trim()||"Empreendimento";
  const local   = $("h-local").value.trim()||"—";
  const sigNome = $("sig-nome").value.trim()||"Responsável Técnico";
  const sigReg  = $("sig-registro").value.trim()||"Engenheiro Civil / Arquiteto";
  const sigProf = $("sig-prof").value.trim()||"—";
  const sigInst = $("sig-inst").value.trim()||"—";
  const sigDisc = $("sig-disc").value.trim()||"—";
  const dRaw    = $("sig-data").value;
  const dFmt    = dRaw ? new Date(dRaw+"T12:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"}) : new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});

  set("pdf-cover-cliente", cliente);
  set("pdf-cover-obra",    obra);
  set("pdf-cover-local",   local);
  set("pdf-meta-vgv",      fmt(r.vgv));
  set("pdf-meta-apt",      fmt(r.precoApt));
  set("pdf-meta-veredicto",r.viavel?"✓ Viável":"✗ Inviável");
  set("pdf-cub-ref",       `${fmt(dados.cub)}/m²`);
  set("pdf-cover-prof",    sigNome+(sigReg?" · "+sigReg:""));
  set("pdf-cover-inst",    sigInst);
  set("pdf-cover-date",    dFmt);
  set("pdf-cover-disc",    sigDisc);
  set("pdf-bh1",           cliente+" — "+obra);
  set("pdf-bh2",           cliente+" — "+obra);

  html("pdf-nar-intro",`
    <p>Este relatório apresenta o estudo de viabilidade econômico-financeira do empreendimento <strong>${obra}</strong>, localizado em <strong>${local}</strong>, elaborado por <strong>${sigNome}</strong>${sigInst!=="—"?` — ${sigInst}`:""} para <strong>${cliente}</strong>.</p>
    <p>Metodologia: <strong>ABNT NBR 12.721:2006</strong> e <strong>Lei Federal nº 4.591/1964</strong>. CUB adotado: <strong>${fmt(dados.cub)}/m²</strong> (Sinduscon-MA, Fev/2026). Referência de mercado: <strong>Índice FipeZAP Dez/2025</strong> (São Luís: R$8.617/m²) e <strong>SINAPI Fev/2026</strong> (IBGE/CEF: R$1.925,08/m²). O preço de venda é calculado pelo método <em>"por dentro"</em>, onde as deduções incidem sobre o próprio VGV.</p>`);

  // Tabela areas PDF
  const tb=$("pdf-pav-tbody"); tb.innerHTML="";
  let totA=0, totE=0;
  AREAS.forEach(a=>{
    const c=a.qtd*a.area; const eq=c*a.equiv; totA+=c; totE+=eq;
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${a.nome}</td><td class="r">${a.qtd}</td><td class="r">${fmtM(c)}</td><td class="r">${a.equiv.toFixed(2)}</td><td class="r">${fmtM(eq)}</td><td class="r">${r.areaBruta>0?((c/r.areaBruta)*100).toFixed(1)+"%":"—"}</td>`;
    tb.appendChild(tr);
  });
  set("pdf-ft-total", fmtM(totA));
  set("pdf-ft-equiv", fmtM(totE));
  html("pdf-nar-areas",`<p>O empreendimento compõe-se de ${AREAS.length} tipos de área, totalizando <strong>${fmtM(r.areaBruta)}</strong> de área bruta e <strong>${fmtM(r.areaEquiv)}</strong> de área equivalente (coeficientes NBR 12.721:2006). Com CUB de <strong>${fmt(dados.cub)}/m²</strong>, o custo direto de construção é <strong>${fmt(r.custoConstrucao)}</strong>. A área vendável total é <strong>${fmtM(r.areaVend)}</strong> (${dados.qtdApts} unidades de ${dados.areaApt} m²).</p>`);
  $("pdf-metrics-areas").innerHTML=`
    <div class="pdf-metric"><div class="pdf-metric-lbl">Área bruta</div><div class="pdf-metric-val">${fmtM(r.areaBruta)}</div></div>
    <div class="pdf-metric"><div class="pdf-metric-lbl">Área equiv.</div><div class="pdf-metric-val">${fmtM(r.areaEquiv)}</div></div>
    <div class="pdf-metric"><div class="pdf-metric-lbl">Área vendável</div><div class="pdf-metric-val">${fmtM(r.areaVend)}</div></div>
    <div class="pdf-metric"><div class="pdf-metric-lbl">Custo construção</div><div class="pdf-metric-val">${fmt(r.custoConstrucao)}</div></div>`;

  // Indiretos PDF
  const it=$("pdf-ind-tbody"); it.innerHTML="";
  INDIRETOS.forEach(x=>{ const tr=document.createElement("tr"); tr.innerHTML=`<td>${x.nome}</td><td class="r">${fmtP(x.pct)}</td><td class="r">${fmt(r.custoConstrucao*x.pct/100)}</td>`; it.appendChild(tr); });
  const trT=document.createElement("tr"); trT.innerHTML=`<td>Custo do terreno</td><td class="r">—</td><td class="r">${fmt(dados.terreno)}</td>`; it.appendChild(trT);
  set("pdf-ind-pct", fmtP(r.pctInd));
  set("pdf-ind-val", fmt(r.custoInd+dados.terreno));
  html("pdf-nar-ind",`<p>Os custos indiretos somam <strong>${fmtP(r.pctInd)}</strong> do custo direto, equivalente a <strong>${fmt(r.custoInd)}</strong>. O custo do terreno é <strong>${fmt(dados.terreno)}</strong>. Custo total do empreendimento: <strong>${fmt(r.custoTotal)}</strong>.</p>`);

  // Impostos PDF
  const im=$("pdf-imp-tbody"); im.innerHTML="";
  IMPOSTOS.forEach(x=>{ const tr=document.createElement("tr"); tr.innerHTML=`<td>${x.nome}</td><td class="r">${fmtP(x.pct)}</td><td class="r">${fmt(r.vgv*x.pct/100)}</td>`; im.appendChild(tr); });
  set("pdf-imp-pct", fmtP(r.deducoes));
  set("pdf-imp-val", fmt(r.impostosVal+r.comissaoVal+r.lucroVal));
  html("pdf-nar-imp",`<p>As deduções totalizam <strong>${fmtP(r.deducoes)}</strong> sobre o VGV (método "por dentro"): impostos <strong>${fmtP(r.pctImp)}</strong>, corretagem <strong>${fmtP(r.pctCor)}</strong> e lucro requerido <strong>${fmtP(r.pctLuc)}</strong>. VGV resultante: <strong>${fmt(r.vgv)}</strong>.</p>`);

  // Financeiro PDF
  set("pdf-r-constr", fmt(r.custoConstrucao));
  set("pdf-r-ind",    fmt(r.custoInd));
  set("pdf-r-ter",    fmt(dados.terreno));
  set("pdf-r-total",  fmt(r.custoTotal));
  set("pdf-r-imp",    fmt(r.impostosVal));
  set("pdf-r-cor",    fmt(r.comissaoVal));
  set("pdf-r-luc",    fmt(r.lucroVal));
  set("pdf-r-vgv",    fmt(r.vgv));
  set("pdf-r-apt",    fmt(r.precoApt));
  set("pdf-r-lucval", fmt(r.lucroVal));
  set("pdf-r-cm2",    fmt(r.custoM2)+"/m²");
  set("pdf-r-vm2",    fmt(r.vendaM2)+"/m²");
  set("pdf-r-roi",    fmtP(r.roi*100));
  set("pdf-r-marg",   fmtP(r.margemPct*100));

  // Mercado PDF
  const dif = dados.precoMercado>0?((r.vendaM2/dados.precoMercado-1)*100):0;
  html("pdf-mkt",`<strong>📊 Comparativo de Mercado — FipeZAP Dez/2025 · São Luís, MA</strong><br>
    Referência de mercado: <strong>${fmt(dados.precoMercado)}/m²</strong> · Preço calculado: <strong>${fmt(r.vendaM2)}/m²</strong> · 
    ${r.vendaM2<=dados.precoMercado?`✅ Preço ABAIXO do mercado (−${Math.abs(dif).toFixed(1)}%) — produto competitivo.`:`⚠️ Preço ACIMA do mercado (+${Math.abs(dif).toFixed(1)}%) — avaliar viabilidade comercial.`}`);

  // Viabilidade PDF
  const vBox=$("pdf-viavel-box"); if(vBox) vBox.className="pdf-viavel "+(r.viavel?"yes":"no");
  if(r.viavel){
    set("pdf-viavel-head","✓  Conclusão: Empreendimento Economicamente Viável");
    html("pdf-viavel-body",`O empreendimento <strong>${obra}</strong> é <strong>economicamente viável</strong>. Venda: <strong>${fmt(r.vendaM2)}/m²</strong>, custo: <strong>${fmt(r.custoM2)}/m²</strong>, margem: <strong>${fmt(r.margemM2)}/m²</strong>. Cada unidade será vendida por <strong>${fmt(r.precoApt)}</strong>. Lucro total previsto: <strong>${fmt(r.lucroVal)}</strong> (ROI: ${fmtP(r.roi*100)}). Preço está em linha com o mercado local (FipeZAP: R$8.617/m² em Dez/2025).`);
  } else {
    set("pdf-viavel-head","✗  Conclusão: Empreendimento Inviável nos Parâmetros Atuais");
    html("pdf-viavel-body",`O empreendimento <strong>${obra}</strong> apresenta <strong>inviabilidade econômica</strong>. Margem negativa de <strong>${fmt(r.margemM2)}/m²</strong>. Ações recomendadas: (a) revisar CUB adotado; (b) reduzir custos indiretos; (c) renegociar terreno; (d) reduzir margem de lucro; (e) ampliar área vendável. Mercado de São Luís: R$8.617/m² (FipeZAP Dez/2025).`);
  }

  // Signature PDF
  set("pdf-sig-nome",    sigNome);
  set("pdf-sig-reg",     sigReg);
  set("pdf-sig-prof",    sigProf);
  set("pdf-sig-cliente", cliente);
  set("pdf-footer",      `Relatório elaborado em ${dFmt} · ${obra} · ${local}${sigDisc!=="—"?` · ${sigDisc}`:""} · Documento de caráter técnico-consultivo.`);
}

// ====================================================
// UI HELPERS
// ====================================================
function showTab(id){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  $(id).classList.add('active');
  const idx=['tab-entrada','tab-resultado','tab-cenarios','tab-fluxo','tab-sensib','tab-sig'].indexOf(id);
  document.querySelectorAll('.tab-btn')[idx]?.classList.add('active');
  if(id==='tab-resultado'||id==='tab-cenarios'||id==='tab-fluxo'||id==='tab-sensib') render();
}

function selCUB(el){
  document.querySelectorAll('.cub-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  $('cub').value = el.dataset.val;
  render();
}

function carregarTipologia(key){
  document.querySelectorAll('.tipologia-btn').forEach(b=>b.classList.remove('active'));
  $("tip-btn-"+key)?.classList.add('active');
  const t = TIPOLOGIAS[key];
  if(!t) return;
  AREAS = JSON.parse(JSON.stringify(t.areas));
  INDIRETOS = JSON.parse(JSON.stringify(t.indiretos));
  IMPOSTOS  = JSON.parse(JSON.stringify(t.impostos));
  // header
  const hc=$("h-cliente"); if(hc&&t.cliente) hc.value=t.cliente;
  const ho=$("h-obra");    if(ho&&t.obra)    ho.value=t.obra;
  const hl=$("h-local");   if(hl&&t.local)   hl.value=t.local;
  $("cub").value = t.cub;
  $("terreno").value = t.terreno;
  $("qtd-apts").value = t.qtdApts;
  $("area-apt").value = t.areaApt;
  $("preco-mercado").value = t.precoMercado;
  // CUB buttons
  document.querySelectorAll('.cub-opt').forEach(o=>{ o.classList.remove('sel'); if(parseFloat(o.dataset.val)===t.cub) o.classList.add('sel'); });
  buildPavTable();
  buildIndGrid();
  buildImpGrid();
  render();
}

function resetarTipologia(){
  $("h-cliente").value="";$("h-obra").value="";$("h-local").value="";
  carregarTipologia("custom");
}

// Tabela de pavimentos dinâmica
function buildPavTable(){
  const tb=$("pav-tbody"); tb.innerHTML="";
  AREAS.forEach((a,i)=>{ tb.appendChild(buildPavRow(a,i)); });
  render();
}

function buildPavRow(a,i){
  const tr = document.createElement("tr");
  tr.id = "pav-tr-"+i;
  tr.innerHTML=`
    <td><input class="pav-inp" style="width:100%;text-align:left;" type="text" value="${a.nome}" data-i="${i}" data-f="nome" oninput="upArea(this)"></td>
    <td class="r"><input class="pav-inp" style="width:52px;" type="number" value="${a.qtd}" min="0" data-i="${i}" data-f="qtd" oninput="upArea(this)"></td>
    <td class="r"><input class="pav-inp" style="width:88px;" type="number" value="${a.area}" min="0" step="0.01" data-i="${i}" data-f="area" oninput="upArea(this)"></td>
    <td class="r" id="pav-tot-${i}" style="font-weight:700;color:var(--accent);">${fmtM(a.qtd*a.area)}</td>
    <td class="r"><input class="pav-inp" style="width:72px;" type="number" value="${a.equiv}" min="0" step="0.01" data-i="${i}" data-f="equiv" oninput="upArea(this)"></td>
    <td class="r" id="pav-eq-${i}" style="font-weight:600;">${fmtM(a.qtd*a.area*a.equiv)}</td>
    <td class="r"><span class="pct-tag" id="pav-pct-${i}">—</span></td>
    <td><button class="del-btn" onclick="delArea(${i})" title="Remover">×</button></td>`;
  return tr;
}

function addPavRow(){
  AREAS.push({nome:"Nova área",qtd:1,area:50,equiv:1.00});
  const i = AREAS.length-1;
  $("pav-tbody").appendChild(buildPavRow(AREAS[i],i));
  render();
}

function delArea(i){
  if(AREAS.length<=1) return;
  AREAS.splice(i,1);
  buildPavTable();
}

function upArea(el){
  const i = +el.dataset.i; const f = el.dataset.f;
  AREAS[i][f] = f==="nome" ? el.value : (parseFloat(el.value)||0);
  const tot=AREAS[i].qtd*AREAS[i].area;
  const eq=tot*AREAS[i].equiv;
  const e1=$("pav-tot-"+i); if(e1) e1.textContent=fmtM(tot);
  const e2=$("pav-eq-"+i);  if(e2) e2.textContent=fmtM(eq);
  render();
}

function buildIndGrid(){
  const g=$("indiretos-grid"); g.innerHTML="";
  INDIRETOS.forEach((x,i)=>{
    const d=document.createElement("div"); d.className="field";
    d.innerHTML=`<label>${x.nome} (%)</label><input type="number" value="${x.pct}" min="0" step="0.01" data-i="${i}" oninput="upInd(this)">`;
    g.appendChild(d);
  });
}
function upInd(el){ INDIRETOS[+el.dataset.i].pct=parseFloat(el.value)||0; render(); }

function buildImpGrid(){
  const g=$("impostos-grid"); g.innerHTML="";
  IMPOSTOS.forEach((x,i)=>{
    const d=document.createElement("div"); d.className="field";
    const lbl = x.tipo==="imposto"?"🔵":x.tipo==="corretagem"?"🟡":"🟢";
    d.innerHTML=`<label>${lbl} ${x.nome} (%)</label><input type="number" value="${x.pct}" min="0" step="0.01" data-i="${i}" oninput="upImp(this)">`;
    g.appendChild(d);
  });
}
function upImp(el){ IMPOSTOS[+el.dataset.i].pct=parseFloat(el.value)||0; render(); }

function drawPie(cId,lId,data,labels,colors,r){
  const cv=$(cId); if(!cv) return;
  const ctx=cv.getContext("2d");
  const w=cv.width,h=cv.height,cx=w/2,cy=h/2;
  ctx.clearRect(0,0,w,h);
  const tot=data.reduce((s,v)=>s+v,0); if(!tot) return;
  let start=-Math.PI/2;
  data.forEach((v,i)=>{
    const sl=(v/tot)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+sl);ctx.closePath();
    ctx.fillStyle=colors[i%colors.length];ctx.fill();
    ctx.strokeStyle="white";ctx.lineWidth=2;ctx.stroke();
    start+=sl;
  });
  ctx.beginPath();ctx.arc(cx,cy,r*.46,0,Math.PI*2);ctx.fillStyle="#FFF";ctx.fill();
  const lg=$(lId); if(!lg) return;
  lg.innerHTML="";
  const isPdf=lId.startsWith("pdf");
  data.forEach((v,i)=>{
    if(!v) return;
    const pct=((v/tot)*100).toFixed(1);
    const d=document.createElement("div");
    d.style.cssText=isPdf?"display:flex;align-items:center;gap:6px;margin-bottom:4px;":"display:flex;align-items:center;gap:7px;";
    d.innerHTML=`<div style="width:9px;height:9px;border-radius:2px;flex-shrink:0;background:${colors[i%colors.length]}"></div>`
      +`<span style="flex:1;font-size:${isPdf?'9':'11'}px;color:var(--text2);">${labels[i]}</span>`
      +`<span style="font-weight:700;font-size:${isPdf?'9':'11'}px;">${pct}%</span>`;
    lg.appendChild(d);
  });
}

// ====================================================
// BOOT
// ====================================================
buildPavTable();
buildIndGrid();
buildImpGrid();
$("sig-data").value = new Date().toISOString().split("T")[0];
render();
