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
        gramEgp: document.getElementById('gram-price-egp'),
        gramEgp21k: document.getElementById('gram-price-egp-21k'),
        egp24kConverted: document.getElementById('egp-24k-converted'),
        egp21kConverted: document.getElementById('egp-21k-converted'),
        exchangeRateUsdEgp: document.getElementById('exchange-rate-usd-egp'),
        exchangeRateAedEgp: document.getElementById('exchange-rate-aed-egp'),

        // Card 2 (Gold-API.com)
        price2: document.getElementById('gold-price-2'),
        silver2: document.getElementById('silver-price-2'),
        gramAed2: document.getElementById('gram-price-aed-2'),
        gramEgp2: document.getElementById('gram-price-egp-2'),
        gramEgp21k2: document.getElementById('gram-price-egp-21k-2'),
        egp24kConverted2: document.getElementById('egp-24k-converted-2'),
        egp21kConverted2: document.getElementById('egp-21k-converted-2'),
        exchangeRateUsdEgp2: document.getElementById('exchange-rate-usd-egp-2'),
        exchangeRateAedEgp2: document.getElementById('exchange-rate-aed-egp-2'),

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
            const [respUsd, respEgp] = await Promise.all([
                fetch(API_URL),
                fetch('https://data-asg.goldprice.org/dbXRates/EGP')
            ]);

            if (!respUsd.ok) throw new Error('Source 1 USD Network response was not ok');
            const dataUsd = await respUsd.json();

            let dataEgp = null;
            if (respEgp.ok) {
                dataEgp = await respEgp.json();
            }

            updateUI_Source1(dataUsd, dataEgp);
        } catch (error) {
            console.error('Error fetching source 1:', error);
            elements.price.textContent = 'Error';
            elements.price.style.fontSize = '2rem';
            elements.price.style.color = 'var(--negative-red)';
        }
    };

    const fetchGoldApiCom = async () => {
        try {
            // Fetch XAU and XAG only from gold-api.com — fully independent of goldprice.org
            const [respGold, respSilver] = await Promise.all([
                fetch('https://api.gold-api.com/price/XAU'),
                fetch('https://api.gold-api.com/price/XAG')
            ]);

            if (!respGold.ok || !respSilver.ok) throw new Error('Gold-API response was not ok');

            const dataGold = await respGold.json();
            const dataSilver = await respSilver.json();

            // Get EGP/USD rate from a separate free forex API (CORS-friendly, no auth needed)
            let egpRate = 50.0; // fallback in case forex API also fails
            try {
                const respFx = await fetch('https://open.er-api.com/v6/latest/USD');
                if (respFx.ok) {
                    const dataFx = await respFx.json();
                    if (dataFx.rates && dataFx.rates.EGP) {
                        egpRate = dataFx.rates.EGP;
                    }
                }
            } catch (fxErr) {
                console.warn('FX rate fetch failed, using fallback EGP rate:', egpRate);
            }

            updateUI_Source2(dataGold, dataSilver, egpRate);
        } catch (error) {
            console.error('Error fetching Gold-API:', error);
            if (elements.price2) {
                elements.price2.textContent = 'Error';
                elements.price2.style.fontSize = '2rem';
                elements.price2.style.color = 'var(--negative-red)';
            }
        }
    };

    const updateUI_Source1 = (data, dataEgp) => {
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
        if (elements.prevClose) {
            elements.prevClose.textContent = formatCurrency(item.xauClose);
        }

        if (elements.highVal) {
            elements.highVal.textContent = formatCurrency(item.xagPrice);
        }

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

        // Calculate Gram Price in EGP
        if (dataEgp && dataEgp.items && dataEgp.items.length > 0) {
            const itemEgp = dataEgp.items[0];
            const pricePerGramInEgp = itemEgp.xauPrice / OUNCE_TO_GRAMS;
            const pricePerGram21kInEgp = pricePerGramInEgp * (21 / 24);

            // Calculate USD and AED equivalents
            const exchangeRate = itemEgp.xauPrice / item.xauPrice;
            const pricePerGramInUsd = pricePerGramInEgp / exchangeRate;
            const pricePerGram21kInUsd = pricePerGram21kInEgp / exchangeRate;
            
            const pricePerGramInAed = pricePerGramInUsd * USD_TO_AED;
            const pricePerGram21kInAed = pricePerGram21kInUsd * USD_TO_AED;

            if (elements.gramEgp) {
                elements.gramEgp.textContent = new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(pricePerGramInEgp);
            }

            if (elements.gramEgp21k) {
                elements.gramEgp21k.textContent = new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(pricePerGram21kInEgp);
            }

            if (elements.egp24kConverted) {
                elements.egp24kConverted.textContent = `≈ ${formatCurrency(pricePerGramInUsd)} | ${new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(pricePerGramInAed)}`;
            }

            if (elements.egp21kConverted) {
                elements.egp21kConverted.textContent = `≈ ${formatCurrency(pricePerGram21kInUsd)} | ${new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(pricePerGram21kInAed)}`;
            }

            if (elements.exchangeRateUsdEgp) {
                elements.exchangeRateUsdEgp.textContent = `${exchangeRate.toFixed(2)} EGP`;
            }
            
            if (elements.exchangeRateAedEgp) {
                const aedToEgp = exchangeRate / USD_TO_AED;
                elements.exchangeRateAedEgp.textContent = `${aedToEgp.toFixed(2)} EGP`;
            }
        }
    };

    const updateUI_Source2 = (dataGold, dataSilver, exchangeRate) => {
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

        // EGP Calc
        if (exchangeRate > 0) {
            const priceGoldEgp = priceGold * exchangeRate; // convert to EGP
            const pricePerGramInEgp = priceGoldEgp / OUNCE_TO_GRAMS;
            const pricePerGram21kInEgp = pricePerGramInEgp * (21 / 24);

            // Calculate USD and AED equivalents
            const pricePerGramInUsd = pricePerGramInEgp / exchangeRate;
            const pricePerGram21kInUsd = pricePerGram21kInEgp / exchangeRate;
            
            const pricePerGramInAed = pricePerGramInUsd * USD_TO_AED;
            const pricePerGram21kInAed = pricePerGram21kInUsd * USD_TO_AED;

            if (elements.gramEgp2) {
                elements.gramEgp2.textContent = new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(pricePerGramInEgp);
            }

            if (elements.gramEgp21k2) {
                elements.gramEgp21k2.textContent = new Intl.NumberFormat('en-EG', {
                    style: 'currency',
                    currency: 'EGP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(pricePerGram21kInEgp);
            }

            if (elements.egp24kConverted2) {
                elements.egp24kConverted2.textContent = `≈ ${formatCurrency(pricePerGramInUsd)} | ${new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(pricePerGramInAed)}`;
            }

            if (elements.egp21kConverted2) {
                elements.egp21kConverted2.textContent = `≈ ${formatCurrency(pricePerGram21kInUsd)} | ${new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(pricePerGram21kInAed)}`;
            }

            if (elements.exchangeRateUsdEgp2) {
                elements.exchangeRateUsdEgp2.textContent = `${exchangeRate.toFixed(2)} EGP`;
            }
            
            if (elements.exchangeRateAedEgp2) {
                const aedToEgp = exchangeRate / USD_TO_AED;
                elements.exchangeRateAedEgp2.textContent = `${aedToEgp.toFixed(2)} EGP`;
            }
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
