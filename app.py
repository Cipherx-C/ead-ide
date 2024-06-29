from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

# Rota principal que renderiza o index.html
@app.route('/')
def index():
    return render_template('index.html')

# Rota para executar código
@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data['code']
    extension = data.get('extension', 'js')

    file_name = f'temp_code.{extension}'
    with open(file_name, 'w', encoding='utf-8') as file:
        file.write(code)

    try:
        if extension == 'py':
            result = subprocess.run(['python', file_name], capture_output=True, text=True, timeout=10)
        elif extension == 'ts':
            result = subprocess.run(['ts-node', file_name], capture_output=True, text=True, timeout=10, shell=True)
        elif extension == 'html':
            # Leitura do arquivo HTML da pasta 'public'
            with open(f'public/{file_name}', 'r', encoding='utf-8') as file:
                return jsonify({
                    'stdout': file.read(),
                    'stderr': ''
                })
        else:
            result = subprocess.run(['node', file_name], capture_output=True, text=True, timeout=10)

        return jsonify({
            'stdout': result.stdout,
            'stderr': result.stderr
        })
    except subprocess.TimeoutExpired:
        return jsonify({
            'stdout': '',
            'stderr': 'Tempo de execução excedido (10 segundos)'
        })
    except Exception as e:
        return jsonify({
            'stdout': '',
            'stderr': str(e)
        })
    finally:
        if os.path.exists(file_name):
            os.remove(file_name)

if __name__ == '__main__':
    app.run(debug=True)
