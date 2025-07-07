import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, Square, Calendar, Clock, Settings, Plus, X } from 'lucide-react-native';
import { DailyGoalCard } from '@/components/DailyGoalCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CalendarGrid } from '@/components/CalendarGrid';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface PomodoroSettings {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

interface DailyGoal {
  id: string;
  subject: string;
  targetMinutes: number;
  currentMinutes: number;
  status: 'not-started' | 'in-progress' | 'paused' | 'completed';
  isRunning: boolean;
  pomodoroSettings?: PomodoroSettings;
}

interface FreeStudyTimer {
  id: string;
  subject: string;
  currentMinutes: number;
  isRunning: boolean;
}

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

export default function TodayScreen() {
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

  const [freeTimers, setFreeTimers] = useState<FreeStudyTimer[]>([]);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [showPomodoroModal, setShowPomodoroModal] = useState(false);
  const [showFreeTimerModal, setShowFreeTimerModal] = useState(false);
  const [showGlobalSettingsModal, setShowGlobalSettingsModal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [newFreeTimer, setNewFreeTimer] = useState({ subject: '' });

  // Configurações globais de Pomodoro
  const [globalPomodoroSettings, setGlobalPomodoroSettings] = useState<PomodoroSettings>({
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4,
  });

  // Configurações rápidas predefinidas
  const quickSettings = [
    { name: 'Clássico', workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, cyclesBeforeLongBreak: 4 },
    { name: 'Intenso', workMinutes: 45, breakMinutes: 10, longBreakMinutes: 30, cyclesBeforeLongBreak: 3 },
    { name: 'Leve', workMinutes: 15, breakMinutes: 5, longBreakMinutes: 15, cyclesBeforeLongBreak: 4 },
    { name: 'Estudo Longo', workMinutes: 50, breakMinutes: 10, longBreakMinutes: 30, cyclesBeforeLongBreak: 2 },
  ];

  // Carregar metas semanais e converter para metas diárias
  useEffect(() => {
    // Simular carregamento de metas semanais do AsyncStorage ou contexto
    const mockWeeklyGoals: WeeklyGoal[] = [
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
    ];

    setWeeklyGoals(mockWeeklyGoals);

    // Converter metas semanais para metas diárias baseadas no dia atual
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[today.getDay()] as keyof WeeklyGoal['dailyDistribution'];

    const todayGoals: DailyGoal[] = [];
    
    mockWeeklyGoals.forEach((weeklyGoal) => {
      if (!weeklyGoal.isActive) return;

      const todayHours = weeklyGoal.dailyDistribution[currentDay];
      if (todayHours > 0) {
        weeklyGoal.subjects.forEach((subject, index) => {
          // Dividir as horas entre as matérias se houver múltiplas
          const subjectHours = todayHours / weeklyGoal.subjects.length;
          
          todayGoals.push({
            id: `${weeklyGoal.id}-${subject}-${index}`,
            subject: subject,
            targetMinutes: subjectHours * 60,
            currentMinutes: Math.random() * subjectHours * 60, // Simular progresso
            status: Math.random() > 0.7 ? 'completed' : Math.random() > 0.5 ? 'paused' : 'not-started',
            isRunning: false,
            pomodoroSettings: { ...globalPomodoroSettings }
          });
        });
      }
    });

    setDailyGoals(todayGoals);
  }, [globalPomodoroSettings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        // Update daily goals
        setDailyGoals(prev => prev.map(goal => {
          if (goal.id === activeTimer && goal.isRunning && goal.currentMinutes < goal.targetMinutes) {
            const newMinutes = goal.currentMinutes + (1/60);
            const isCompleted = newMinutes >= goal.targetMinutes;
            
            return {
              ...goal,
              currentMinutes: isCompleted ? goal.targetMinutes : newMinutes,
              status: isCompleted ? 'completed' : 'in-progress',
              isRunning: !isCompleted
            };
          }
          return goal;
        }));

        // Update free timers
        setFreeTimers(prev => prev.map(timer => {
          if (timer.id === activeTimer && timer.isRunning) {
            return {
              ...timer,
              currentMinutes: timer.currentMinutes + (1/60)
            };
          }
          return timer;
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const handleGoalControl = (goalId: string, action: 'start' | 'pause' | 'stop') => {
    setDailyGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        switch (action) {
          case 'start':
            setActiveTimer(goalId);
            return { ...goal, status: 'in-progress', isRunning: true };
          case 'pause':
            setActiveTimer(null);
            return { ...goal, status: 'paused', isRunning: false };
          case 'stop':
            setActiveTimer(null);
            return { ...goal, status: 'not-started', isRunning: false, currentMinutes: 0 };
          default:
            return goal;
        }
      } else if (action === 'start') {
        return { ...goal, isRunning: false, status: goal.status === 'in-progress' ? 'paused' : goal.status };
      }
      return goal;
    }));

    // Pause all free timers when starting a goal
    if (action === 'start') {
      setFreeTimers(prev => prev.map(timer => ({ ...timer, isRunning: false })));
    }
  };

  const handleFreeTimerControl = (timerId: string, action: 'start' | 'pause' | 'stop') => {
    setFreeTimers(prev => prev.map(timer => {
      if (timer.id === timerId) {
        switch (action) {
          case 'start':
            setActiveTimer(timerId);
            return { ...timer, isRunning: true };
          case 'pause':
            setActiveTimer(null);
            return { ...timer, isRunning: false };
          case 'stop':
            setActiveTimer(null);
            return { ...timer, isRunning: false, currentMinutes: 0 };
          default:
            return timer;
        }
      } else if (action === 'start') {
        return { ...timer, isRunning: false };
      }
      return timer;
    }));

    // Pause all goals when starting a free timer
    if (action === 'start') {
      setDailyGoals(prev => prev.map(goal => ({ 
        ...goal, 
        isRunning: false, 
        status: goal.status === 'in-progress' ? 'paused' : goal.status 
      })));
    }
  };

  const addFreeTimer = () => {
    if (!newFreeTimer.subject.trim()) return;

    const timer: FreeStudyTimer = {
      id: Date.now().toString(),
      subject: newFreeTimer.subject,
      currentMinutes: 0,
      isRunning: false,
    };

    setFreeTimers(prev => [...prev, timer]);
    setNewFreeTimer({ subject: '' });
    setShowFreeTimerModal(false);
  };

  const updatePomodoroSettings = (goalId: string, settings: PomodoroSettings) => {
    setDailyGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, pomodoroSettings: settings }
        : goal
    ));
  };

  const applyGlobalSettings = () => {
    setDailyGoals(prev => prev.map(goal => ({
      ...goal,
      pomodoroSettings: { ...globalPomodoroSettings }
    })));
    setShowGlobalSettingsModal(false);
  };

  const applyQuickSetting = (setting: PomodoroSettings) => {
    if (editingGoalId) {
      updatePomodoroSettings(editingGoalId, setting);
      setShowPomodoroModal(false);
      setEditingGoalId(null);
    } else {
      setGlobalPomodoroSettings(setting);
    }
  };

  const totalGoals = dailyGoals.length;
  const completedGoals = dailyGoals.filter(g => g.status === 'completed').length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>StudyHighway</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#48bb78" />
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.globalSettingsButton}
            onPress={() => setShowGlobalSettingsModal(true)}
          >
            <Settings size={20} color="#a0aec0" />
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progresso do Dia</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressStats}>
              <Text style={styles.progressText}>{completedGoals}/{totalGoals} Metas Concluídas</Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            <ProgressBar progress={progressPercentage} />
          </View>
        </View>

        {/* Daily Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Metas de Hoje</Text>
          {dailyGoals.length === 0 ? (
            <View style={styles.emptyGoals}>
              <Text style={styles.emptyGoalsText}>Nenhuma meta para hoje</Text>
              <Text style={styles.emptyGoalsSubtext}>Configure suas metas semanais na aba "Metas"</Text>
            </View>
          ) : (
            <View style={styles.goalsGrid}>
              {dailyGoals.map((goal) => (
                <DailyGoalCard
                  key={goal.id}
                  goal={goal}
                  onControl={handleGoalControl}
                  onPomodoroSettings={(goalId) => {
                    setEditingGoalId(goalId);
                    setShowPomodoroModal(true);
                  }}
                  formatTime={formatTime}
                />
              ))}
            </View>
          )}
        </View>

        {/* Free Study Timers */}
        <View style={styles.freeTimersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cronômetros Livres</Text>
            <TouchableOpacity
              style={styles.addTimerButton}
              onPress={() => setShowFreeTimerModal(true)}
            >
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {freeTimers.length > 0 && (
            <View style={styles.freeTimersGrid}>
              {freeTimers.map((timer) => (
                <View key={timer.id} style={styles.freeTimerCard}>
                  <Text style={styles.freeTimerSubject}>{timer.subject}</Text>
                  <Text style={styles.freeTimerTime}>{formatTime(timer.currentMinutes)}</Text>
                  <View style={styles.freeTimerControls}>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.playButton]}
                      onPress={() => handleFreeTimerControl(timer.id, timer.isRunning ? 'pause' : 'start')}
                    >
                      {timer.isRunning ? (
                        <Pause size={16} color="#ffffff" />
                      ) : (
                        <Play size={16} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.controlButton, styles.stopButton]}
                      onPress={() => handleFreeTimerControl(timer.id, 'stop')}
                    >
                      <Square size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Calendar History */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Histórico do Mês</Text>
          <CalendarGrid />
        </View>
      </ScrollView>

      {/* Global Pomodoro Settings Modal */}
      <Modal
        visible={showGlobalSettingsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGlobalSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações Globais Pomodoro</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowGlobalSettingsModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalSubtitle}>
                Estas configurações serão aplicadas a todas as metas
              </Text>
              
              {/* Quick Settings */}
              <View style={styles.quickSettingsSection}>
                <Text style={styles.quickSettingsTitle}>Configurações Rápidas</Text>
                <View style={styles.quickSettingsGrid}>
                  {quickSettings.map((setting, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickSettingButton}
                      onPress={() => applyQuickSetting(setting)}
                    >
                      <Text style={styles.quickSettingName}>{setting.name}</Text>
                      <Text style={styles.quickSettingDetails}>
                        {setting.workMinutes}min / {setting.breakMinutes}min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <PomodoroSettingsForm
                settings={globalPomodoroSettings}
                onSave={(settings) => {
                  setGlobalPomodoroSettings(settings);
                  setShowGlobalSettingsModal(false);
                }}
                onCancel={() => setShowGlobalSettingsModal(false)}
                showApplyToAll={true}
                onApplyToAll={applyGlobalSettings}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Pomodoro Settings Modal */}
      <Modal
        visible={showPomodoroModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPomodoroModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurações Pomodoro</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPomodoroModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Quick Settings */}
              <View style={styles.quickSettingsSection}>
                <Text style={styles.quickSettingsTitle}>Configurações Rápidas</Text>
                <View style={styles.quickSettingsGrid}>
                  {quickSettings.map((setting, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickSettingButton}
                      onPress={() => applyQuickSetting(setting)}
                    >
                      <Text style={styles.quickSettingName}>{setting.name}</Text>
                      <Text style={styles.quickSettingDetails}>
                        {setting.workMinutes}min / {setting.breakMinutes}min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {editingGoalId && (
                <PomodoroSettingsForm
                  settings={dailyGoals.find(g => g.id === editingGoalId)?.pomodoroSettings}
                  onSave={(settings) => {
                    updatePomodoroSettings(editingGoalId, settings);
                    setShowPomodoroModal(false);
                    setEditingGoalId(null);
                  }}
                  onCancel={() => {
                    setShowPomodoroModal(false);
                    setEditingGoalId(null);
                  }}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Free Timer Modal */}
      <Modal
        visible={showFreeTimerModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFreeTimerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Cronômetro Livre</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFreeTimerModal(false)}
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
                placeholder="Nome"
                placeholderTextColor="#a0aec0"
                value={newFreeTimer.subject}
                onChangeText={(text) => setNewFreeTimer({ subject: text })}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowFreeTimerModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addFreeTimer}
                >
                  <Text style={styles.saveButtonText}>Criar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function PomodoroSettingsForm({ settings, onSave, onCancel, showApplyToAll, onApplyToAll }: any) {
  const [formData, setFormData] = useState(settings || {
    workMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
    cyclesBeforeLongBreak: 4
  });

  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tempo de Trabalho (min)</Text>
        <TextInput
          style={styles.modalInput}
          value={formData.workMinutes.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, workMinutes: parseInt(text) || 25 }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pausa Curta (min)</Text>
        <TextInput
          style={styles.modalInput}
          value={formData.breakMinutes.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, breakMinutes: parseInt(text) || 5 }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pausa Longa (min)</Text>
        <TextInput
          style={styles.modalInput}
          value={formData.longBreakMinutes.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, longBreakMinutes: parseInt(text) || 15 }))}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ciclos antes da pausa longa</Text>
        <TextInput
          style={styles.modalInput}
          value={formData.cyclesBeforeLongBreak.toString()}
          onChangeText={(text) => setFormData(prev => ({ ...prev, cyclesBeforeLongBreak: parseInt(text) || 4 }))}
          keyboardType="numeric"
        />
      </View>

      {showApplyToAll && (
        <TouchableOpacity
          style={styles.applyToAllButton}
          onPress={onApplyToAll}
        >
          <Text style={styles.applyToAllText}>Aplicar a Todas as Metas</Text>
        </TouchableOpacity>
      )}

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={() => onSave(formData)}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a202c',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    color: '#48bb78',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  globalSettingsButton: {
    backgroundColor: '#2d3748',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
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
  progressStats: {
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
    color: '#48bb78',
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalsSection: {
    padding: 20,
    paddingTop: 10,
  },
  goalsGrid: {
    gap: 12,
  },
  emptyGoals: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  emptyGoalsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 8,
  },
  emptyGoalsSubtext: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  freeTimersSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addTimerButton: {
    backgroundColor: '#48bb78',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeTimersGrid: {
    gap: 12,
  },
  freeTimerCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  freeTimerSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  freeTimerTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48bb78',
    textAlign: 'center',
    marginBottom: 16,
  },
  freeTimerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#48bb78',
  },
  stopButton: {
    backgroundColor: '#e53e3e',
  },
  calendarSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 100,
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
  modalSubtitle: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  quickSettingsSection: {
    marginBottom: 20,
  },
  quickSettingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  quickSettingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickSettingButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  quickSettingName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickSettingDetails: {
    color: '#a0aec0',
    fontSize: 12,
  },
  modalInput: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  applyToAllButton: {
    backgroundColor: '#3182ce',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  applyToAllText: {
    color: '#ffffff',
    fontWeight: '600',
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