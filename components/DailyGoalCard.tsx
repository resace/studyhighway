import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Square, Clock, Settings } from 'lucide-react-native';

interface DailyGoal {
  id: string;
  subject: string;
  targetMinutes: number;
  currentMinutes: number;
  status: 'not-started' | 'in-progress' | 'paused' | 'completed';
  isRunning: boolean;
  pomodoroSettings?: {
    workMinutes: number;
    breakMinutes: number;
    longBreakMinutes: number;
    cyclesBeforeLongBreak: number;
  };
}

interface DailyGoalCardProps {
  goal: DailyGoal;
  onControl: (goalId: string, action: 'start' | 'pause' | 'stop') => void;
  onPomodoroSettings?: (goalId: string) => void;
  formatTime: (minutes: number) => string;
}

export function DailyGoalCard({ goal, onControl, onPomodoroSettings, formatTime }: DailyGoalCardProps) {
  const getCardStyle = () => {
    switch (goal.status) {
      case 'completed':
        return [styles.card, styles.cardCompleted];
      case 'in-progress':
        return [styles.card, styles.cardInProgress];
      case 'paused':
        return [styles.card, styles.cardPaused];
      default:
        return [styles.card, styles.cardDefault];
    }
  };

  const getProgressPercentage = () => {
    return Math.min((goal.currentMinutes / goal.targetMinutes) * 100, 100);
  };

  const getRemainingTime = () => {
    const remaining = Math.max(goal.targetMinutes - goal.currentMinutes, 0);
    return formatTime(remaining);
  };

  return (
    <View style={getCardStyle()}>
      <View style={styles.cardHeader}>
        <Text style={styles.subjectName}>{goal.subject}</Text>
        <View style={styles.headerActions}>
          <View style={styles.timeContainer}>
            <Clock size={14} color="#a0aec0" />
            <Text style={styles.timeText}>
              {goal.status === 'completed' ? 'Concluída!' : getRemainingTime()}
            </Text>
          </View>
          {onPomodoroSettings && (
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => onPomodoroSettings(goal.id)}
            >
              <Settings size={16} color="#a0aec0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {goal.pomodoroSettings && (
        <View style={styles.pomodoroInfo}>
          <Text style={styles.pomodoroText}>
            Pomodoro: {goal.pomodoroSettings.workMinutes}min trabalho / {goal.pomodoroSettings.breakMinutes}min pausa
          </Text>
        </View>
      )}

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage()}%` },
              goal.status === 'completed' && styles.progressCompleted
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {formatTime(goal.currentMinutes)} / {formatTime(goal.targetMinutes)}
        </Text>
      </View>

      <View style={styles.controls}>
        {goal.status !== 'completed' && (
          <>
            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={() => onControl(goal.id, goal.isRunning ? 'pause' : 'start')}
            >
              {goal.isRunning ? (
                <Pause size={16} color="#ffffff" />
              ) : (
                <Play size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={() => onControl(goal.id, 'stop')}
            >
              <Square size={16} color="#ffffff" />
            </TouchableOpacity>
          </>
        )}
        {goal.status === 'completed' && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Concluída</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  cardDefault: {
    backgroundColor: '#2d3748',
    borderColor: '#4a5568',
  },
  cardInProgress: {
    backgroundColor: '#2a4365',
    borderColor: '#3182ce',
  },
  cardPaused: {
    backgroundColor: '#744210',
    borderColor: '#d69e2e',
  },
  cardCompleted: {
    backgroundColor: '#22543d',
    borderColor: '#48bb78',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#a0aec0',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 4,
  },
  pomodoroInfo: {
    backgroundColor: '#1a202c',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  pomodoroText: {
    color: '#a0aec0',
    fontSize: 12,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3182ce',
    borderRadius: 4,
  },
  progressCompleted: {
    backgroundColor: '#48bb78',
  },
  progressText: {
    color: '#a0aec0',
    fontSize: 12,
    textAlign: 'center',
  },
  controls: {
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
  completedBadge: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completedText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});