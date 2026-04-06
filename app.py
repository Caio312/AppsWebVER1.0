import os
import copy
from functools import wraps
from dotenv import load_dotenv
from flask import (
    Flask, render_template, request, session,
    redirect, url_for, abort, send_from_directory, jsonify
)

from calculadora.tipologias import TIPOLOGIAS
from calculadora.viabilidade import (
    calcular_viabilidade, calcular_cenario,
    calcular_tir, calcular_vpl, gerar_fluxo_caixa,
)

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-inseguro-troque-no-env")

APP_PASSWORD = os.environ.get("APP_PASSWORD", "")


# ── Decorator de autenticação ──────────────────────────────────────────────
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("authenticated"):
            return redirect(url_for("login", next=request.path))
        return f(*args, **kwargs)
    return decorated


# ── Proteção de arquivos estáticos das ferramentas ────────────────────────
@app.route("/static/apps/<path:filename>")
@login_required
def protected_static(filename):
    """JS, CSS e outros estáticos de /apps só chegam ao browser autenticado."""
    static_apps_dir = os.path.join(app.root_path, "static", "apps")
    return send_from_directory(static_apps_dir, filename)


# ── Rotas públicas ─────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    next_url = request.args.get("next") or request.form.get("next") or "/"

    if request.method == "POST":
        if request.form.get("password") == APP_PASSWORD:
            session["authenticated"] = True
            return redirect(next_url)
        error = "Senha incorreta. Tente novamente."

    return render_template("login.html", error=error, next=next_url)


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


# ── Rotas protegidas (ferramentas) ─────────────────────────────────────────
@app.route("/apps/<app_name>.html")
@login_required
def serve_app(app_name):
    return render_template(f"apps/{app_name}.html")


