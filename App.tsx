import React, {useEffect, useReducer, createContext, useContext} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import CurrentTime from './components/CurrentTime';
import {END_POINT} from './constants';

const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_PRICE = 'SET_PRICE';
const SET_CURRENT_TIME = 'SET_CURRENT_TIME';

export async function fetchData(): Promise<any> {
  const response = await fetch(END_POINT);
  const json = await response.json();
  return json;
}

interface StonksState {
  loading: boolean;
  error: boolean;
  price: number;
  currentTime: null | Date;
  setLoading?: (loading: boolean) => boolean;
  setError?: (err: boolean) => boolean;
  setPrice?: (price: number) => number;
  setCurrentTime?: (currentTime: Date) => Date;
}

type Action =
  | {type: 'SET_LOADING'; loading: boolean}
  | {type: 'SET_ERROR'; err: boolean}
  | {type: 'SET_PRICE'; price: number}
  | {type: 'SET_CURRENT_TIME'; currentTime: Date};

const initialState: StonksState = {
  loading: true,
  error: false,
  price: -1,
  currentTime: null,
};

export function stonksReducer(state: StonksState, action: Action) {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.err,
      };
    case SET_PRICE:
      return {
        ...state,
        price: action.price,
      };
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.currentTime,
      };
  }
}

export const StonksContext = createContext<StonksState>(initialState);

export const StonksProvider = (props: any) => {
  const [state, dispatch] = useReducer(stonksReducer, initialState);

  const setLoading = (loading: boolean) =>
    dispatch({type: SET_LOADING, loading});
  const setError = (err: boolean) => dispatch({type: SET_ERROR, err});
  const setPrice = (price: number) => dispatch({type: SET_PRICE, price});
  const setCurrentTime = (currentTime: Date) =>
    dispatch({type: SET_CURRENT_TIME, currentTime});

  return (
    <StonksContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        currentTime: state.currentTime,
        price: state.price,
        setLoading,
        setError,
        setPrice,
        setCurrentTime,
      }}
      {...props}
    />
  );
};

export default function App() {
  return (
    <StonksProvider>
      <StatusBar style="light" />
      <GME />
    </StonksProvider>
  );
}

export function GME() {
  const {
    loading,
    error,
    currentTime,
    price,
    setLoading,
    setError,
    setPrice,
    setCurrentTime,
  } = useContext(StonksContext);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    async function getLatestPrice() {
      try {
        const data = await fetchData();
        const gme = data?.chart?.result[0];
        const time = new Date(gme.meta.regularMarketTime * 1000);

        setPrice && setPrice(gme.meta.regularMarketPrice.toFixed(2));
        setCurrentTime && setCurrentTime(time);
      } catch (err) {
        console.log(err);
      }

      timeoutId = setTimeout(getLatestPrice, 5000);
    }
    timeoutId = setTimeout(getLatestPrice, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <View style={[styles.container, tw`bg-gray-900`]}>
      <Text style={[styles.text, tw`absolute top-20 left-5 text-white`]}>
        GME
      </Text>
      <CurrentTime currentTime={currentTime} />
      <Text style={{position: 'absolute', color: 'white', top: 400, left: 50}}>
        Price is: {`$${price}`}
      </Text>
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
