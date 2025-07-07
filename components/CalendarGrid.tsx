import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface DayGoal {
  subject: string;
  targetMinutes: number;
  completedMinutes: number;
  status: 'completed' | 'partial' | 'missed';
}

interface DayData {
  date: number;
  goals: DayGoal[];
  overallStatus: 'completed' | 'partial' | 'missed' | 'future';
}

export function CalendarGrid() {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
  const todayDate = isCurrentMonth ? today.getDate() : -1;
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  // Mock data for days with goals
  const getDayData = (day: number): DayData => {
    const dayDate = new Date(currentYear, currentMonth, day);
    const isInFuture = dayDate > today;
    
    if (isInFuture) {
      return {
        date: day,
        goals: [],
        overallStatus: 'future'
      };
    }

    const mockGoals: DayGoal[] = [
      { subject: 'Direito Constitucional', targetMinutes: 60, completedMinutes: day <= 10 ? 60 : day <= 15 ? 45 : 30, status: day <= 10 ? 'completed' : day <= 15 ? 'partial' : 'missed' },
      { subject: 'Matemática', targetMinutes: 45, completedMinutes: day <= 8 ? 45 : day <= 12 ? 30 : 15, status: day <= 8 ? 'completed' : day <= 12 ? 'partial' : 'missed' },
      { subject: 'Português', targetMinutes: 30, completedMinutes: day <= 12 ? 30 : day <= 18 ? 20 : 10, status: day <= 12 ? 'completed' : day <= 18 ? 'partial' : 'missed' },
    ];

    const completedGoals = mockGoals.filter(g => g.status === 'completed').length;
    const totalGoals = mockGoals.length;
    
    let overallStatus: 'completed' | 'partial' | 'missed';
    if (completedGoals === totalGoals) {
      overallStatus = 'completed';
    } else if (completedGoals > 0) {
      overallStatus = 'partial';
    } else {
      overallStatus = 'missed';
    }

    return {
      date: day,
      goals: mockGoals,
      overallStatus
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getDayStyle = (day: number) => {
    const dayData = getDayData(day);
    
    if (day === todayDate && isCurrentMonth) {
      return [styles.day, styles.today];
    } else if (dayData.overallStatus === 'completed') {
      return [styles.day, styles.completedDay];
    } else if (dayData.overallStatus === 'partial') {
      return [styles.day, styles.partialDay];
    } else if (dayData.overallStatus === 'missed') {
      return [styles.day, styles.missedDay];
    }
    return [styles.day, styles.futureDay];
  };

  const getDayTextStyle = (day: number) => {
    if (day === todayDate && isCurrentMonth) {
      return styles.todayText;
    } else if (getDayData(day).overallStatus === 'completed' || getDayData(day).overallStatus === 'partial') {
      return styles.completedText;
    } else if (getDayData(day).overallStatus === 'missed') {
      return styles.missedText;
    }
    return styles.futureText;
  };

  const handleDayPress = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day);
    if (dayDate <= today) {
      const dayData = getDayData(day);
      setSelectedDay(dayData);
      setShowModal(true);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#48bb78';
      case 'partial': return '#d69e2e';
      case 'missed': return '#e53e3e';
      default: return '#a0aec0';
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.monthHeader}>
          <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('prev')}>
            <ChevronLeft size={20} color="#a0aec0" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.monthTitleContainer} onPress={navigateToToday}>
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
            {!isCurrentMonth && (
              <Text style={styles.todayHint}>Toque para ir para hoje</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth('next')}>
            <ChevronRight size={20} color="#a0aec0" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dayNames}>
          {dayNames.map((name) => (
            <Text key={name} style={styles.dayName}>
              {name}
            </Text>
          ))}
        </View>
        
        <View style={styles.calendar}>
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <View key={`empty-${i}`} style={styles.emptyDay} />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayDate = new Date(currentYear, currentMonth, day);
            const isClickable = dayDate <= today;
            
            return (
              <TouchableOpacity 
                key={day} 
                style={getDayStyle(day)}
                onPress={() => handleDayPress(day)}
                disabled={!isClickable}
              >
                <Text style={getDayTextStyle(day)}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.completedDay]} />
            <Text style={styles.legendText}>Completo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.partialDay]} />
            <Text style={styles.legendText}>Parcial</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.missedDay]} />
            <Text style={styles.legendText}>Perdido</Text>
          </View>
        </View>
      </View>

      {/* Day Details Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDay && `${selectedDay.date} de ${monthNames[currentMonth]} ${currentYear}`}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <X size={24} color="#a0aec0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedDay && (
                <>
                  <View style={styles.dayOverview}>
                    <Text style={styles.overviewTitle}>Resumo do Dia</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedDay.overallStatus) }]}>
                      <Text style={styles.statusText}>
                        {selectedDay.overallStatus === 'completed' ? 'Todas as metas concluídas' :
                         selectedDay.overallStatus === 'partial' ? 'Metas parcialmente concluídas' :
                         'Metas não concluídas'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalsSection}>
                    <Text style={styles.goalsTitle}>Metas do Dia</Text>
                    {selectedDay.goals.map((goal, index) => (
                      <View key={index} style={styles.goalItem}>
                        <View style={styles.goalHeader}>
                          <Text style={styles.goalSubject}>{goal.subject}</Text>
                          <View style={[styles.goalStatusDot, { backgroundColor: getStatusColor(goal.status) }]} />
                        </View>
                        <View style={styles.goalProgress}>
                          <Text style={styles.goalTime}>
                            {formatTime(goal.completedMinutes)} / {formatTime(goal.targetMinutes)}
                          </Text>
                          <Text style={[styles.goalStatus, { color: getStatusColor(goal.status) }]}>
                            {goal.status === 'completed' ? 'Concluída' :
                             goal.status === 'partial' ? 'Parcial' : 'Não concluída'}
                          </Text>
                        </View>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressFill,
                              { 
                                width: `${Math.min((goal.completedMinutes / goal.targetMinutes) * 100, 100)}%`,
                                backgroundColor: getStatusColor(goal.status)
                              }
                            ]} 
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1a202c',
  },
  monthTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  todayHint: {
    fontSize: 12,
    color: '#48bb78',
    marginTop: 2,
  },
  dayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    borderRadius: 6,
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  today: {
    backgroundColor: '#3182ce',
    borderWidth: 2,
    borderColor: '#63b3ed',
  },
  completedDay: {
    backgroundColor: '#48bb78',
  },
  partialDay: {
    backgroundColor: '#d69e2e',
  },
  missedDay: {
    backgroundColor: '#e53e3e',
  },
  futureDay: {
    backgroundColor: '#4a5568',
  },
  todayText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  missedText: {
    color: '#ffffff',
    fontSize: 14,
  },
  futureText: {
    color: '#a0aec0',
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#a0aec0',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5568',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  dayOverview: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  goalsSection: {
    gap: 16,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  goalItem: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalSubject: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  goalStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  goalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTime: {
    fontSize: 12,
    color: '#a0aec0',
  },
  goalStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#4a5568',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});