from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    html_code = data.get('html', '')
    css_code = data.get('css', '')
    js_code = data.get('js', '')

    if html_code:
        full_html = f"<style>{css_code}</style>{html_code}<script>{js_code}</script>"
        return jsonify({
            'stdout': full_html,
            'stderr': ''
        })
    else:
        return jsonify({
            'stdout': '',
            'stderr': 'No HTML content to execute'
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
