import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { SimulationInput, SimulationResult } from '../../../shared/api/simulator';
import { buildFallbackResult, simulateFinancialPlan } from '../../../shared/api/simulator';

const DEBOUNCE_DELAY = 300;
const API_ENDPOINT = '/api/simulator';

const initialState: SimulationInput = {
  monthlyIncome: 30000,
  monthlyExpenses: 18000,
  investmentRate: 0.1,
};

export function SimulatorScreen() {
  const [form, setForm] = useState<SimulationInput>(initialState);
  const [result, setResult] = useState<SimulationResult>(buildFallbackResult(initialState));
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsCalculating(true);
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const data = await simulateFinancialPlan(API_ENDPOINT, form, abortController.signal);
        setResult(data);
      } catch (err) {
        console.error(err);
        setResult(buildFallbackResult(form));
        setError('Não foi possível atualizar a simulação. Exibindo estimativa.');
      } finally {
        setIsCalculating(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [form]);

  function handleChange(key: keyof SimulationInput, value: string) {
    setForm((previous) => ({
      ...previous,
      [key]: Number(value),
    }));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulador Financeiro</Text>
      <Text style={styles.subtitle}>Atualize os valores e acompanhe o cálculo em tempo real.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Renda mensal</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={String(form.monthlyIncome)}
          onChangeText={(value) => handleChange('monthlyIncome', value)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Despesas mensais</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={String(form.monthlyExpenses)}
          onChangeText={(value) => handleChange('monthlyExpenses', value)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Taxa de investimento anual</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.input}
          value={String(form.investmentRate)}
          onChangeText={(value) => handleChange('investmentRate', value)}
        />
      </View>

      {isCalculating ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>calculando...</Text>
        </View>
      ) : (
        <View style={styles.result}>
          <Text style={styles.resultLabel}>Poupança mensal</Text>
          <Text style={styles.resultValue}>
            {result.monthlySavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>

          <Text style={styles.resultLabel}>Poupança anual</Text>
          <Text style={styles.resultValue}>
            {result.annualSavings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>

          <Text style={styles.resultLabel}>Retorno do investimento</Text>
          <Text style={styles.resultValue}>
            {result.investmentReturn.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    color: '#4a5568',
  },
  field: {
    gap: 8,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    textTransform: 'lowercase',
  },
  result: {
    gap: 12,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#edf2f7',
  },
  resultLabel: {
    fontSize: 12,
    color: '#4a5568',
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: '#e53e3e',
  },
});