# ── API de cálculo (requer autenticação) ───────────────────────────────────
def _api_login_required(f):
    """Versão da proteção que retorna JSON 401 em vez de redirect."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get("authenticated"):
            return jsonify({"error": "não autenticado"}), 401
        return f(*args, **kwargs)
    return decorated


@app.route("/api/tipologias")
@_api_login_required
def api_tipologias():
    """Retorna os presets de tipologia (sem os algoritmos)."""
    return jsonify(TIPOLOGIAS)


@app.route("/api/calcular", methods=["POST"])
@_api_login_required
def api_calcular():
    """
    Calcula viabilidade completa.
    Body JSON: {dados, areas, indiretos, impostos}
    """
    body = request.get_json(force=True)
    try:
        result = calcular_viabilidade(
            body["dados"], body["areas"], body["indiretos"], body["impostos"]
        )
        return jsonify(result)
    except (KeyError, TypeError, ZeroDivisionError) as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/cenarios", methods=["POST"])
@_api_login_required
def api_cenarios():
    """
    Calcula 3 cenários (pessimista, base, otimista).
    Body JSON: {dados, areas, indiretos, impostos, cenarios: [{dCub, dVenda, dTerreno}, ...]}
    """
    body = request.get_json(force=True)
    try:
        dados    = body["dados"]
        areas    = body["areas"]
        indiretos = body["indiretos"]
        impostos = body["impostos"]
        resultados = []
        for c in body.get("cenarios", []):
            resultados.append(calcular_cenario(
                dados, areas, indiretos, impostos,
                d_cub=c.get("dCub", 0),
                d_venda=c.get("dVenda", 0),
                d_terreno=c.get("dTerreno", 0),
            ))
        return jsonify(resultados)
    except (KeyError, TypeError, ZeroDivisionError) as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/fluxo", methods=["POST"])
@_api_login_required
def api_fluxo():
    """
    Gera fluxo de caixa + TIR + VPL.
    Body JSON: {result, prazo, vvPct, finPct, fasesPct, taxaDesc}
    """
    body = request.get_json(force=True)
    try:
        r       = body["result"]
        prazo   = int(body.get("prazo", 24))
        vv_pct  = float(body.get("vvPct", 5))
        fin_pct = float(body.get("finPct", 0))
        fases_pct = body.get("fasesPct")
        taxa_desc = float(body.get("taxaDesc", 0.01))

        fc_data = gerar_fluxo_caixa(r, prazo, vv_pct, fin_pct, fases_pct)
        fluxos_vals = [f["fc"] for f in fc_data["fluxos"]]
        tir = calcular_tir(fluxos_vals)
        vpl = calcular_vpl(fluxos_vals, taxa_desc)

        return jsonify({
            **fc_data,
            "tir": tir,
            "vpl": vpl,
        })
    except (KeyError, TypeError, ZeroDivisionError) as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/sensibilidade", methods=["POST"])
@_api_login_required
def api_sensibilidade():
    """
    Matriz de sensibilidade 5 variáveis × 9 deltas.
    Replica exatamente a lógica de renderSensib() do JS original.
    Body JSON: {dados, areas, indiretos, impostos}
    """
    body = request.get_json(force=True)
    try:
        dados     = body["dados"]
        areas     = body["areas"]
        indiretos = body["indiretos"]
        impostos  = body["impostos"]

        variaveis = [
            {"key": "cub",       "nome": "CUB (custo de construção)"},
            {"key": "preco",     "nome": "Preço de venda/m² de mercado"},
            {"key": "terreno",   "nome": "Custo do terreno"},
            {"key": "lucro",     "nome": "% Lucro requerido"},
            {"key": "corretagem","nome": "% Corretagem"},
        ]
        deltas = [-20, -15, -10, -5, 0, 5, 10, 15, 20]

        matriz = []
        for v in variaveis:
            linha = []
            for d in deltas:
                var = v["key"]
                if var == "cub":
                    d2 = {**dados, "cub": dados["cub"] * (1 + d / 100)}
                    r2 = calcular_viabilidade(d2, areas, indiretos, impostos)
                    marg = r2["margemPct"] * 100
                    cls = "cell-pos" if r2["viavel"] and marg > 5 else (
                          "cell-neu" if r2["viavel"] else "cell-neg")
                    linha.append({"val": marg, "cls": cls})
                elif var == "preco":
                    r2 = calcular_viabilidade(dados, areas, indiretos, impostos)
                    venda_ref = dados["precoMercado"] * (1 + d / 100)
                    viav = r2["vendaM2"] <= venda_ref
                    marg_abs = r2["vendaM2"] - r2["custoM2"]
                    pct = marg_abs / r2["vendaM2"] * 100 if r2["vendaM2"] > 0 else 0
                    cls = "cell-pos" if viav and pct > 5 else (
                          "cell-neu" if viav else "cell-neg")
                    linha.append({"val": pct, "cls": cls})
                elif var == "terreno":
                    d2 = {**dados, "terreno": dados["terreno"] * (1 + d / 100)}
                    r2 = calcular_viabilidade(d2, areas, indiretos, impostos)
                    marg = r2["margemPct"] * 100
                    cls = "cell-pos" if r2["viavel"] and marg > 5 else (
                          "cell-neu" if r2["viavel"] else "cell-neg")
                    linha.append({"val": marg, "cls": cls})
                elif var == "lucro":
                    imp2 = [dict(x, pct=x["pct"] * (1 + d / 100))
                            if x["tipo"] == "lucro" else x for x in impostos]
                    r2 = calcular_viabilidade(dados, areas, indiretos, imp2)
                    marg = r2["margemPct"] * 100
                    cls = "cell-pos" if r2["viavel"] and marg > 5 else (
                          "cell-neu" if r2["viavel"] else "cell-neg")
                    linha.append({"val": marg, "cls": cls})
                elif var == "corretagem":
                    imp2 = [dict(x, pct=x["pct"] * (1 + d / 100))
                            if x["tipo"] == "corretagem" else x for x in impostos]
                    r2 = calcular_viabilidade(dados, areas, indiretos, imp2)
                    marg = r2["margemPct"] * 100
                    cls = "cell-pos" if r2["viavel"] and marg > 5 else (
                          "cell-neu" if r2["viavel"] else "cell-neg")
                    linha.append({"val": marg, "cls": cls})
            matriz.append({"nome": v["nome"], "celulas": linha})

        return jsonify({"variaveis": variaveis, "deltas": deltas, "matriz": matriz})
    except (KeyError, TypeError, ZeroDivisionError) as e:
        return jsonify({"error": str(e)}), 400


# ── Inicialização ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not APP_PASSWORD:
        print("⚠  AVISO: APP_PASSWORD não definido no .env — qualquer senha será aceita!")
    app.run(debug=True, port=5000)
