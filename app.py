from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import os
import requests

load_dotenv(dotenv_path=".env.local")

app = Flask(__name__)
CORS(app)

@app.route('/api/weather', methods=['POST'])
def get_weather():
    try:
        city = request.json['city']
        api_key = os.getenv("OPENWEATHER_API_KEY")
        print(f"Request received for city: {city}")

        url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}'
        print(f"API URL: {url}")

        response = requests.get(url)
        data = response.json()

        if response.ok:
            return jsonify(data), 200
        else:
            return jsonify({'error': data.get('message', 'Unknown error')}), response.status_code

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
