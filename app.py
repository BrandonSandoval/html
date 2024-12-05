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
def get_stock():
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
            description = description[:308] + "..."
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

@app.route('/stock/summary')
def get_stock_summary():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    url = f'https://api.tiingo.com/iex/{ticker}'
    headers = {'Authorization': f'Token {API_KEY}', 'Content-Type': 'application/json'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if isinstance(data, list) and len(data) > 0: 
            stock_data = data[0] 
            # Extract and calculate values, allowing them to remain None if unavailable
            ticker = stock_data.get('ticker')
            timestamp = stock_data.get('timestamp')
            prevClose = stock_data.get('prevClose')
            openPrice = stock_data.get('open')
            highPrice = stock_data.get('high')
            lowPrice = stock_data.get('low')
            lastPrice = stock_data.get('last')
            volume = stock_data.get('volume')
            
            # Calculate change and percent safely
            change = round(lastPrice - prevClose, 2)
            changePercent = round((change / prevClose) * 100, 2)

            # Build the JSON response, omitting None values
            result = {
                'ticker': ticker,
                'timestamp': timestamp,
                'prevClose': prevClose,
                'openPrice': openPrice,
                'highPrice': highPrice,
                'lowPrice': lowPrice,
                'lastPrice': lastPrice,
                'change': change,
                'changePercent': changePercent,
                'volume': volume,
            }
            return jsonify({k: v for k, v in result.items()})
        else:
            return jsonify({'error': 'Failed to fetch stock data'}), response.status_code 
    else:
        return jsonify({'error': 'Failed to fetch stock data'}), response.status_code    

if __name__ == '__main__':
    app.run(debug=True)