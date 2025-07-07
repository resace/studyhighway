import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Clock, CircleCheck as CheckCircle, Edit3, Trash2, X } from 'lucide-react-native';

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

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSimulado, setEditingSimulado] = useState<Simulado | null>(null);
  const [bulkInput, setBulkInput] = useState('');

  const parseBulkInput = (input: string) => {
    const results: SimuladoResult[] = [];
    
    // Split by semicolon to get each subject result
    const resultParts = input.split(';').filter(part => part.trim());
    
    resultParts.forEach(part => {
      const [subjectPart, dataPart] = part.split(':');
      if (subjectPart && dataPart) {
        const subjectName = subjectPart.trim();
        const [total, correct, time] = dataPart.split(',').map(s => s.trim());
        
        if (subjectName && total && correct && time) {
          results.push({
            subject: subjectName,
            questionsTotal: parseInt(total) || 0,
            questionsCorrect: parseInt(correct) || 0,
            timeSpent: parseInt(time) || 0
          });
        }
      }
    });
    
    return results;
  };

  const addBulkSimulado = () => {
    if (!bulkInput.trim()) {
      Alert.alert('Erro', 'Digite os resultados no formato: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo');
      return;
    }

    try {
      const parsedResults = parseBulkInput(bulkInput);
      
      if (parsedResults.length === 0) {
        Alert.alert('Erro', 'Formato inválido. Use: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo');
        return;
      }

      const totalQuestions = parsedResults.reduce((sum, r) => sum + r.questionsTotal, 0);
      const totalCorrect = parsedResults.reduce((sum, r) => sum + r.questionsCorrect, 0);
      const totalTime = parsedResults.reduce((sum, r) => sum + r.timeSpent, 0);
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const simulado: Simulado = {
        id: Date.now().toString(),
        name: `Simulado ${new Date().toLocaleDateString('pt-BR')}`,
        date: new Date(),
        results: parsedResults,
        totalQuestions,
        totalCorrect,
        totalTime,
        accuracy,
      };

      setSimulados(prev => [simulado, ...prev]);
      setBulkInput('');
      setShowAddModal(false);
      Alert.alert('Sucesso', 'Simulado registrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Formato inválido. Use: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo');
    }
  };

  const editSimulado = (simulado: Simulado) => {
    setEditingSimulado(simulado);
    // Convert simulado back to bulk format
    const bulkFormat = simulado.results.map(r => 
      `${r.subject}:${r.questionsTotal},${r.questionsCorrect},${r.timeSpent}`
    ).join(';');
    setBulkInput(bulkFormat);
    setShowEditModal(true);
  };

  const updateSimulado = () => {
    if (!editingSimulado || !bulkInput.trim()) {
      Alert.alert('Erro', 'Digite os resultados no formato correto');
      return;
    }

    try {
      const parsedResults = parseBulkInput(bulkInput);
      
      if (parsedResults.length === 0) {
        Alert.alert('Erro', 'Formato inválido. Use: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo');
        return;
      }

      const totalQuestions = parsedResults.reduce((sum, r) => sum + r.questionsTotal, 0);
      const totalCorrect = parsedResults.reduce((sum, r) => sum + r.questionsCorrect, 0);
      const totalTime = parsedResults.reduce((sum, r) => sum + r.timeSpent, 0);
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      setSimulados(prev => prev.map(s => 
        s.id === editingSimulado.id 
          ? {
              ...s,
              results: parsedResults,
              totalQuestions,
              totalCorrect,
              totalTime,
              accuracy,
            }
          : s
      ));

      setBulkInput('');
      setEditingSimulado(null);
      setShowEditModal(false);
      Alert.alert('Sucesso', 'Simulado atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Formato inválido. Use: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo');
    }
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

      {/* Add Simulado Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Simulado</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>
                Digite no formato: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo
              </Text>
              <TextInput
                style={styles.bulkInput}
                placeholder="Ex: Direito Constitucional:25,22,45;Matemática:20,15,60"
                placeholderTextColor="#a0aec0"
                value={bulkInput}
                onChangeText={setBulkInput}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addBulkSimulado}
                >
                  <Text style={styles.saveButtonText}>Registrar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Simulado Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Simulado</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.inputLabel}>
                Digite no formato: Matéria:total,corretas,tempo;Matéria2:total,corretas,tempo
              </Text>
              <TextInput
                style={styles.bulkInput}
                placeholder="Ex: Direito Constitucional:25,22,45;Matemática:20,15,60"
                placeholderTextColor="#a0aec0"
                value={bulkInput}
                onChangeText={setBulkInput}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={updateSimulado}
                >
                  <Text style={styles.saveButtonText}>Atualizar</Text>
                </TouchableOpacity>
              </View>
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
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  bulkInput: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
    height: 120,
    textAlignVertical: 'top',
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