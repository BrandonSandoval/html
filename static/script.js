function getStock() {
    const ticker = document.getElementById('ticker').value;
    const errorContainer = document.getElementById('error-container');
    const extraButtons = document.getElementById('extra-buttons');

    // Clear previous error messages
    errorContainer.innerHTML = '';
    extraButtons.style.display = 'none';

    if (!ticker) {
        errorContainer.innerHTML = 'Please enter a stock ticker symbol.';
        return;
    }

    fetch(`/stock?ticker=${ticker}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorContainer.innerHTML = 'Error: No record has been found. Please enter a valid symbol.';
            } else {
                console.log(data);

                // Show the additional buttons after a successful search
                extraButtons.style.display = 'block';

                // Automatically click the Company Outlook button
                companyOutlook();
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            errorContainer.innerHTML = 'Error: Unable to fetch stock data. Please try again later.';
        });
}

function clearInput() {
    document.getElementById('ticker').value = '';
    document.getElementById('extra-buttons').style.display = 'none'; 
}

function companyOutlook() {
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
                // Dynamically create a vertical table for the company outlook
                const tableContainer = document.getElementById('table-container') || document.createElement('div');
                tableContainer.id = 'table-container';
                tableContainer.innerHTML = ''; 
                
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.marginTop = '20px';

                const attributes = [
                    { label: 'Company Name', value: data.name || 'N/A' },
                    { label: 'Stock Ticker Symbol', value: data.ticker || 'N/A' },
                    { label: 'Stock Exchange Code', value: data.exchangeCode || 'N/A' },
                    { label: 'Company Start Date', value: data.startDate || 'N/A' },
                    { label: 'Description', value: data.description || 'N/A' }
                ];

                attributes.forEach(attribute => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid black; padding: 5px; font-weight: bold;">${attribute.label}</td>
                        <td style="border: 1px solid black; padding: 5px;">${attribute.value}</td>
                    `;
                    table.appendChild(row);
                });

                tableContainer.appendChild(table);
                document.querySelector('.container').appendChild(tableContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
}

function stockSummary() {
    const ticker = document.getElementById('ticker').value;
    if (!ticker) {
        alert("Please enter a stock ticker symbol.");
        return;
    }

    fetch(`/stock/summary?ticker=${ticker}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                // Dynamically create a vertical table for the company outlook
                const tableContainer = document.getElementById('table-container') || document.createElement('div');
                tableContainer.id = 'table-container';
                tableContainer.innerHTML = '';
                
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.marginTop = '20px';

                const attributes = [
                    { label: 'Stock Ticker Symbol', value: data.ticker },
                    { label: 'Trading Day', value: data.timestamp },
                    { label: 'Previouis Closing Price', value: data.prevClose },
                    { label: 'Opening Price', value: data.openPrice},
                    { label: 'High Price', value: data.highPrice},
                    { label: 'Low Price', value: data.lowPrice},
                    { label: 'Last Price', value: data.lastPrice},
                    { label: 'Change', value: data.change},
                    { label: 'Change Percent', value: data.changePercent},
                    { label: 'Number of Shares Traded', value: data.volume}
                ];

                attributes.forEach(attribute => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td style="border: 1px solid black; padding: 5px; font-weight: bold;">${attribute.label}</td>
                        <td style="border: 1px solid black; padding: 5px;">${attribute.value}</td>
                    `;
                    table.appendChild(row);
                });

                tableContainer.appendChild(table);
                document.querySelector('.container').appendChild(tableContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
        });
}
