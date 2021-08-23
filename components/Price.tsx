import React, {useContext} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {StonksContext} from '../context';

export default function Price() {
  const {price} = useContext(StonksContext);

  return (
    <View style={[styles.container, tw`absolute top-40 left-7 mt-10`]}>
      <Text style={tw`text-white text-xl`}>
        {new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(price)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
