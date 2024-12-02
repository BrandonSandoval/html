function getStockQuote() {
    const ticker = document.getElementById('ticker').value;
    if (!ticker) {
        alert("Please enter a stock ticker symbol.");
        return;
    }

    fetch(`/stock?ticker=${ticker}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                console.log(data); // Handle the data as needed
                // You can update the DOM to display the stock data here
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
}

function clearInput() {
    document.getElementById('ticker').value = '';
}