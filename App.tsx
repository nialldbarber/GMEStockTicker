import React, {useEffect, useContext} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import tw from 'tailwind-react-native-classnames';
import {StonksProvider, StonksContext} from './context';
import {fetchData} from './utils';
import CurrentTime from './components/CurrentTime';
import Price from './components/Price';

export default function App() {
  return (
    <StonksProvider>
      <StatusBar style="light" />
      <GME />
    </StonksProvider>
  );
}

export function GME() {
  const {loading, setLoading, setError, setPrice, setCurrentTime} =
    useContext(StonksContext);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function getLatestPrice() {
      try {
        const data = await fetchData();
        const gme = data?.chart?.result[0];
        const time = new Date(gme.meta.regularMarketTime * 1000);

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
  }, []);

  return (
    <View style={[styles.container, tw`bg-gray-900`]}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <Text style={[styles.text, tw`absolute top-20 left-6 text-white`]}>
            GME
          </Text>
          <CurrentTime />
          <Price />
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
