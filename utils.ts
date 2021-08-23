import {END_POINT} from './constants';

export async function fetchData(): Promise<any> {
  const response = await fetch(END_POINT);
  const json = await response.json();
  return json;
}