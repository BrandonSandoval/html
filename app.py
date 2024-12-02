from flask import Flask, jsonify, render_template, request
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
API_KEY =  os.getenv('API_KEY')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stock')
def get_stock_quote():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    url = f'https://api.tiingo.com/tiingo/daily/{ticker}'
    headers = {'Authorization': f'Token {API_KEY}',
               'Content-Type': 'application/json'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        stock_url = f'https://api.tiingo.com/tiingo/daily/{ticker}?token={API_KEY}'
        stock_response = requests.get(stock_url, headers=headers)
        
        if stock_response.status_code == 200:
            data = response.json()
            name = data.get('name')
            exchangeCode = data.get('exchangeCode')
            startDate = data.get('startDate')
            description = data.get('description')

            if description:
                lines = description.split('\n')
                truncated_description = '\n'.join(lines[:5])  # Take first 5 lines
                if len(lines) > 5:
                    truncated_description += '...'
                description = truncated_description
            print(name, ticker, exchangeCode, startDate, description)
            return jsonify({
                'name': name,
                'ticker': ticker,
                'exchangeCode': exchangeCode,
                'startDate': startDate,
                'description': description,
            })
        else:
            return jsonify({'error': 'Failed to fetch stock data'}), 404
    else:
        return jsonify({'error': 'Failed to fetch company data'}), 404

if __name__ == '__main__':
    app.run(debug=True)