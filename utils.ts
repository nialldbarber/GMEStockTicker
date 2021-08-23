export async function fetchData(END_POINT: string): Promise<any> {
  const response = await fetch(END_POINT);
  const json = await response.json();
  return json;
}

export const round = (val: number): number | null =>
  val ? +val.toFixed(2) : null;

export const getTickerSymbol = (ticker: string): string =>
  `https://yahoo-finance-api.vercel.app/${ticker}`;
