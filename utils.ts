import {END_POINT, TICKERS} from './constants';

interface Tickers {
  lastsale: string;
  marketCap: string;
  name: string;
  netchange: string;
  pctchange: string;
  symbol: string;
  url: string;
}

export async function fetchData(END_POINT: string): Promise<any> {
  const response = await fetch(END_POINT);
  const json = await response.json();
  return json;
}

export const round = (val: number): number | null =>
  val ? +val.toFixed(2) : null;

export const getTickerSymbol = (ticker: string): string =>
  `${END_POINT}${ticker}`;

export async function fetchListOfTickers(): Promise<Tickers[]> {
  const tickers = await fetchData(TICKERS);
  const listOfTickers = tickers.data.table.rows;
  console.log(listOfTickers);
  return listOfTickers;
}
