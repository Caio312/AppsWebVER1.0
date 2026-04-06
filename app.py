import os
from functools import wraps
from dotenv import load_dotenv
from flask import (
    Flask, render_template, request, session,
    redirect, url_for, abort, send_from_directory
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


# ── Inicialização ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    if not APP_PASSWORD:
        print("⚠  AVISO: APP_PASSWORD não definido no .env — qualquer senha será aceita!")
    app.run(debug=True, port=5000)
