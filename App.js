import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import Product from './components/Product';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Product />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbc2eb',
  },
});