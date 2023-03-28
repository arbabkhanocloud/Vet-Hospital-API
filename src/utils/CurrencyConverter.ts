export const currencyConverter = (amount: number, currency: string) => {
  if (currency === "EUR") {
    return amount;
  }
  if (currency === "Bitcoin") {
    return amount * 27000;
  } else return amount;
};
