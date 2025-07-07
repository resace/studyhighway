import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Target, Calendar, Clock, CreditCard as Edit3, Trash2, CircleCheck as CheckCircle, ChevronDown, Check } from 'lucide-react-native';

interface WeeklyGoal {
  id: string;
  subjects: string[];
  weeklyHours: number;
  dailyDistribution: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  completedHours: number;
  isActive: boolean;
}

interface Subject {
  id: string;
  name: string;
  importance: 'high' | 'medium' | 'low';
}

export default function MetasScreen() {
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([
    {
      id: '1',
      subjects: ['Direito Constitucional'],
      weeklyHours: 8,
      dailyDistribution: {
        monday: 1.5,
        tuesday: 1.5,
        wednesday: 1,
        thursday: 1,
        friday: 1.5,
        saturday: 1,
        sunday: 0.5,
      },
      completedHours: 6.5,
      isActive: true,
    },
    {
      id: '2',
      subjects: ['Matemática', 'Português'],
      weeklyHours: 10,
      dailyDistribution: {
        monday: 1.5,
        tuesday: 1.5,
        wednesday: 1.5,
        thursday: 1.5,
        friday: 1.5,
        saturday: 1.5,
        sunday: 1,
      },
      completedHours: 7,
      isActive: true,
    },
  ]);

  // Matérias existentes (simulando dados do app)
  const [existingSubjects] = useState<Subject[]>([
    { id: '1', name: 'Direito Constitucional', importance: 'high' },
    { id: '2', name: 'Matemática', importance: 'high' },
    { id: '3', name: 'Português', importance: 'medium' },
    { id: '4', name: 'Direito Administrativo', importance: 'high' },
    { id: '5', name: 'Informática', importance: 'low' },
    { id: '6', name: 'Raciocínio Lógico', importance: 'medium' },
    { id: '7', name: 'Direito Penal', importance: 'high' },
    { id: '8', name: 'Direito Civil', importance: 'medium' },
    { id: '9', name: 'Estatística', importance: 'low' },
    { id: '10', name: 'Atualidades', importance: 'low' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState({
    subjects: [] as string[],
    weeklyHours: 0,
    distributionType: 'uniform' as 'uniform' | 'custom',
    dailyDistribution: {
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    },
  });

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const calculateUniformDistribution = (totalHours: number) => {
    const hoursPerDay = totalHours / 7;
    return {
      monday: hoursPerDay,
      tuesday: hoursPerDay,
      wednesday: hoursPerDay,
      thursday: hoursPerDay,
      friday: hoursPerDay,
      saturday: hoursPerDay,
      sunday: hoursPerDay,
    };
  };

  const updateDailyDistribution = (day: string, hours: number) => {
    setNewGoal(prev => ({
      ...prev,
      dailyDistribution: {
        ...prev.dailyDistribution,
        [day]: hours,
      },
    }));
  };

  const toggleSubjectSelection = (subjectName: string) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectName)) {
        return prev.filter(s => s !== subjectName);
      } else {
        return [...prev, subjectName];
      }
    });
  };

  const selectSubjectsByPriority = (priority: 'high' | 'medium' | 'low') => {
    const subjects = existingSubjects
      .filter(s => s.importance === priority)
      .map(s => s.name);
    
    if (subjects.length === 0) {
      Alert.alert('Aviso', `Nenhuma matéria com prioridade ${priority === 'high' ? 'alta' : priority === 'medium' ? 'média' : 'baixa'} encontrada`);
      return;
    }
    
    // Adiciona todas as matérias da prioridade selecionada
    setSelectedSubjects(prev => {
      const newSubjects = [...prev];
      subjects.forEach(subject => {
        if (!newSubjects.includes(subject)) {
          newSubjects.push(subject);
        }
      });
      return newSubjects;
    });
    
    Alert.alert('Sucesso', `${subjects.length} matéria(s) de prioridade ${priority === 'high' ? 'alta' : priority === 'medium' ? 'média' : 'baixa'} adicionada(s)`);
  };

  const confirmSubjectSelection = () => {
    if (selectedSubjects.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma matéria');
      return;
    }
    
    setNewGoal(prev => ({ ...prev, subjects: selectedSubjects }));
    setShowSubjectModal(false);
  };

  const addWeeklyGoal = () => {
    if (newGoal.subjects.length === 0 || newGoal.weeklyHours <= 0) {
      Alert.alert('Erro', 'Selecione as matérias e defina as horas semanais');
      return;
    }

    let distribution = newGoal.dailyDistribution;
    if (newGoal.distributionType === 'uniform') {
      distribution = calculateUniformDistribution(newGoal.weeklyHours);
    }

    const goal: WeeklyGoal = {
      id: Date.now().toString(),
      subjects: newGoal.subjects,
      weeklyHours: newGoal.weeklyHours,
      dailyDistribution: distribution,
      completedHours: 0,
      isActive: true,
    };

    setWeeklyGoals(prev => [...prev, goal]);
    resetNewGoal();
    setShowAddModal(false);
    Alert.alert('Sucesso', 'Meta semanal criada com sucesso!');
  };

  const resetNewGoal = () => {
    setNewGoal({
      subjects: [],
      weeklyHours: 0,
      distributionType: 'uniform',
      dailyDistribution: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0,
      },
    });
    setSelectedSubjects([]);
  };

  const editGoal = (goal: WeeklyGoal) => {
    setEditingGoal(goal);
    setNewGoal({
      subjects: goal.subjects,
      weeklyHours: goal.weeklyHours,
      distributionType: 'custom',
      dailyDistribution: goal.dailyDistribution,
    });
    setSelectedSubjects(goal.subjects);
    setShowEditModal(true);
  };

  const updateGoal = () => {
    if (!editingGoal) return;

    let distribution = newGoal.dailyDistribution;
    if (newGoal.distributionType === 'uniform') {
      distribution = calculateUniformDistribution(newGoal.weeklyHours);
    }

    setWeeklyGoals(prev => prev.map(goal => 
      goal.id === editingGoal.id 
        ? { 
            ...goal, 
            subjects: newGoal.subjects,
            weeklyHours: newGoal.weeklyHours,
            dailyDistribution: distribution
          }
        : goal
    ));

    setEditingGoal(null);
    setShowEditModal(false);
    resetNewGoal();
    Alert.alert('Sucesso', 'Meta atualizada com sucesso!');
  };

  const deleteGoal = (goalId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setWeeklyGoals(prev => prev.filter(g => g.id !== goalId));
            Alert.alert('Sucesso', 'Meta excluída com sucesso!');
          },
        },
      ]
    );
  };

  const toggleGoalStatus = (goalId: string) => {
    setWeeklyGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, isActive: !goal.isActive }
        : goal
    ));
  };

  const getProgressPercentage = (goal: WeeklyGoal) => {
    return Math.min((goal.completedHours / goal.weeklyHours) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#48bb78';
    if (percentage >= 70) return '#d69e2e';
    return '#e53e3e';
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? (m > 0 ? `${h}h ${m}min` : `${h}h`) : `${m}min`;
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return '#e53e3e';
      case 'medium': return '#d69e2e';
      case 'low': return '#48bb78';
      default: return '#a0aec0';
    }
  };

  const totalWeeklyHours = weeklyGoals.reduce((sum, goal) => sum + goal.weeklyHours, 0);
  const totalCompletedHours = weeklyGoals.reduce((sum, goal) => sum + goal.completedHours, 0);
  const overallProgress = totalWeeklyHours > 0 ? (totalCompletedHours / totalWeeklyHours) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Metas Semanais</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Progress */}
        <View style={styles.overallSection}>
          <Text style={styles.sectionTitle}>Progresso Geral da Semana</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {formatTime(totalCompletedHours)} / {formatTime(totalWeeklyHours)}
              </Text>
              <Text style={[styles.progressPercentage, { color: getProgressColor(overallProgress) }]}>
                {Math.round(overallProgress)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${overallProgress}%`,
                    backgroundColor: getProgressColor(overallProgress)
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Weekly Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Metas por Matéria</Text>
          
          {weeklyGoals.length === 0 ? (
            <View style={styles.emptyState}>
              <Target size={48} color="#4a5568" />
              <Text style={styles.emptyText}>Nenhuma meta definida</Text>
              <Text style={styles.emptySubtext}>Crie sua primeira meta semanal para começar o controle</Text>
            </View>
          ) : (
            weeklyGoals.map((goal) => {
              const progress = getProgressPercentage(goal);
              const progressColor = getProgressColor(progress);
              const isCompleted = progress >= 100;

              return (
                <View key={goal.id} style={[
                  styles.goalCard,
                  !goal.isActive && styles.inactiveGoalCard
                ]}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <Text style={[
                        styles.goalSubject,
                        !goal.isActive && styles.inactiveText
                      ]}>
                        {goal.subjects.join(', ')}
                      </Text>
                      <View style={styles.goalMeta}>
                        <Clock size={14} color="#a0aec0" />
                        <Text style={styles.goalHours}>
                          {formatTime(goal.weeklyHours)} por semana
                        </Text>
                        {isCompleted && (
                          <View style={styles.completedBadge}>
                            <CheckCircle size={12} color="#48bb78" />
                            <Text style={styles.completedText}>Concluída</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.goalActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => editGoal(goal)}
                      >
                        <Edit3 size={16} color="#a0aec0" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteGoal(goal.id)}
                      >
                        <Trash2 size={16} color="#e53e3e" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.goalProgress}>
                    <View style={styles.goalProgressHeader}>
                      <Text style={styles.goalProgressText}>
                        {formatTime(goal.completedHours)} / {formatTime(goal.weeklyHours)}
                      </Text>
                      <Text style={[styles.goalProgressPercentage, { color: progressColor }]}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <View style={styles.goalProgressBar}>
                      <View 
                        style={[
                          styles.goalProgressFill,
                          { 
                            width: `${progress}%`,
                            backgroundColor: progressColor
                          }
                        ]} 
                      />
                    </View>
                  </View>

                  {/* Daily Distribution */}
                  <View style={styles.dailyDistribution}>
                    <Text style={styles.distributionTitle}>Distribuição Diária</Text>
                    <View style={styles.daysGrid}>
                      {days.map((day) => {
                        const dayHours = goal.dailyDistribution[day.key as keyof typeof goal.dailyDistribution];
                        return (
                          <View key={day.key} style={styles.dayItem}>
                            <Text style={styles.dayLabel}>{day.label.slice(0, 3)}</Text>
                            <Text style={styles.dayHours}>{formatTime(dayHours)}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      goal.isActive ? styles.activeButton : styles.inactiveButton
                    ]}
                    onPress={() => toggleGoalStatus(goal.id)}
                  >
                    <Text style={styles.statusButtonText}>
                      {goal.isActive ? 'Pausar Meta' : 'Ativar Meta'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <Modal
        visible={showAddModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetNewGoal();
        }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {showEditModal ? 'Editar Meta Semanal' : 'Nova Meta Semanal'}
              </Text>
              
              {/* Seleção Rápida por Prioridade */}
              <View style={styles.prioritySection}>
                <Text style={styles.prioritySectionTitle}>Seleção Rápida por Prioridade</Text>
                <View style={styles.priorityButtons}>
                  <TouchableOpacity
                    style={[styles.priorityButton, styles.highPriority]}
                    onPress={() => selectSubjectsByPriority('high')}
                  >
                    <Text style={styles.priorityButtonText}>Alta Prioridade</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.priorityButton, styles.mediumPriority]}
                    onPress={() => selectSubjectsByPriority('medium')}
                  >
                    <Text style={styles.priorityButtonText}>Média Prioridade</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.priorityButton, styles.lowPriority]}
                    onPress={() => selectSubjectsByPriority('low')}
                  >
                    <Text style={styles.priorityButtonText}>Baixa Prioridade</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.subjectSelector}
                onPress={() => setShowSubjectModal(true)}
              >
                <Text style={[styles.subjectSelectorText, newGoal.subjects.length === 0 && styles.placeholder]}>
                  {newGoal.subjects.length > 0 
                    ? `${newGoal.subjects.length} matéria(s) selecionada(s)` 
                    : 'Selecionar matérias'}
                </Text>
                <ChevronDown size={20} color="#a0aec0" />
              </TouchableOpacity>

              {newGoal.subjects.length > 0 && (
                <View style={styles.selectedSubjects}>
                  <Text style={styles.selectedSubjectsTitle}>Matérias Selecionadas:</Text>
                  <View style={styles.subjectTags}>
                    {newGoal.subjects.map((subject, index) => (
                      <View key={index} style={styles.subjectTag}>
                        <Text style={styles.subjectTagText}>{subject}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              <TextInput
                style={styles.modalInput}
                placeholder="Horas por semana"
                placeholderTextColor="#a0aec0"
                keyboardType="numeric"
                value={newGoal.weeklyHours > 0 ? newGoal.weeklyHours.toString() : ''}
                onChangeText={(text) => setNewGoal(prev => ({ 
                  ...prev, 
                  weeklyHours: parseFloat(text) || 0 
                }))}
              />

              <View style={styles.distributionSection}>
                <Text style={styles.distributionSectionTitle}>Distribuição das Horas</Text>
                
                <View style={styles.distributionOptions}>
                  <TouchableOpacity
                    style={[
                      styles.distributionOption,
                      newGoal.distributionType === 'uniform' && styles.distributionOptionActive
                    ]}
                    onPress={() => setNewGoal(prev => ({ ...prev, distributionType: 'uniform' }))}
                  >
                    <Text style={styles.distributionOptionText}>Uniforme</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.distributionOption,
                      newGoal.distributionType === 'custom' && styles.distributionOptionActive
                    ]}
                    onPress={() => setNewGoal(prev => ({ ...prev, distributionType: 'custom' }))}
                  >
                    <Text style={styles.distributionOptionText}>Personalizada</Text>
                  </TouchableOpacity>
                </View>

                {newGoal.distributionType === 'uniform' && newGoal.weeklyHours > 0 && (
                  <Text style={styles.uniformText}>
                    {formatTime(newGoal.weeklyHours / 7)} por dia
                  </Text>
                )}

                {newGoal.distributionType === 'custom' && (
                  <View style={styles.customDistribution}>
                    {days.map((day) => (
                      <View key={day.key} style={styles.dayInput}>
                        <Text style={styles.dayInputLabel}>{day.label}:</Text>
                        <TextInput
                          style={styles.dayInputField}
                          placeholder="0"
                          placeholderTextColor="#a0aec0"
                          keyboardType="numeric"
                          value={newGoal.dailyDistribution[day.key as keyof typeof newGoal.dailyDistribution] > 0 
                            ? newGoal.dailyDistribution[day.key as keyof typeof newGoal.dailyDistribution].toString() 
                            : ''}
                          onChangeText={(text) => updateDailyDistribution(day.key, parseFloat(text) || 0)}
                        />
                        <Text style={styles.dayInputUnit}>h</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingGoal(null);
                    resetNewGoal();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={showEditModal ? updateGoal : addWeeklyGoal}
                >
                  <Text style={styles.saveButtonText}>
                    {showEditModal ? 'Atualizar Meta' : 'Criar Meta'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
          <View style={styles.subjectModalContent}>
            <Text style={styles.modalTitle}>Selecionar Matérias</Text>
            <Text style={styles.modalSubtitle}>
              Selecione uma ou múltiplas matérias para sua meta
            </Text>
            
            <ScrollView style={styles.subjectList}>
              {existingSubjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.name);
                return (
                  <TouchableOpacity
                    key={subject.id}
                    style={[styles.subjectItem, isSelected && styles.subjectItemSelected]}
                    onPress={() => toggleSubjectSelection(subject.name)}
                  >
                    <View style={styles.subjectItemContent}>
                      <Text style={[styles.subjectItemText, isSelected && styles.subjectItemTextSelected]}>
                        {subject.name}
                      </Text>
                      <View style={[
                        styles.priorityIndicator,
                        { backgroundColor: getImportanceColor(subject.importance) }
                      ]} />
                    </View>
                    {isSelected && (
                      <Check size={20} color="#48bb78" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.selectionSummary}>
              <Text style={styles.selectionText}>
                {selectedSubjects.length} matéria(s) selecionada(s)
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowSubjectModal(false);
                  setSelectedSubjects(newGoal.subjects); // Restaura seleção anterior
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={confirmSubjectSelection}
              >
                <Text style={styles.saveButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
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
  overallSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#4a5568',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  goalsSection: {
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  inactiveGoalCard: {
    opacity: 0.6,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  inactiveText: {
    color: '#a0aec0',
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalHours: {
    color: '#a0aec0',
    fontSize: 14,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22543d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  completedText: {
    color: '#48bb78',
    fontSize: 12,
    fontWeight: 'bold',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1a202c',
  },
  goalProgress: {
    marginBottom: 16,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgressText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  goalProgressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dailyDistribution: {
    marginBottom: 16,
  },
  distributionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayItem: {
    flex: 1,
    minWidth: '13%',
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  dayLabel: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayHours: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#e53e3e',
  },
  inactiveButton: {
    backgroundColor: '#48bb78',
  },
  statusButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  subjectModalContent: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 20,
  },
  prioritySection: {
    marginBottom: 20,
  },
  prioritySectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  highPriority: {
    backgroundColor: '#e53e3e',
  },
  mediumPriority: {
    backgroundColor: '#d69e2e',
  },
  lowPriority: {
    backgroundColor: '#48bb78',
  },
  priorityButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  subjectSelector: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectSelectorText: {
    color: '#ffffff',
    fontSize: 16,
  },
  placeholder: {
    color: '#a0aec0',
  },
  selectedSubjects: {
    marginBottom: 16,
  },
  selectedSubjectsTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subjectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectTag: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subjectTagText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  subjectList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  subjectItem: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  subjectItemSelected: {
    borderColor: '#48bb78',
    backgroundColor: '#22543d',
  },
  subjectItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectItemText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  subjectItemTextSelected: {
    color: '#48bb78',
    fontWeight: 'bold',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  selectionSummary: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectionText: {
    color: '#48bb78',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalInput: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  distributionSection: {
    marginBottom: 20,
  },
  distributionSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  distributionOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  distributionOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#1a202c',
    borderWidth: 1,
    borderColor: '#4a5568',
    alignItems: 'center',
  },
  distributionOptionActive: {
    backgroundColor: '#48bb78',
    borderColor: '#48bb78',
  },
  distributionOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  uniformText: {
    color: '#48bb78',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  customDistribution: {
    gap: 12,
  },
  dayInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayInputLabel: {
    color: '#ffffff',
    fontSize: 14,
    width: 80,
  },
  dayInputField: {
    flex: 1,
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  dayInputUnit: {
    color: '#a0aec0',
    fontSize: 14,
    width: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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