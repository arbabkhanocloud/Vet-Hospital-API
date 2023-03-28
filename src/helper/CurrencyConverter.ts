const { CurrencyConverter } = require("currency-converter");
const currencyConverter = new CurrencyConverter();
async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  const rate = await currencyConverter.convert(from, to);
  return amount * rate;
}

export default convertCurrency;
