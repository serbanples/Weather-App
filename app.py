from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import os
import requests

load_dotenv(dotenv_path=".env.local")

app = Flask(__name__)
allowed_origins = [
    "http://localhost:3000",
]
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///favorites.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    def __repr__(self):
        return f'<Favorite {self.name}>'

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
    
@app.route('/api/add-favorite', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type'])
def add_to_favorites():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight request successful'})
        return response

    try:
        data = request.json
        favorite = Favorite(name = data['name'])
        db.session.add(favorite)
        db.session.commit()
        return jsonify({'message': 'Added to favorites successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/favorites')
def view_favorites():
    favorites = Favorite.query.all()
    favorites_data = [
        {
            'id': favorite.id,
            'name': favorite.name,
        }
        for favorite in favorites
    ]
    return jsonify(favorites_data)

@app.route('/api/clear', methods=['POST'])
def clear_favorites():
    try:
        db.session.query(Favorite).delete()
        db.session.commit()
    
        return jsonify({'message': 'Favorites cleared successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/remove-favorite', methods=['POST'])
def remove_favorite():
    try:
        data = request.json
        favorite_name = data.get('name')

        if favorite_name:
            favorite = Favorite.query.filter_by(name=favorite_name).first()

            if favorite:
                db.session.delete(favorite)
                db.session.commit()
                return jsonify({'message': 'Favorite removed successfully'}), 200
            else:
                return jsonify({'error': 'Favorite not found'}), 404
        else:
            return jsonify({'error': 'Missing "name" in request data'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
