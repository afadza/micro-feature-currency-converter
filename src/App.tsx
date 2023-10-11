import React, { useState } from 'react';

interface ConversionRates {
  [key: string]: number;
  USD: number;
  EUR: number;
  GBP: number;
  IDR: number;
}

const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [conversionRates, setConversionRates] = useState<ConversionRates | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const fetchConversionRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setConversionRates(data.rates);
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(event.target.value);
    setAmount(newAmount || 0);
  };

  const handleFromCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(event.target.value);
  };

  const handleConvert = () => {
    if (!conversionRates) return;

    const newConvertedAmount = (amount / conversionRates[fromCurrency]) * conversionRates[toCurrency];
    setConvertedAmount(newConvertedAmount);
  };

  if (!conversionRates) {
    fetchConversionRates();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <h1 className="text-4xl font-bold mb-8">Currency Converter</h1>

      <div className="flex flex-col md:flex-row items-center mb-4">
        <input type="number" value={amount} onChange={handleAmountChange} className="border rounded-lg p-2 mb-2 md:mb-0 mr-0 md:mr-4" />
        <select
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
          className="border rounded-lg p-2 font-bold cursor-pointer mb-2 md:mb-0 mr-0 md:mr-4">
          {conversionRates &&
            Object.keys(conversionRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
        <span className="mx-4">to</span>
        <select value={toCurrency} onChange={handleToCurrencyChange} className="border rounded-lg p-2 font-bold cursor-pointer">
          {conversionRates &&
            Object.keys(conversionRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
      </div>

      <button onClick={handleConvert} className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg text-white font-bold mb-4">
        Convert
      </button>

      <div className="bg-white rounded-lg p-4">
        <p className="font-bold mb-2">Result</p>
        <p>
          {amount} <span className="font-bold">{fromCurrency}</span> = {convertedAmount} <span className="font-bold">{toCurrency}</span>
        </p>
      </div>
    </div>
  );
};

export default App;
