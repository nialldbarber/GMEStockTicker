import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import tw from 'tailwind-react-native-classnames';
import {StonksProvider, StonksContext} from './context';
import {fetchData, round, getTickerSymbol, fetchListOfTickers} from './utils';
import CurrentTime from './components/CurrentTime';
import Price from './components/Price';

interface TimestampMap {
  date: Date;
  day: number;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
}

export default function App() {
  return (
    <StonksProvider>
      <StatusBar style="light" />
      <GME />
    </StonksProvider>
  );
}

export function GME() {
  const [input, setInput] = useState<string>('');
  const [ticker, setTicker] = useState<string>('');
  const {loading, setLoading, setError, setPrice, setCurrentTime} =
    useContext(StonksContext);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function getLatestPrice() {
      try {
        const data = await fetchData(getTickerSymbol(ticker));
        const gme = data?.chart?.result[0];
        const time = new Date(gme.meta.regularMarketTime * 1000);
        const quote = gme.indicators.quote[0];

        const allPrices = gme.timestamp.map(
          (time: number, i: number): TimestampMap => ({
            date: new Date(time * 1000),
            day: new Date(time).getDate() + 1,
            open: round(quote.open[i]),
            high: round(quote.high[i]),
            low: round(quote.low[i]),
            close: round(quote.close[i]),
          })
        );

        setPrice && setPrice(gme.meta.regularMarketPrice.toFixed(2));
        setCurrentTime && setCurrentTime(time);
        setLoading && setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading && setLoading(false);
        setError && setError(true);
      }

      timeoutId = setTimeout(getLatestPrice, 5000);
    }
    timeoutId = setTimeout(getLatestPrice, 5000);

    return () => clearTimeout(timeoutId);
  }, [ticker]);

  useEffect(() => {
    fetchListOfTickers();
  }, []);

  return (
    <View style={[styles.container, tw`bg-gray-900`]}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <Text style={[styles.text, tw`absolute top-20 left-6 text-white`]}>
            {ticker === '' ? 'AMZN' : ticker}
          </Text>
          <CurrentTime />
          <Price />
          <View style={[tw`absolute bottom-20`, {width: 300}]}>
            <TextInput
              style={tw`p-2 bg-white rounded-t-sm`}
              value={input.toUpperCase()}
              autoCorrect={false}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity
              style={tw`flex items-center justify-center h-10 bg-red-500 my-1 rounded-t-sm`}
              onPress={() => {
                setTicker(input.toUpperCase());
                setInput('');
              }}
            >
              <Text style={tw`text-white text-lg`}>Change Ticker</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 60,
  },
});
