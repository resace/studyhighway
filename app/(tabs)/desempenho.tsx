import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Target, Award, Calendar, ChartBar as BarChart3, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface PerformanceData {
  subject: string;
  studyTime: number;
  questionsTotal: number;
  questionsCorrect: number;
  accuracy: number;
}

type PeriodType = 'week' | 'month' | '3months' | '6months' | '1year' | 'all';

export default function DesempenhoScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periodSectionCollapsed, setPeriodSectionCollapsed] = useState(false);
  
  // Dados de performance que mudam baseado no período selecionado
  const getPerformanceDataForPeriod = (): PerformanceData[] => {
    // Simulando dados diferentes para cada período
    const baseData = {
      week: [
        { subject: 'Direito Constitucional', studyTime: 300, questionsTotal: 40, questionsCorrect: 35, accuracy: 87.5 },
        { subject: 'Matemática', studyTime: 200, questionsTotal: 25, questionsCorrect: 20, accuracy: 80.0 },
        { subject: 'Português', studyTime: 150, questionsTotal: 20, questionsCorrect: 17, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 120, questionsTotal: 15, questionsCorrect: 12, accuracy: 80.0 },
        { subject: 'Informática', studyTime: 90, questionsTotal: 10, questionsCorrect: 8, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 100, questionsTotal: 12, questionsCorrect: 10, accuracy: 83.3 },
      ],
      month: [
        { subject: 'Direito Constitucional', studyTime: 1200, questionsTotal: 150, questionsCorrect: 128, accuracy: 85.3 },
        { subject: 'Matemática', studyTime: 800, questionsTotal: 100, questionsCorrect: 75, accuracy: 75.0 },
        { subject: 'Português', studyTime: 600, questionsTotal: 80, questionsCorrect: 68, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 450, questionsTotal: 60, questionsCorrect: 45, accuracy: 75.0 },
        { subject: 'Informática', studyTime: 300, questionsTotal: 40, questionsCorrect: 32, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 420, questionsTotal: 50, questionsCorrect: 38, accuracy: 76.0 },
      ],
      '3months': [
        { subject: 'Direito Constitucional', studyTime: 3600, questionsTotal: 450, questionsCorrect: 378, accuracy: 84.0 },
        { subject: 'Matemática', studyTime: 2400, questionsTotal: 300, questionsCorrect: 225, accuracy: 75.0 },
        { subject: 'Português', studyTime: 1800, questionsTotal: 240, questionsCorrect: 204, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 1350, questionsTotal: 180, questionsCorrect: 135, accuracy: 75.0 },
        { subject: 'Informática', studyTime: 900, questionsTotal: 120, questionsCorrect: 96, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 1260, questionsTotal: 150, questionsCorrect: 114, accuracy: 76.0 },
      ],
      '6months': [
        { subject: 'Direito Constitucional', studyTime: 7200, questionsTotal: 900, questionsCorrect: 756, accuracy: 84.0 },
        { subject: 'Matemática', studyTime: 4800, questionsTotal: 600, questionsCorrect: 450, accuracy: 75.0 },
        { subject: 'Português', studyTime: 3600, questionsTotal: 480, questionsCorrect: 408, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 2700, questionsTotal: 360, questionsCorrect: 270, accuracy: 75.0 },
        { subject: 'Informática', studyTime: 1800, questionsTotal: 240, questionsCorrect: 192, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 2520, questionsTotal: 300, questionsCorrect: 228, accuracy: 76.0 },
      ],
      '1year': [
        { subject: 'Direito Constitucional', studyTime: 14400, questionsTotal: 1800, questionsCorrect: 1512, accuracy: 84.0 },
        { subject: 'Matemática', studyTime: 9600, questionsTotal: 1200, questionsCorrect: 900, accuracy: 75.0 },
        { subject: 'Português', studyTime: 7200, questionsTotal: 960, questionsCorrect: 816, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 5400, questionsTotal: 720, questionsCorrect: 540, accuracy: 75.0 },
        { subject: 'Informática', studyTime: 3600, questionsTotal: 480, questionsCorrect: 384, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 5040, questionsTotal: 600, questionsCorrect: 456, accuracy: 76.0 },
      ],
      all: [
        { subject: 'Direito Constitucional', studyTime: 28800, questionsTotal: 3600, questionsCorrect: 3024, accuracy: 84.0 },
        { subject: 'Matemática', studyTime: 19200, questionsTotal: 2400, questionsCorrect: 1800, accuracy: 75.0 },
        { subject: 'Português', studyTime: 14400, questionsTotal: 1920, questionsCorrect: 1632, accuracy: 85.0 },
        { subject: 'Direito Administrativo', studyTime: 10800, questionsTotal: 1440, questionsCorrect: 1080, accuracy: 75.0 },
        { subject: 'Informática', studyTime: 7200, questionsTotal: 960, questionsCorrect: 768, accuracy: 80.0 },
        { subject: 'Raciocínio Lógico', studyTime: 10080, questionsTotal: 1200, questionsCorrect: 912, accuracy: 76.0 },
      ],
    };

    return baseData[selectedPeriod];
  };

  const periods = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: '3months', label: '3 Meses' },
    { key: '6months', label: '6 Meses' },
    { key: '1year', label: '1 Ano' },
    { key: 'all', label: 'Geral' },
  ];

  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (selectedPeriod === 'all') return;
    
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (selectedPeriod) {
        case 'week':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'month':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case '3months':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 3 : -3));
          break;
        case '6months':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 6 : -6));
          break;
        case '1year':
          newDate.setFullYear(prev.getFullYear() + (direction === 'next' ? 1 : -1));
          break;
      }
      return newDate;
    });
  };

  const getPeriodLabel = () => {
    if (selectedPeriod === 'all') return 'Período Geral';
    
    const formatOptions: { [key in PeriodType]: Intl.DateTimeFormatOptions } = {
      week: { day: '2-digit', month: 'short', year: 'numeric' },
      month: { month: 'long', year: 'numeric' },
      '3months': { month: 'short', year: 'numeric' },
      '6months': { month: 'short', year: 'numeric' },
      '1year': { year: 'numeric' },
      all: {}
    };

    const options = formatOptions[selectedPeriod];
    let label = currentDate.toLocaleDateString('pt-BR', options);
    
    if (selectedPeriod === 'week') {
      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 6);
      label = `${currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    } else if (selectedPeriod === '3months') {
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 2);
      label = `${currentDate.toLocaleDateString('pt-BR', { month: 'short' })} - ${endDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    } else if (selectedPeriod === '6months') {
      const endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 5);
      label = `${currentDate.toLocaleDateString('pt-BR', { month: 'short' })} - ${endDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    }
    
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  // Dados diferentes para cada período
  const getLineChartData = () => {
    const baseData = {
      week: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        data: [75, 78, 82, 85, 88, 90, 87],
      },
      month: {
        labels: ['S1', 'S2', 'S3', 'S4'],
        data: [78, 82, 85, 88],
      },
      '3months': {
        labels: ['M1', 'M2', 'M3'],
        data: [75, 82, 88],
      },
      '6months': {
        labels: ['T1', 'T2'],
        data: [78, 85],
      },
      '1year': {
        labels: ['S1', 'S2'],
        data: [80, 87],
      },
      all: {
        labels: ['2022', '2023', '2024'],
        data: [70, 78, 85],
      },
    };

    const periodData = baseData[selectedPeriod];
    
    return {
      labels: periodData.labels,
      datasets: [
        {
          data: periodData.data,
          color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
          strokeWidth: 3,
        },
      ],
      legend: ['Você'],
    };
  };

  // Obter dados de performance para o período atual
  const performanceData = getPerformanceDataForPeriod();

  const barChartData = {
    labels: performanceData.slice(0, 5).map(item => item.subject.split(' ')[0]),
    datasets: [
      {
        data: performanceData.slice(0, 5).map(item => item.accuracy),
      },
    ],
  };

  const totalStudyTime = performanceData.reduce((sum, item) => sum + item.studyTime, 0);
  const totalQuestions = performanceData.reduce((sum, item) => sum + item.questionsTotal, 0);
  const totalCorrect = performanceData.reduce((sum, item) => sum + item.questionsCorrect, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${Math.floor(minutes % 60)}min`;
  };

  const chartConfig = {
    backgroundColor: '#1a202c',
    backgroundGradientFrom: '#2d3748',
    backgroundGradientTo: '#2d3748',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#48bb78',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Análise de Desempenho</Text>
      </View>

      {/* Period Selector - Collapsible */}
      <View style={styles.periodSection}>
        <TouchableOpacity 
          style={styles.periodSectionHeader}
          onPress={() => setPeriodSectionCollapsed(!periodSectionCollapsed)}
        >
          <Text style={styles.sectionTitle}>Período de Análise</Text>
          {periodSectionCollapsed ? (
            <ChevronDown size={20} color="#a0aec0" />
          ) : (
            <ChevronUp size={20} color="#a0aec0" />
          )}
        </TouchableOpacity>
        
        {!periodSectionCollapsed && (
          <>
            <View style={styles.periodButtons}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.key && styles.periodButtonActive
                  ]}
                  onPress={() => {
                    setSelectedPeriod(period.key as PeriodType);
                    setCurrentDate(new Date());
                  }}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.periodButtonTextActive
                  ]}>
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Period Navigation */}
            {selectedPeriod !== 'all' && (
              <View style={styles.periodNavigation}>
                <TouchableOpacity
                  style={styles.periodNavButton}
                  onPress={() => navigatePeriod('prev')}
                >
                  <ChevronLeft size={20} color="#a0aec0" />
                </TouchableOpacity>
                
                <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
                
                <TouchableOpacity
                  style={styles.periodNavButton}
                  onPress={() => navigatePeriod('next')}
                >
                  <ChevronRight size={20} color="#a0aec0" />
                </TouchableOpacity>
              </View>
            )}
            
            {selectedPeriod === 'all' && (
              <Text style={styles.periodLabel}>{getPeriodLabel()}</Text>
            )}
          </>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Cards - Now affected by period */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Resumo do Período</Text>
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, styles.blueCard]}>
              <TrendingUp size={24} color="#ffffff" />
              <Text style={styles.overviewValue}>{overallAccuracy.toFixed(1)}%</Text>
              <Text style={styles.overviewLabel}>Desempenho Médio</Text>
            </View>
            
            <View style={[styles.overviewCard, styles.greenCard]}>
              <Clock size={24} color="#ffffff" />
              <Text style={styles.overviewValue}>{formatTime(totalStudyTime)}</Text>
              <Text style={styles.overviewLabel}>Tempo de Estudo</Text>
            </View>
            
            <View style={[styles.overviewCard, styles.orangeCard]}>
              <Target size={24} color="#ffffff" />
              <Text style={styles.overviewValue}>{totalCorrect}</Text>
              <Text style={styles.overviewLabel}>Questões Certas</Text>
            </View>
            
            <View style={[styles.overviewCard, styles.yellowCard]}>
              <Award size={24} color="#ffffff" />
              <Text style={styles.overviewValue}>{totalQuestions}</Text>
              <Text style={styles.overviewLabel}>Total de Questões</Text>
            </View>
          </View>
        </View>

        {/* Evolution Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Evolução do Desempenho</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={getLineChartData()}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Performance by Subject */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Desempenho por Matéria</Text>
          <View style={styles.chartCard}>
            <BarChart
              data={barChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
              }}
              style={styles.chart}
              yAxisSuffix="%"
            />
          </View>
        </View>

        {/* Detailed Performance Table */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Desempenho Detalhado</Text>
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Matéria</Text>
              <Text style={styles.tableHeaderText}>Tempo</Text>
              <Text style={styles.tableHeaderText}>Questões</Text>
              <Text style={styles.tableHeaderText}>Acertos</Text>
            </View>
            
            {performanceData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
                  {item.subject}
                </Text>
                <Text style={styles.tableCell}>{formatTime(item.studyTime)}</Text>
                <Text style={styles.tableCell}>{item.questionsCorrect}/{item.questionsTotal}</Text>
                <Text style={[styles.tableCell, styles.accuracyCell]}>
                  {item.accuracy.toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Performance Distribution */}
        <View style={styles.distributionSection}>
          <Text style={styles.sectionTitle}>Distribuição de Tempo</Text>
          <View style={styles.distributionCard}>
            {performanceData.map((item, index) => {
              const percentage = (item.studyTime / totalStudyTime) * 100;
              return (
                <View key={index} style={styles.distributionItem}>
                  <View style={styles.distributionHeader}>
                    <Text style={styles.distributionSubject}>{item.subject}</Text>
                    <Text style={styles.distributionPercentage}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.distributionBar}>
                    <View 
                      style={[
                        styles.distributionFill,
                        { width: `${percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.distributionTime}>{formatTime(item.studyTime)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
  },
  content: {
    flex: 1,
  },
  overviewSection: {
    padding: 20,
    paddingTop: 0,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  blueCard: {
    backgroundColor: '#2b6cb0',
  },
  greenCard: {
    backgroundColor: '#48bb78',
  },
  orangeCard: {
    backgroundColor: '#ed8936',
  },
  yellowCard: {
    backgroundColor: '#d69e2e',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  periodSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d3748',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  periodSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1a202c',
    borderWidth: 1,
    borderColor: '#4a5568',
    minWidth: '30%',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#48bb78',
    borderColor: '#48bb78',
  },
  periodButtonText: {
    color: '#a0aec0',
    fontWeight: '600',
    fontSize: 12,
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  periodNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  periodNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2d3748',
  },
  periodLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  chartSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chartCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  chart: {
    borderRadius: 16,
  },
  tableSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tableCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a202c',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
  },
  tableCell: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 12,
    textAlign: 'center',
  },
  accuracyCell: {
    color: '#48bb78',
    fontWeight: 'bold',
  },
  distributionSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  distributionCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
    gap: 16,
  },
  distributionItem: {
    gap: 8,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionSubject: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  distributionPercentage: {
    color: '#48bb78',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distributionBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },
  distributionTime: {
    color: '#a0aec0',
    fontSize: 12,
  },
});