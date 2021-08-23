import React, {useReducer, createContext, PropsWithChildren} from 'react';

const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const SET_PRICE = 'SET_PRICE';
const SET_CURRENT_TIME = 'SET_CURRENT_TIME';

interface StonksState {
  loading: boolean;
  error: boolean;
  price: number;
  currentTime: null | Date;
  setLoading?: (loading: boolean) => void;
  setError?: (err: boolean) => void;
  setPrice?: (price: number) => void;
  setCurrentTime?: (currentTime: Date) => void;
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

function stonksReducer(state: StonksState, action: Action): StonksState {
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

export const StonksProvider = (props: PropsWithChildren<{}>) => {
  const [{loading, error, currentTime, price}, dispatch] = useReducer(
    stonksReducer,
    initialState
  );

  const setLoading = (loading: boolean) =>
    dispatch({type: SET_LOADING, loading});
  const setError = (err: boolean) => dispatch({type: SET_ERROR, err});
  const setPrice = (price: number) => dispatch({type: SET_PRICE, price});
  const setCurrentTime = (currentTime: Date) =>
    dispatch({type: SET_CURRENT_TIME, currentTime});

  return (
    <StonksContext.Provider
      value={{
        loading,
        error,
        currentTime,
        price,
        setLoading,
        setError,
        setPrice,
        setCurrentTime,
      }}
      {...props}
    />
  );
};
