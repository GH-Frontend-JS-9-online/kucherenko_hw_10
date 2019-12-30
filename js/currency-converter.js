'use strict'
// const axios = require('axios');

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
      const response = await axios.get('http://www.apilayer.net/api/live?access_key=af9e2ea885cdf255e17836c9c1e97c8b')

      const rate = response.data.quotes;
      const baseCurrency = response.data.source;
      const usd = 1 / rate[`${baseCurrency}${fromCurrency}`];
      const exchangeRate = usd * rate[`${baseCurrency}${toCurrency}`];
  
      return exchangeRate;
    } catch (error) {
      throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`);
    }
};
  
const getCountries = async (currencyCode) => {
    try {
      const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
  
      return response.data.map(country => country.name);
    } catch (error) {
      throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};
  
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);
  
    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};
  

async function createOptions(arg) {
	const response = await axios.get('http://www.apilayer.net/api/live?access_key=af9e2ea885cdf255e17836c9c1e97c8b')
	let currency = Object.keys(response.data.quotes).map((item) => item.slice(3));
   
  for (let item of currency) {
    let addOption = document.createElement('option');
    addOption.innerHTML = item;
    arg.append(addOption); 
  }
}

function result() {
	let addOptionFrom = document.getElementById('fromCurrencySelect')
	let addOptionTo = document.getElementById('toCurrencySelect')
  createOptions(addOptionFrom);
  createOptions(addOptionTo);

  document.getElementById('convert').onclick = function() {
    let fromCurrency = document.getElementById('fromCurrencySelect').value;
    let toCurrency = document.getElementById('toCurrencySelect').value;
    let amount = document.getElementById('amount').value;
    
    convertCurrency(fromCurrency, toCurrency, amount).then((message) => {
        console.log(message);
      document.getElementById('result').innerHTML = message;
    }).catch((error) => {
      console.log(error.message);
    })
  }
}

result();