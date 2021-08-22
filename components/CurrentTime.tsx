import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function CurrentTime({currentTime}: {currentTime: null | Date}) {
  return (
    <View style={[styles.container, tw`absolute top-40 left-7`]}>
      <Text style={tw`text-white text-xl`}>
        {currentTime && currentTime.toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
