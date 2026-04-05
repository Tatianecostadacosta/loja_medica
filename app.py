from flask import Flask, render_template, request, jsonify
import sqlite3
import json

app = Flask(__name__)

def criar_banco():
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente TEXT,
        itens TEXT,
        total REAL
    )
    ''')

    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/salvar', methods=['POST'])
def salvar():
    dados = request.json

    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO pedidos (cliente, itens, total)
    VALUES (?, ?, ?)
    ''', (dados['cliente'], json.dumps(dados['itens']), dados['total']))

    conn.commit()
    conn.close()

    return jsonify({"status": "ok"})

@app.route('/pedidos')
def pedidos():
    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM pedidos")
    dados = cursor.fetchall()

    conn.close()

    dados_formatados = []

    for pedido in dados:
        try:
            itens_dict = json.loads(pedido[2])
            itens_formatados = ""
            for nome, info in itens_dict.items():
                itens_formatados += f"• {nome} (x{info['quantidade']})<br>"
        except:
            itens_formatados = pedido[2]

        dados_formatados.append((
            pedido[0],
            pedido[1],
            itens_formatados,
            pedido[3]
        ))

    return render_template('pedidos.html', pedidos=dados_formatados)

if __name__ == '__main__':
    import os
    criar_banco()
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))