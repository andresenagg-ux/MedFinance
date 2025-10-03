import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { arc, pie, PieArcDatum } from 'd3-shape';

type SimulatorRequest = {
  monthlyIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
};

type ApiDistribution = {
  needs?: number;
  wants?: number;
  savings?: number;
};

type SimulatorResponse = {
  finalBalance?: number;
  distribution?: ApiDistribution;
};

type DistributionItem = {
  key: keyof ApiDistribution;
  label: string;
  percentage: number;
  color: string;
  value: number;
};

const PIE_SLICES: Array<Omit<DistributionItem, 'value'>> = [
  {
    key: 'needs',
    label: 'Essenciais (50%)',
    percentage: 50,
    color: '#4F46E5',
  },
  {
    key: 'wants',
    label: 'Estilo de Vida (30%)',
    percentage: 30,
    color: '#38BDF8',
  },
  {
    key: 'savings',
    label: 'Investimentos (20%)',
    percentage: 20,
    color: '#34D399',
  },
];

const DEFAULT_RESULT: SimulatorResponse = {
  finalBalance: 0,
  distribution: {
    needs: 0,
    wants: 0,
    savings: 0,
  },
};

const RADIUS = 96;

const formatCurrency = (value: number) =>
  Number.isFinite(value)
    ? value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
      })
    : 'R$ 0,00';

const normalizeNumber = (value: string) => {
  const parsed = parseFloat(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildDistribution = (
  baseAmount: number,
  apiDistribution?: ApiDistribution,
): DistributionItem[] =>
  PIE_SLICES.map((slice) => {
    const apiValue = apiDistribution?.[slice.key];
    const value =
      typeof apiValue === 'number' && Number.isFinite(apiValue)
        ? apiValue
        : (baseAmount * slice.percentage) / 100;

    return {
      ...slice,
      value: Math.max(0, value),
    };
  });

const FinanceSimulatorScreen: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState('');
  const [variableExpenses, setVariableExpenses] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulatorResponse>(DEFAULT_RESULT);

  const baseAmount = useMemo(() => {
    if (result?.distribution) {
      const distributionSum = Object.values(result.distribution)
        .filter((value) => typeof value === 'number')
        .reduce((acc, value) => acc + (value ?? 0), 0);

      if (distributionSum > 0) {
        return distributionSum;
      }
    }

    if (typeof result?.finalBalance === 'number' && result.finalBalance > 0) {
      return result.finalBalance;
    }

    const income = normalizeNumber(monthlyIncome);
    const fixed = normalizeNumber(fixedExpenses);
    const variable = normalizeNumber(variableExpenses);

    const fallback = income - fixed - variable;
    return fallback > 0 ? fallback : income;
  }, [fixedExpenses, monthlyIncome, result, variableExpenses]);

  const distribution = useMemo(
    () => buildDistribution(baseAmount, result?.distribution),
    [baseAmount, result?.distribution],
  );

  const pieSlices = useMemo(() => {
    const pieGenerator = pie<DistributionItem>().value((item) => item.value).sort(null);
    return pieGenerator(distribution);
  }, [distribution]);

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);

    const payload: SimulatorRequest = {
      monthlyIncome: normalizeNumber(monthlyIncome),
      fixedExpenses: normalizeNumber(fixedExpenses),
      variableExpenses: normalizeNumber(variableExpenses),
    };

    try {
      const response = await fetch('/finance/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Não foi possível calcular no momento.');
      }

      const data: SimulatorResponse = await response.json();

      setResult({
        finalBalance: data?.finalBalance ?? payload.monthlyIncome - payload.fixedExpenses - payload.variableExpenses,
        distribution: data?.distribution,
      });
    } catch (fetchError) {
      console.error('Erro ao consultar simulador financeiro', fetchError);
      setError('Erro ao consultar simulador. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [fixedExpenses, monthlyIncome, variableExpenses]);

  const arcGenerator = useMemo(
    () =>
      arc<PieArcDatum<DistributionItem>>()
        .outerRadius(RADIUS)
        .innerRadius(24),
    [],
  );

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Simulador Financeiro</Text>
      <Text style={styles.subtitle}>
        Entenda seu saldo mensal e como distribuí-lo de forma sustentável no modelo 50/30/20.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados Mensais</Text>
        <TextInput
          style={styles.input}
          placeholder="Renda mensal"
          keyboardType="numeric"
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
        />
        <TextInput
          style={styles.input}
          placeholder="Gastos fixos"
          keyboardType="numeric"
          value={fixedExpenses}
          onChangeText={setFixedExpenses}
        />
        <TextInput
          style={styles.input}
          placeholder="Gastos variáveis"
          keyboardType="numeric"
          value={variableExpenses}
          onChangeText={setVariableExpenses}
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Calcular</Text>}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.sectionTitle}>Resultado</Text>
        <Text style={styles.balanceLabel}>Saldo final</Text>
        <Text style={styles.balanceValue}>{formatCurrency(result?.finalBalance ?? 0)}</Text>

        <View style={styles.chartWrapper}>
          <Svg width={RADIUS * 2} height={RADIUS * 2}>
            <G x={RADIUS} y={RADIUS}>
              {pieSlices.map((slice, index) => (
                <Path
                  key={`slice-${slice.data.key}-${index}`}
                  d={arcGenerator(slice) ?? undefined}
                  fill={slice.data.color}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </G>
          </Svg>
        </View>

        <View>
          {distribution.map((item) => (
            <View key={item.key} style={styles.distributionRow}>
              <View style={[styles.distributionColor, { backgroundColor: item.color }]} />
              <View style={styles.distributionContent}>
                <Text style={styles.distributionLabel}>{item.label}</Text>
                <Text style={styles.distributionValue}>{formatCurrency(item.value)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 12,
    backgroundColor: '#F8FAFF',
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#DC2626',
    fontSize: 14,
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  distributionColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  distributionContent: {
    flex: 1,
  },
  distributionLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  distributionValue: {
    fontSize: 14,
    color: '#475569',
    marginTop: 2,
  },
});

export default FinanceSimulatorScreen;

