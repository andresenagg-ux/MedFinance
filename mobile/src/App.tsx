import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView>
      <View>
        <Text accessibilityRole="header">MedFinance Mobile</Text>
        <Text>Acompanhe seus indicadores financeiros em qualquer lugar.</Text>
      </View>
    </SafeAreaView>
  );
}
