import { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
export default function App() {
  const [saldo, setSaldo] = useState(0);
  const atualizarSaldo = valor => {
    setSaldo(prev => prev + valor);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finanças Médicas</Text>
        <Text style={styles.subtitle}>Saldo atual: R${saldo.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => atualizarSaldo(100)}>
          <Text style={styles.buttonText}>Adicionar R$100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => atualizarSaldo(-50)}>
          <Text style={styles.buttonText}>Remover R$50</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#475569'
  },
  actions: {
    flexDirection: 'row',
    gap: 16
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  }
});
