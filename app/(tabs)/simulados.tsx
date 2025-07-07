import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, ChevronRight, Clock, CircleCheck as CheckCircle, Circle, Filter, Edit3, Calendar, Eye, EyeOff, Trash2, Settings, X } from 'lucide-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface SimuladoResult {
  subject: string;
  questionsTotal: number;
  questionsCorrect: number;
  timeSpent: number; // minutes
}

interface Simulado {
  id: string;
  name: string;
  date: Date;
  results: SimuladoResult[];
  totalQuestions: number;
  totalCorrect: number;
  totalTime: number;
  accuracy: number;
}

interface Subject {
  id: string;
  name: string;
}

export default function SimuladosScreen() {
  const [simulados, setSimulados] = useState<Simulado[]>([
    {
      id: '1',
      name: 'Simulado PF - Edital 2024',
      date: new Date('2024-01-15'),
      results: [
        { subject: 'Direito Constitucional', questionsTotal: 25, questionsCorrect: 22, timeSpent: 45 },
        { subject: 'Direito Administrativo', questionsTotal: 25, questionsCorrect: 20, timeSpent: 50 },
        { subject: 'Matemática', questionsTotal: 20, questionsCorrect: 15, timeSpent: 60 },
        { subject: 'Português', questionsTotal: 20, questionsCorrect: 18, timeSpent: 40 },
        { subject: 'Informática', questionsTotal: 10, questionsCorrect: 8, timeSpent: 25 },
      ],
      totalQuestions: 100,
      totalCorrect: 83,
      totalTime: 220,
      accuracy: 83.0,
    },
    {
      id: '2',
      name: 'Simulado PCDF - Escrivão',
      date: new Date('2024-01-10'),
      results: [
        { subject: 'Direito Constitucional', questionsTotal: 20, questionsCorrect: 16, timeSpent: 35 },
        { subject: 'Direito Penal', questionsTotal: 20, questionsCorrect: 17, timeSpent: 40 },
        { subject: 'Português', questionsTotal: 15, questionsCorrect: 13, timeSpent: 30 },
      ],
      totalQuestions: 55,
      totalCorrect: 46,
      totalTime: 105,
      accuracy: 83.6,
    },
  ]);

  // Matérias existentes (simulando dados do app)
  const [existingSubjects] = useState<Subject[]>([
    { id: '1', name: 'Direito Constitucional' },
    { id: '2', name: 'Matemática' },
    { id: '3', name: 'Português' },
    { id: '4', name: 'Direito Administrativo' },
    { id: '5', name: 'Informática' },
    { id: '6', name: 'Raciocínio Lógico' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);
  const [newSimulado, setNewSimulado] = useState({
    name: '',
    date: new Date(),
    results: [] as SimuladoResult[],
  });
  const [currentResult, setCurrentResult] = useState<Partial<SimuladoResult>>({});
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newSubjectName, setNewSubjectName] = useState('');

  const addSimuladoResult = () => {
    if (!currentResult.subject || !currentResult.questionsTotal || !currentResult.questionsCorrect || !currentResult.timeSpent) {
      Alert.alert('Erro', 'Preencha todos os campos do resultado');
      return;
    }

    setNewSimulado(prev => ({
      ...prev,
      results: [...prev.results, currentResult as SimuladoResult]
    }));
    setCurrentResult({});
    setSelectedSubject('');
  };

  const selectSubject = (subjectName: string) => {
    setCurrentResult(prev => ({ ...prev, subject: subjectName }));
    setSelectedSubject(subjectName);
    setShowSubjectModal(false);
  };

  const addNewSubject = () => {
    if (!newSubjectName.trim()) {
      Alert.alert('Erro', 'Digite o nome da nova matéria');
      return;
    }
    
    setCurrentResult(prev => ({ ...prev, subject: newSubjectName }));
    setSelectedSubject(newSubjectName);
    setNewSubjectName('');
    setShowSubjectModal(false);
  };

  const saveSimulado = () => {
    if (!newSimulado.name || newSimulado.results.length === 0) {
      Alert.alert('Erro', 'Digite o nome do simulado e adicione pelo menos um resultado');
      return;
    }

    const totalQuestions = newSimulado.results.reduce((sum, r) => sum + r.questionsTotal, 0);
    const totalCorrect = newSimulado.results.reduce((sum, r) => sum + r.questionsCorrect, 0);
    const totalTime = newSimulado.results.reduce((sum, r) => sum + r.timeSpent, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    const simulado: Simulado = {
      id: Date.now().toString(),
      name: newSimulado.name,
      date: newSimulado.date,
      results: newSimulado.results,
      totalQuestions,
      totalCorrect,
      totalTime,
      accuracy,
    };

    setSimulados(prev => [simulado, ...prev]);
    resetForm();
    setShowAddModal(false);
    Alert.alert('Sucesso', 'Simulado registrado com sucesso!');
  };

  const editSimulado = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    setNewSimulado({
      name: simulado.name,
      date: simulado.date,
      results: [...simulado.results],
    });
    setShowEditModal(true);
  };

  const updateSimulado = () => {
    if (!editingSimulado || !newSimulado.name || newSimulado.results.length === 0) {
      Alert.alert('Erro', 'Digite o nome do simulado e adicione pelo menos um resultado');
      return;
    }

    const totalQuestions = newSimulado.results.reduce((sum, r) => sum + r.questionsTotal, 0);
    const totalCorrect = newSimulado.results.reduce((sum, r) => sum + r.questionsCorrect, 0);
    const totalTime = newSimulado.results.reduce((sum, r) => sum + r.timeSpent, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    setSimulados(prev => prev.map(s => 
      s.id === editingSimulado.id 
        ? {
            ...s,
            name: newSimulado.name,
            date: newSimulado.date,
            results: newSimulado.results,
            totalQuestions,
            totalCorrect,
            totalTime,
            accuracy,
          }
        : s
    ));

    resetForm();
    setEditingSimulado(null);
    setShowEditModal(false);
    Alert.alert('Sucesso', 'Simulado atualizado com sucesso!');
  };

  const deleteSimulado = (simuladoId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este simulado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setSimulados(prev => prev.filter(s => s.id !== simuladoId));
            Alert.alert('Sucesso', 'Simulado excluído!');
          },
        },
      ]
    );
  };

  const removeResult = (index: number) => {
    setNewSimulado(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setNewSimulado({ name: '', date: new Date(), results: [] });
    setCurrentResult({});
    setSelectedSubject('');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#48bb78';
    if (accuracy >= 70) return '#d69e2e';
    return '#e53e3e';
  };

  const totalSimulados = simulados.length;
  const averageAccuracy = simulados.length > 0 
    ? simulados.reduce((sum, s) => sum + s.accuracy, 0) / simulados.length 
    : 0;
  const bestAccuracy = simulados.length > 0 ? Math.max(...simulados.map(s => s.accuracy)) : 0;
  const totalTimeSpent = simulados.reduce((sum, s) => sum + s.totalTime, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simulados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas Gerais</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.blueCard]}>
              <Text style={styles.statValue}>{totalSimulados}</Text>
              <Text style={styles.statLabel}>Simulados</Text>
            </View>
            
            <View style={[styles.statCard, styles.greenCard]}>
              <Text style={styles.statValue}>{averageAccuracy.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Média Geral</Text>
            </View>
            
            <View style={[styles.statCard, styles.orangeCard]}>
              <Text style={styles.statValue}>{bestAccuracy.toFixed(1)}%</Text>
              <Text style={styles.statLabel}>Melhor Resultado</Text>
            </View>
            
            <View style={[styles.statCard, styles.yellowCard]}>
              <Text style={styles.statValue}>{formatTime(totalTimeSpent)}</Text>
              <Text style={styles.statLabel}>Tempo Total</Text>
            </View>
          </View>
        </View>

        {/* Simulados List */}
        <View style={styles.simuladosSection}>
          <Text style={styles.sectionTitle}>Histórico de Simulados</Text>
          
          {simulados.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum simulado registrado</Text>
              <Text style={styles.emptySubtext}>Adicione seu primeiro simulado para começar o acompanhamento</Text>
            </View>
          ) : (
            simulados.map((simulado) => (
              <View key={simulado.id} style={styles.simuladoCard}>
                <View style={styles.simuladoHeader}>
                  <View style={styles.simuladoInfo}>
                    <Text style={styles.simuladoName}>{simulado.name}</Text>
                    <View style={styles.simuladoMeta}>
                      <Calendar size={14} color="#a0aec0" />
                      <Text style={styles.simuladoDate}>
                        {simulado.date.toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.simuladoActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => editSimulado(simulado)}
                    >
                      <Edit3 size={16} color="#a0aec0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteSimulado(simulado.id)}
                    >
                      <Trash2 size={16} color="#e53e3e" />
                    </TouchableOpacity>
                    <View style={styles.simuladoScore}>
                      <Text 
                        style={[
                          styles.accuracyText, 
                          { color: getAccuracyColor(simulado.accuracy) }
                        ]}
                      >
                        {simulado.accuracy.toFixed(1)}%
                      </Text>
                      <Text style={styles.questionsText}>
                        {simulado.totalCorrect}/{simulado.totalQuestions}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.simuladoStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color="#a0aec0" />
                    <Text style={styles.statText}>{formatTime(simulado.totalTime)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statText}>{simulado.results.length} matérias</Text>
                  </View>
                </View>

                {/* Results by Subject */}
                <View style={styles.subjectResults}>
                  {simulado.results.map((result, index) => {
                    const subjectAccuracy = (result.questionsCorrect / result.questionsTotal) * 100;
                    return (
                      <View key={index} style={styles.subjectResult}>
                        <Text style={styles.subjectName}>{result.subject}</Text>
                        <View style={styles.subjectStats}>
                          <Text style={styles.subjectQuestions}>
                            {result.questionsCorrect}/{result.questionsTotal}
                          </Text>
                          <Text 
                            style={[
                              styles.subjectAccuracy,
                              { color: getAccuracyColor(subjectAccuracy) }
                            ]}
                          >
                            {subjectAccuracy.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Simulado Modal */}
      <Modal
        visible={showAddModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetForm();
          setEditingSimulado(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showEditModal ? 'Editar Simulado' : 'Registrar Simulado'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                  setEditingSimulado(null);
                }}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                style={styles.modalInput}
                placeholder="Nome do simulado"
                placeholderTextColor="#a0aec0"
                value={newSimulado.name}
                onChangeText={(text) => setNewSimulado(prev => ({ ...prev, name: text }))}
              />

              <View style={styles.resultSection}>
                <Text style={styles.resultTitle}>Adicionar Resultado por Matéria</Text>
                
                <TouchableOpacity
                  style={styles.subjectSelector}
                  onPress={() => setShowSubjectModal(true)}
                >
                  <Text style={[styles.subjectSelectorText, !selectedSubject && styles.placeholder]}>
                    {selectedSubject || 'Selecionar matéria'}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.inputGrid}>
                  <View style={styles.inputRow}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Total de questões</Text>
                      <TextInput
                        style={styles.gridInput}
                        placeholder="0"
                        placeholderTextColor="#a0aec0"
                        keyboardType="numeric"
                        value={currentResult.questionsTotal?.toString() || ''}
                        onChangeText={(text) => setCurrentResult(prev => ({ 
                          ...prev, 
                          questionsTotal: parseInt(text) || 0 
                        }))}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Questões certas</Text>
                      <TextInput
                        style={styles.gridInput}
                        placeholder="0"
                        placeholderTextColor="#a0aec0"
                        keyboardType="numeric"
                        value={currentResult.questionsCorrect?.toString() || ''}
                        onChangeText={(text) => setCurrentResult(prev => ({ 
                          ...prev, 
                          questionsCorrect: parseInt(text) || 0 
                        }))}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Tempo gasto (minutos)</Text>
                    <TextInput
                      style={styles.gridInput}
                      placeholder="0"
                      placeholderTextColor="#a0aec0"
                      keyboardType="numeric"
                      value={currentResult.timeSpent?.toString() || ''}
                      onChangeText={(text) => setCurrentResult(prev => ({ 
                        ...prev, 
                        timeSpent: parseInt(text) || 0 
                      }))}
                    />
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.addResultButton}
                  onPress={addSimuladoResult}
                >
                  <Text style={styles.addResultText}>Adicionar Resultado</Text>
                </TouchableOpacity>
              </View>

              {/* Added Results */}
              {newSimulado.results.length > 0 && (
                <View style={styles.addedResults}>
                  <Text style={styles.addedResultsTitle}>Resultados Adicionados:</Text>
                  {newSimulado.results.map((result, index) => (
                    <View key={index} style={styles.addedResultItem}>
                      <Text style={styles.addedResultText}>
                        {result.subject}: {result.questionsCorrect}/{result.questionsTotal} 
                        ({((result.questionsCorrect / result.questionsTotal) * 100).toFixed(1)}%)
                      </Text>
                      <TouchableOpacity
                        style={styles.removeResultButton}
                        onPress={() => removeResult(index)}
                      >
                        <Trash2 size={14} color="#e53e3e" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setEditingSimulado(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={showEditModal ? updateSimulado : saveSimulado}
                >
                  <Text style={styles.saveButtonText}>
                    {showEditModal ? 'Atualizar' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Subject Selection Modal */}
      <Modal
        visible={showSubjectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.subjectModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Matéria</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSubjectModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.subjectList}>
                {existingSubjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    style={styles.subjectItem}
                    onPress={() => selectSubject(subject.name)}
                  >
                    <Text style={styles.subjectItemText}>{subject.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.newSubjectSection}>
                <Text style={styles.newSubjectTitle}>Ou criar nova matéria:</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nome da nova matéria"
                  placeholderTextColor="#a0aec0"
                  value={newSubjectName}
                  onChangeText={setNewSubjectName}
                />
                <TouchableOpacity
                  style={styles.addNewSubjectButton}
                  onPress={addNewSubject}
                >
                  <Text style={styles.addNewSubjectText}>Criar e Selecionar</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSubjectModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#48bb78',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
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
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  simuladosSection: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  simuladoCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  simuladoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  simuladoInfo: {
    flex: 1,
  },
  simuladoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  simuladoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  simuladoDate: {
    fontSize: 12,
    color: '#a0aec0',
  },
  simuladoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1a202c',
  },
  simuladoScore: {
    alignItems: 'flex-end',
  },
  accuracyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  questionsText: {
    fontSize: 12,
    color: '#a0aec0',
  },
  simuladoStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#a0aec0',
  },
  subjectResults: {
    gap: 8,
  },
  subjectResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subjectName: {
    fontSize: 14,
    color: '#e2e8f0',
    flex: 1,
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectQuestions: {
    fontSize: 12,
    color: '#a0aec0',
  },
  subjectAccuracy: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#2d3748',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.85,
    width: '100%',
  },
  subjectModalContainer: {
    backgroundColor: '#2d3748',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.75,
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
  },
  modalScrollView: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  modalInput: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  subjectSelector: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  subjectSelectorText: {
    color: '#ffffff',
    fontSize: 16,
  },
  placeholder: {
    color: '#a0aec0',
  },
  subjectList: {
    marginBottom: 20,
  },
  subjectItem: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  subjectItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  newSubjectSection: {
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
    paddingTop: 16,
    marginBottom: 20,
  },
  newSubjectTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  addNewSubjectButton: {
    backgroundColor: '#48bb78',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  addNewSubjectText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  inputGrid: {
    gap: 12,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  gridInput: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  resultSection: {
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
    paddingTop: 16,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  addResultButton: {
    backgroundColor: '#48bb78',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addResultText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  addedResults: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
  },
  addedResultsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  addedResultItem: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addedResultText: {
    fontSize: 12,
    color: '#a0aec0',
    flex: 1,
  },
  removeResultButton: {
    padding: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4a5568',
  },
  saveButton: {
    backgroundColor: '#48bb78',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});