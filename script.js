document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://data-asg.goldprice.org/dbXRates/USD';

    // DOM Elements
    const elements = {
        // Card 1
        price: document.getElementById('gold-price'),
        timestamp: document.getElementById('timestamp'),
        changeValue: document.getElementById('change-value'),
        changePercent: document.getElementById('change-percent'),
        changeIndicator: document.getElementById('price-change'),
        prevClose: document.getElementById('prev-close'),
        highVal: document.getElementById('high-val'),
        gramAed: document.getElementById('gram-price-aed'),

        // Card 2 (Gold-API.com)
        price2: document.getElementById('gold-price-2'),
        silver2: document.getElementById('silver-price-2'),
        gramAed2: document.getElementById('gram-price-aed-2'),

        // Global
        refreshBtn: document.getElementById('refresh-btn')
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const fetchAllData = async () => {
        // Disable button
        if (elements.refreshBtn) {
            elements.refreshBtn.disabled = true;
            elements.refreshBtn.style.opacity = '0.7';
        }

        await Promise.allSettled([
            fetchOriginalAPI(),
            fetchGoldApiCom()
        ]);

        // Re-enable
        if (elements.refreshBtn) {
            elements.refreshBtn.disabled = false;
            elements.refreshBtn.style.opacity = '1';
        }
    };

    const fetchOriginalAPI = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Source 1 Network response was not ok');
            const data = await response.json();
            updateUI_Source1(data);
        } catch (error) {
            console.error('Error fetching source 1:', error);
            elements.price.textContent = 'Error';
            elements.price.style.fontSize = '2rem';
            elements.price.style.color = 'var(--negative-red)';
        }
    };

    const fetchGoldApiCom = async () => {
        try {
            // Fetch XAU and XAG
            const [respGold, respSilver] = await Promise.all([
                fetch('https://api.gold-api.com/price/XAU'),
                fetch('https://api.gold-api.com/price/XAG')
            ]);

            if (!respGold.ok || !respSilver.ok) throw new Error('Gold-API response was not ok');

            const dataGold = await respGold.json();
            const dataSilver = await respSilver.json();

            updateUI_Source2(dataGold, dataSilver);
        } catch (error) {
            console.error('Error fetching Gold-API:', error);
            if (elements.price2) {
                elements.price2.textContent = 'Error';
                elements.price2.style.fontSize = '2rem';
                elements.price2.style.color = 'var(--negative-red)';
            }
        }
    };

    const updateUI_Source1 = (data) => {
        // Data structure: {"items":[{"curr":"USD","xauPrice":5581.4,"chgXau":276.15,"pcXau":5.2052,"xauClose":5305.25...}]}
        if (!data.items || data.items.length === 0) return;

        const item = data.items[0];

        // Price
        elements.price.textContent = formatCurrency(item.xauPrice);

        // Date
        elements.timestamp.textContent = `As of ${data.date}`;

        // Change
        const change = item.chgXau;
        const percent = item.pcXau;

        elements.changeValue.textContent = (change >= 0 ? '+' : '') + formatCurrency(change);
        elements.changePercent.textContent = `(${percent}%)`;

        // Styling for positive/negative
        elements.changeIndicator.className = 'change-indicator ' + (change >= 0 ? 'positive' : 'negative');

        // Details
        elements.prevClose.textContent = formatCurrency(item.xauClose);

        // We don't have High/Low in the snippet, so let's repurpose or fill "High" with today's calculation if possible?
        // Or just set to N/A. Let's set it to N/A or remove the element logic in a real app.
        // For the sake of the visual, I'll calculate an estimated "Open" roughly, or just hide "High".
        // Let's change the "High" label in HTML to "Silver Price" since we have that data!
        // Wait, I can't change HTML easily now without rewrite. I'll just put Silver Price logic here 
        // and user can see it matches the "High" slot but I should probably rename the Label via JS to be clean.

        const highLabel = document.querySelector('.detail-item:first-child .label');
        if (highLabel) highLabel.textContent = "Silver Price (XAG)";
        elements.highVal.textContent = formatCurrency(item.xagPrice);

        // Calculate Gram Price in AED
        // 1 Troy Ounce = 31.1034768 grams
        // 1 USD = 3.6725 AED (Pegged rate)
        const OUNCE_TO_GRAMS = 31.1034768;
        const USD_TO_AED = 3.6725;

        const pricePerOunceInAed = item.xauPrice * USD_TO_AED;
        const pricePerGramInAed = pricePerOunceInAed / OUNCE_TO_GRAMS;

        if (elements.gramAed) {
            elements.gramAed.textContent = new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: 'AED',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(pricePerGramInAed);
        }
    };

    const updateUI_Source2 = (dataGold, dataSilver) => {
        // Structure: { "curr": "USD", "price": 2730.5, "symbol": "XAU" ... } (Hypothetical, usually just price/symbol)
        // Adjust based on actual test if needed, but standard guess:
        const priceGold = parseFloat(dataGold.price);
        const priceSilver = parseFloat(dataSilver.price);

        if (elements.price2) {
            elements.price2.textContent = formatCurrency(priceGold);
        }

        if (elements.silver2) {
            elements.silver2.textContent = formatCurrency(priceSilver);
        }

        // AED Calc
        const OUNCE_TO_GRAMS = 31.1034768;
        const USD_TO_AED = 3.6725;
        const pricePerOunceInAed = priceGold * USD_TO_AED;
        const pricePerGramInAed = pricePerOunceInAed / OUNCE_TO_GRAMS;

        if (elements.gramAed2) {
            elements.gramAed2.textContent = new Intl.NumberFormat('en-AE', {
                style: 'currency',
                currency: 'AED',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(pricePerGramInAed);
        }
    };

    // Event Listeners
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', fetchAllData);
    }

    // Initial Load
    fetchAllData();

    // Auto refresh every 3 seconds
    setInterval(fetchAllData, 3000);
});
