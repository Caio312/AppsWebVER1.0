'use strict';

// Estado mutável (preenchido via API no boot)
let TIPOLOGIAS = {};
let AREAS     = [];
let INDIRETOS = [];
let IMPOSTOS  = [];
let _lastR    = null;  // cache do último resultado de /api/calcular

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

// Debounce para evitar chamadas repetidas durante edição
let _debTimer = null;
function scheduleRender(ms=300){ clearTimeout(_debTimer); _debTimer=setTimeout(render, ms); }

// ====================================================
// CAMADA 2 — CHAMADAS À API (substituem os algoritmos JS)
// ====================================================
async function apiCalc(dados, areas, indiretos, impostos){
  const res = await fetch('/api/calcular',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dados,areas,indiretos,impostos})
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiCenarios(dados, areas, indiretos, impostos, cenarios){
  const res = await fetch('/api/cenarios',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dados,areas,indiretos,impostos,cenarios})
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiFluxo(result, prazo, vvPct, finPct, fasesPct, taxaDesc){
  const res = await fetch('/api/fluxo',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({result,prazo,vvPct,finPct,fasesPct,taxaDesc})
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiSensib(dados, areas, indiretos, impostos){
  const res = await fetch('/api/sensibilidade',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({dados,areas,indiretos,impostos})
  });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
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

async function render(){
  const dados = getDados();
  try {
    const r = await apiCalc(dados, AREAS, INDIRETOS, IMPOSTOS);
    _lastR = r;
    atualizarEntrada(r, dados);
    atualizarResultado(r, dados);
    atualizarPDF(r, dados);
    const [, , ] = await Promise.all([
      renderScenarios(dados, r),
      renderFluxo(dados, r),
      renderSensib(dados),
    ]);
  } catch(e){ console.error("Erro no cálculo:", e); }
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

async function renderScenarios(dados, r){
  if(!dados) dados=getDados();
  const defs = [
    {id:"sc-opt-body", cls:"opt",
      dCub:parseFloat($("sc-cub-ot").value)||0,
      dV:  parseFloat($("sc-venda-ot").value)||0,
      dT:  parseFloat($("sc-ter-ot").value)||0},
    {id:"sc-re-body",  cls:"real",
      dCub:parseFloat($("sc-cub-re").value)||0,
      dV:  parseFloat($("sc-venda-re").value)||0,
      dT:  parseFloat($("sc-ter-re").value)||0},
    {id:"sc-pe-body",  cls:"pess",
      dCub:parseFloat($("sc-cub-pe").value)||0,
      dV:  parseFloat($("sc-venda-pe").value)||0,
      dT:  parseFloat($("sc-ter-pe").value)||0},
  ];
  const cenarios = defs.map(d=>({dCub:d.dCub, dVenda:d.dV, dTerreno:d.dT}));
  const resultados = await apiCenarios(dados, AREAS, INDIRETOS, IMPOSTOS, cenarios);
  defs.forEach((d,i)=>{
    const r = resultados[i];
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
  resultados.forEach((r,i)=>{
    pdfSc += `<div class="pdf-sc-c ${scCls[i]}">
      <div class="pdf-sc-t">${scLabels[i]}</div>
      <div class="pdf-sc-r"><span>CUB</span><span>${fmtPn(defs[i].dCub)}</span></div>
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

async function renderFluxo(dados, r){
  if(!dados) dados=getDados();
  if(!r) r=_lastR;
  if(!r) return;
  const prazo = parseInt($("fc-prazo").value)||18;
  const vv    = parseFloat($("fc-vv").value)||6;
  const tma   = parseFloat($("fc-tma").value)||1.0;
  const finPct= parseFloat($("fc-fin").value)||0;
  const fasesPct = {
    fund: parseFloat($("fc-fund").value)||10,
    est:  parseFloat($("fc-est").value)||35,
    alv:  parseFloat($("fc-alv").value)||15,
    ins:  parseFloat($("fc-ins").value)||20,
    acab: parseFloat($("fc-acab").value)||20,
  };

  const data = await apiFluxo(r, prazo, vv, finPct, fasesPct, tma/100);
  const {fluxos, jurosAcum, fases, tir, vpl} = data;
  const tirAnual = tir !== null ? Math.pow(1+tir,12)-1 : null;
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

  // Tabela de fluxo
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

async function renderSensib(dados){
  if(!dados) dados=getDados();
  const data = await apiSensib(dados, AREAS, INDIRETOS, IMPOSTOS);
  const {matriz} = data;
  let html2 = "";
  matriz.forEach(row=>{
    html2 += `<tr><td>${row.nome}</td>`;
    row.celulas.forEach(c=>{ html2 += `<td class="${c.cls}">${fmtP(c.val)}</td>`; });
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
  if(id==='tab-resultado'||id==='tab-cenarios'||id==='tab-fluxo'||id==='tab-sensib') scheduleRender(0);
}

function selCUB(el){
  document.querySelectorAll('.cub-opt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  $('cub').value = el.dataset.val;
  scheduleRender(0);
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
  scheduleRender(0);
}

function resetarTipologia(){
  $("h-cliente").value="";$("h-obra").value="";$("h-local").value="";
  carregarTipologia("custom");
}

// Tabela de pavimentos dinâmica
function buildPavTable(){
  const tb=$("pav-tbody"); tb.innerHTML="";
  AREAS.forEach((a,i)=>{ tb.appendChild(buildPavRow(a,i)); });
  scheduleRender(0);
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
  scheduleRender(0);
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
  scheduleRender();
}

function buildIndGrid(){
  const g=$("indiretos-grid"); g.innerHTML="";
  INDIRETOS.forEach((x,i)=>{
    const d=document.createElement("div"); d.className="field";
    d.innerHTML=`<label>${x.nome} (%)</label><input type="number" value="${x.pct}" min="0" step="0.01" data-i="${i}" oninput="upInd(this)">`;
    g.appendChild(d);
  });
}
function upInd(el){ INDIRETOS[+el.dataset.i].pct=parseFloat(el.value)||0; scheduleRender(); }

function buildImpGrid(){
  const g=$("impostos-grid"); g.innerHTML="";
  IMPOSTOS.forEach((x,i)=>{
    const d=document.createElement("div"); d.className="field";
    const lbl = x.tipo==="imposto"?"🔵":x.tipo==="corretagem"?"🟡":"🟢";
    d.innerHTML=`<label>${lbl} ${x.nome} (%)</label><input type="number" value="${x.pct}" min="0" step="0.01" data-i="${i}" oninput="upImp(this)">`;
    g.appendChild(d);
  });
}
function upImp(el){ IMPOSTOS[+el.dataset.i].pct=parseFloat(el.value)||0; scheduleRender(); }

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
async function boot(){
  try {
    TIPOLOGIAS = await fetch('/api/tipologias').then(r=>r.json());
    const t = TIPOLOGIAS.condhoriz;
    AREAS     = JSON.parse(JSON.stringify(t.areas));
    INDIRETOS = JSON.parse(JSON.stringify(t.indiretos));
    IMPOSTOS  = JSON.parse(JSON.stringify(t.impostos));
  } catch(e){ console.error("Falha ao carregar tipologias:", e); }
  buildPavTable();
  buildIndGrid();
  buildImpGrid();
  $("sig-data").value = new Date().toISOString().split("T")[0];
  await render();
}
boot();
