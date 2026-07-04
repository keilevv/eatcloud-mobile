import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export const LoadingScreen: React.FC = () => (
  <View style={styles.container}>
    <Image
      source={require('../../assets/icon.png')}
      style={styles.icon}
      resizeMode="contain"
    />
    <ActivityIndicator size="large" color="#00ADF6" style={styles.spinner} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDFDFD',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ADF6',
    marginBottom: 24,
  },
  spinner: {
    marginTop: 8,
  },
});
