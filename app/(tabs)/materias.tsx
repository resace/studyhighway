import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Play, Pause, Square, Clock, BookOpen, Target, Trash2, CreditCard as Edit3, Minimize2, Maximize2 } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

interface StudyRecord {
  id: string;
  date: Date;
  timeSpent: number; // minutes
  questionsAnswered: number;
  questionsCorrect: number;
  notes?: string;
}

interface Topic {
  id: string;
  name: string;
  totalTime: number; // minutes
  questionsAnswered: number;
  questionsCorrect: number;
  accuracy: number;
  status: 'not-started' | 'in-progress' | 'completed';
  isRunning: boolean;
  records: StudyRecord[];
}

interface Subject {
  id: string;
  name: string;
  importance: 'high' | 'medium' | 'low';
  topics: Topic[];
  totalTime: number;
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
}

type ImportanceFilter = 'all' | 'high' | 'medium' | 'low';

export default function MateriasScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Direito Constitucional',
      importance: 'high',
      totalTime: 480,
      totalQuestions: 150,
      totalCorrect: 128,
      overallAccuracy: 85.3,
      topics: [
        {
          id: '1-1',
          name: 'Princípios Fundamentais',
          totalTime: 120,
          questionsAnswered: 42,
          questionsCorrect: 35,
          accuracy: 83.3,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '1', date: new Date('2024-01-15'), timeSpent: 45, questionsAnswered: 15, questionsCorrect: 12, notes: 'Revisão dos artigos 1-4' },
            { id: '2', date: new Date('2024-01-14'), timeSpent: 30, questionsAnswered: 12, questionsCorrect: 10, notes: 'Exercícios práticos' },
            { id: '3', date: new Date('2024-01-13'), timeSpent: 45, questionsAnswered: 15, questionsCorrect: 13, notes: 'Teoria geral' },
          ]
        },
        {
          id: '1-2',
          name: 'Direitos Fundamentais',
          totalTime: 180,
          questionsAnswered: 68,
          questionsCorrect: 62,
          accuracy: 91.2,
          status: 'completed',
          isRunning: false,
          records: [
            { id: '4', date: new Date('2024-01-12'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 18, notes: 'Direitos individuais' },
            { id: '5', date: new Date('2024-01-11'), timeSpent: 50, questionsAnswered: 18, questionsCorrect: 16, notes: 'Direitos coletivos' },
            { id: '6', date: new Date('2024-01-10'), timeSpent: 70, questionsAnswered: 30, questionsCorrect: 28, notes: 'Revisão geral' },
          ]
        },
        {
          id: '1-3',
          name: 'Organização do Estado',
          totalTime: 180,
          questionsAnswered: 40,
          questionsCorrect: 31,
          accuracy: 77.5,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '7', date: new Date('2024-01-09'), timeSpent: 90, questionsAnswered: 25, questionsCorrect: 19, notes: 'Poderes da República' },
            { id: '8', date: new Date('2024-01-08'), timeSpent: 90, questionsAnswered: 15, questionsCorrect: 12, notes: 'Federalismo' },
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Matemática',
      importance: 'high',
      totalTime: 360,
      totalQuestions: 120,
      totalCorrect: 90,
      overallAccuracy: 75.0,
      topics: [
        {
          id: '2-1',
          name: 'Álgebra Linear',
          totalTime: 120,
          questionsAnswered: 40,
          questionsCorrect: 32,
          accuracy: 80.0,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '9', date: new Date('2024-01-15'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 16, notes: 'Matrizes e determinantes' },
            { id: '10', date: new Date('2024-01-14'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 16, notes: 'Sistemas lineares' },
          ]
        },
        {
          id: '2-2',
          name: 'Geometria',
          totalTime: 240,
          questionsAnswered: 80,
          questionsCorrect: 58,
          accuracy: 72.5,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '11', date: new Date('2024-01-13'), timeSpent: 120, questionsAnswered: 40, questionsCorrect: 28, notes: 'Geometria plana' },
            { id: '12', date: new Date('2024-01-12'), timeSpent: 120, questionsAnswered: 40, questionsCorrect: 30, notes: 'Geometria espacial' },
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Português',
      importance: 'medium',
      totalTime: 240,
      totalQuestions: 80,
      totalCorrect: 68,
      overallAccuracy: 85.0,
      topics: [
        {
          id: '3-1',
          name: 'Gramática',
          totalTime: 120,
          questionsAnswered: 40,
          questionsCorrect: 34,
          accuracy: 85.0,
          status: 'completed',
          isRunning: false,
          records: [
            { id: '13', date: new Date('2024-01-11'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 17, notes: 'Sintaxe' },
            { id: '14', date: new Date('2024-01-10'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 17, notes: 'Morfologia' },
          ]
        },
        {
          id: '3-2',
          name: 'Interpretação de Texto',
          totalTime: 120,
          questionsAnswered: 40,
          questionsCorrect: 34,
          accuracy: 85.0,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '15', date: new Date('2024-01-09'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 17, notes: 'Textos dissertativos' },
            { id: '16', date: new Date('2024-01-08'), timeSpent: 60, questionsAnswered: 20, questionsCorrect: 17, notes: 'Textos narrativos' },
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Informática',
      importance: 'low',
      totalTime: 180,
      totalQuestions: 60,
      totalCorrect: 48,
      overallAccuracy: 80.0,
      topics: [
        {
          id: '4-1',
          name: 'Hardware',
          totalTime: 90,
          questionsAnswered: 30,
          questionsCorrect: 24,
          accuracy: 80.0,
          status: 'completed',
          isRunning: false,
          records: [
            { id: '17', date: new Date('2024-01-07'), timeSpent: 90, questionsAnswered: 30, questionsCorrect: 24, notes: 'Componentes básicos' },
          ]
        },
        {
          id: '4-2',
          name: 'Software',
          totalTime: 90,
          questionsAnswered: 30,
          questionsCorrect: 24,
          accuracy: 80.0,
          status: 'in-progress',
          isRunning: false,
          records: [
            { id: '18', date: new Date('2024-01-06'), timeSpent: 90, questionsAnswered: 30, questionsCorrect: 24, notes: 'Sistemas operacionais' },
          ]
        }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [importanceFilter, setImportanceFilter] = useState<ImportanceFilter>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [showEditTopicModal, setShowEditTopicModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  const [bulkInput, setBulkInput] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [newRecord, setNewRecord] = useState({
    timeSpent: '',
    questionsAnswered: '',
    questionsCorrect: '',
    notes: ''
  });

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimer) {
      interval = setInterval(() => {
        setSubjects(prev => prev.map(subject => ({
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === activeTimer && topic.isRunning) {
              return {
                ...topic,
                totalTime: topic.totalTime + (1/60) // Add 1 second in minutes
              };
            }
            return topic;
          })
        })));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimer]);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.topics.some(topic => topic.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesImportance = importanceFilter === 'all' || subject.importance === importanceFilter;
    return matchesSearch && matchesImportance;
  });

  const handleTopicControl = (subjectId: string, topicId: string, action: 'start' | 'pause' | 'stop') => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === topicId) {
              switch (action) {
                case 'start':
                  setActiveTimer(topicId);
                  return { ...topic, status: 'in-progress', isRunning: true };
                case 'pause':
                  setActiveTimer(null);
                  return { ...topic, isRunning: false };
                case 'stop':
                  setActiveTimer(null);
                  return { ...topic, status: 'not-started', isRunning: false };
                default:
                  return topic;
              }
            } else if (action === 'start') {
              return { ...topic, isRunning: false };
            }
            return topic;
          })
        };
      } else if (action === 'start') {
        return {
          ...subject,
          topics: subject.topics.map(topic => ({ ...topic, isRunning: false }))
        };
      }
      return subject;
    }));
  };

  const parseBulkInput = (input: string) => {
    const subjects: { name: string; topics: string[]; importance: 'high' | 'medium' | 'low' }[] = [];
    
    // Split by semicolon to get each subject
    const subjectParts = input.split(';').filter(part => part.trim());
    
    subjectParts.forEach(part => {
      const [subjectPart, topicsPart] = part.split(':');
      if (subjectPart && topicsPart) {
        const subjectName = subjectPart.trim();
        const topics = topicsPart.split(',').map(t => t.trim()).filter(t => t);
        
        if (subjectName && topics.length > 0) {
          subjects.push({
            name: subjectName,
            topics,
            importance: 'medium' // Default importance
          });
        }
      }
    });
    
    return subjects;
  };

  const addBulkSubjects = () => {
    if (!bulkInput.trim()) {
      Alert.alert('Erro', 'Digite as matérias no formato: Matéria:tópico1,tópico2;Matéria2:tópico1,tópico2');
      return;
    }

    try {
      const parsedSubjects = parseBulkInput(bulkInput);
      
      if (parsedSubjects.length === 0) {
        Alert.alert('Erro', 'Formato inválido. Use: Matéria:tópico1,tópico2;Matéria2:tópico1,tópico2');
        return;
      }

      const newSubjects: Subject[] = parsedSubjects.map(parsed => {
        const subjectId = Date.now().toString() + Math.random().toString();
        const topics: Topic[] = parsed.topics.map((topicName, index) => ({
          id: `${subjectId}-${index}`,
          name: topicName,
          totalTime: 0,
          questionsAnswered: 0,
          questionsCorrect: 0,
          accuracy: 0,
          status: 'not-started',
          isRunning: false,
          records: []
        }));

        return {
          id: subjectId,
          name: parsed.name,
          importance: parsed.importance,
          topics,
          totalTime: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          overallAccuracy: 0
        };
      });

      setSubjects(prev => [...prev, ...newSubjects]);
      setBulkInput('');
      setShowAddModal(false);
      Alert.alert('Sucesso', `${newSubjects.length} matéria(s) adicionada(s) com sucesso!`);
    } catch (error) {
      Alert.alert('Erro', 'Formato inválido. Use: Matéria:tópico1,tópico2;Matéria2:tópico1,tópico2');
    }
  };

  const editSubject = (subject: Subject) => {
    setEditingSubject({ ...subject });
    setShowEditSubjectModal(true);
  };

  const updateSubject = () => {
    if (!editingSubject) return;

    setSubjects(prev => prev.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, name: editingSubject.name, importance: editingSubject.importance }
        : subject
    ));

    setEditingSubject(null);
    setShowEditSubjectModal(false);
    Alert.alert('Sucesso', 'Matéria atualizada com sucesso!');
  };

  const editTopic = (subject: Subject, topic: Topic) => {
    setSelectedSubject(subject);
    setEditingTopic({ ...topic });
    setShowEditTopicModal(true);
  };

  const updateTopic = () => {
    if (!editingTopic || !selectedSubject) return;

    setSubjects(prev => prev.map(subject => 
      subject.id === selectedSubject.id 
        ? {
            ...subject,
            topics: subject.topics.map(topic => 
              topic.id === editingTopic.id 
                ? { ...topic, name: editingTopic.name }
                : topic
            )
          }
        : subject
    ));

    setEditingTopic(null);
    setSelectedSubject(null);
    setShowEditTopicModal(false);
    Alert.alert('Sucesso', 'Tópico atualizado com sucesso!');
  };

  const addRecord = () => {
    if (!selectedTopic || !selectedSubject || !newRecord.timeSpent || !newRecord.questionsAnswered || !newRecord.questionsCorrect) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const timeSpent = parseInt(newRecord.timeSpent);
    const questionsAnswered = parseInt(newRecord.questionsAnswered);
    const questionsCorrect = parseInt(newRecord.questionsCorrect);

    if (questionsCorrect > questionsAnswered) {
      Alert.alert('Erro', 'Questões corretas não pode ser maior que questões respondidas');
      return;
    }

    const record: StudyRecord = {
      id: Date.now().toString(),
      date: new Date(),
      timeSpent,
      questionsAnswered,
      questionsCorrect,
      notes: newRecord.notes
    };

    setSubjects(prev => prev.map(subject => {
      if (subject.id === selectedSubject.id) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.id === selectedTopic.id) {
              const newTotalTime = topic.totalTime + timeSpent;
              const newTotalQuestions = topic.questionsAnswered + questionsAnswered;
              const newTotalCorrect = topic.questionsCorrect + questionsCorrect;
              const newAccuracy = newTotalQuestions > 0 ? (newTotalCorrect / newTotalQuestions) * 100 : 0;

              return {
                ...topic,
                totalTime: newTotalTime,
                questionsAnswered: newTotalQuestions,
                questionsCorrect: newTotalCorrect,
                accuracy: newAccuracy,
                records: [...topic.records, record]
              };
            }
            return topic;
          })
        };
      }
      return subject;
    }));

    setNewRecord({ timeSpent: '', questionsAnswered: '', questionsCorrect: '', notes: '' });
    setShowRecordModal(false);
    Alert.alert('Sucesso', 'Registro adicionado com sucesso!');
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este tópico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setSubjects(prev => prev.map(subject => 
              subject.id === subjectId 
                ? { ...subject, topics: subject.topics.filter(topic => topic.id !== topicId) }
                : subject
            ));
          },
        },
      ]
    );
  };

  const deleteSubject = (subjectId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta matéria e todos os seus tópicos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
          },
        },
      ]
    );
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min ${secs}s`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#48bb78';
    if (accuracy >= 70) return '#d69e2e';
    return '#e53e3e';
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return '#e53e3e';
      case 'medium': return '#d69e2e';
      case 'low': return '#48bb78';
      default: return '#a0aec0';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matérias & Tópicos</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.compactButton}
            onPress={() => setCompactMode(!compactMode)}
          >
            {compactMode ? <Maximize2 size={20} color="#a0aec0" /> : <Minimize2 size={20} color="#a0aec0" />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#a0aec0" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar matérias ou tópicos..."
              placeholderTextColor="#a0aec0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Importância:</Text>
            <View style={styles.filterButtons}>
              {[
                { key: 'all', label: 'Todas', color: '#a0aec0' },
                { key: 'high', label: 'Alta', color: '#e53e3e' },
                { key: 'medium', label: 'Média', color: '#d69e2e' },
                { key: 'low', label: 'Baixa', color: '#48bb78' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  style={[
                    styles.filterButton,
                    importanceFilter === filter.key && styles.filterButtonActive,
                    { borderColor: filter.color }
                  ]}
                  onPress={() => setImportanceFilter(filter.key as ImportanceFilter)}
                >
                  <View style={[styles.filterDot, { backgroundColor: filter.color }]} />
                  <Text style={[
                    styles.filterButtonText,
                    importanceFilter === filter.key && styles.filterButtonTextActive
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Subjects */}
        <View style={styles.subjectsSection}>
          {filteredSubjects.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#4a5568" />
              <Text style={styles.emptyText}>Nenhuma matéria encontrada</Text>
              <Text style={styles.emptySubtext}>Adicione uma nova matéria para começar</Text>
            </View>
          ) : (
            filteredSubjects.map((subject) => (
              <View key={subject.id} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <View style={styles.subjectMeta}>
                      <View style={[styles.importanceBadge, { backgroundColor: getImportanceColor(subject.importance) }]}>
                        <Text style={styles.importanceText}>{getImportanceLabel(subject.importance)}</Text>
                      </View>
                      <Text style={styles.topicCount}>{subject.topics.length} tópicos</Text>
                    </View>
                  </View>
                  <View style={styles.subjectActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => editSubject(subject)}
                    >
                      <Edit3 size={16} color="#a0aec0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => deleteSubject(subject.id)}
                    >
                      <Trash2 size={16} color="#e53e3e" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Topics */}
                <View style={styles.topicsContainer}>
                  {subject.topics.length === 0 ? (
                    <View style={styles.emptyTopics}>
                      <Text style={styles.emptyTopicsText}>Nenhum tópico adicionado</Text>
                    </View>
                  ) : (
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.topicsScrollContent}
                    >
                      {subject.topics.map((topic) => (
                        <View key={topic.id} style={[
                          styles.topicCard,
                          compactMode && styles.topicCardCompact
                        ]}>
                          {!compactMode && (
                            <>
                              <View style={styles.topicHeader}>
                                <Text style={styles.topicName} numberOfLines={2}>{topic.name}</Text>
                                <View style={styles.topicActions}>
                                  <TouchableOpacity
                                    style={styles.topicActionButton}
                                    onPress={() => editTopic(subject, topic)}
                                  >
                                    <Edit3 size={12} color="#a0aec0" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={styles.topicActionButton}
                                    onPress={() => {
                                      setSelectedSubject(subject);
                                      setSelectedTopic(topic);
                                      setShowRecordModal(true);
                                    }}
                                  >
                                    <Plus size={12} color="#a0aec0" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={styles.topicActionButton}
                                    onPress={() => deleteTopic(subject.id, topic.id)}
                                  >
                                    <Trash2 size={12} color="#e53e3e" />
                                  </TouchableOpacity>
                                </View>
                              </View>

                              <View style={styles.topicStats}>
                                <View style={styles.statItem}>
                                  <Clock size={12} color="#a0aec0" />
                                  <Text style={styles.statText}>{formatTime(topic.totalTime)}</Text>
                                </View>
                                <View style={styles.statItem}>
                                  <Target size={12} color="#a0aec0" />
                                  <Text style={styles.statText}>{topic.questionsCorrect}/{topic.questionsAnswered}</Text>
                                </View>
                              </View>

                              <View style={styles.accuracyContainer}>
                                <Text style={[styles.accuracyText, { color: getAccuracyColor(topic.accuracy) }]}>
                                  {topic.accuracy.toFixed(1)}%
                                </Text>
                              </View>

                              {/* Study Records */}
                              {topic.records.length > 0 && (
                                <View style={styles.recordsContainer}>
                                  <Text style={styles.recordsTitle}>Registros:</Text>
                                  <ScrollView style={styles.recordsList} nestedScrollEnabled>
                                    {topic.records.slice(-3).map((record) => (
                                      <View key={record.id} style={styles.recordItem}>
                                        <Text style={styles.recordDate}>
                                          {record.date.toLocaleDateString('pt-BR')}
                                        </Text>
                                        <Text style={styles.recordStats}>
                                          {formatTime(record.timeSpent)} • {record.questionsCorrect}/{record.questionsAnswered}
                                        </Text>
                                        {record.notes && (
                                          <Text style={styles.recordNotes} numberOfLines={2}>
                                            {record.notes}
                                          </Text>
                                        )}
                                      </View>
                                    ))}
                                  </ScrollView>
                                </View>
                              )}

                              <View style={styles.topicControls}>
                                <TouchableOpacity
                                  style={[styles.controlButton, styles.playButton]}
                                  onPress={() => handleTopicControl(subject.id, topic.id, topic.isRunning ? 'pause' : 'start')}
                                >
                                  {topic.isRunning ? (
                                    <Pause size={14} color="#ffffff" />
                                  ) : (
                                    <Play size={14} color="#ffffff" />
                                  )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.controlButton, styles.stopButton]}
                                  onPress={() => handleTopicControl(subject.id, topic.id, 'stop')}
                                >
                                  <Square size={14} color="#ffffff" />
                                </TouchableOpacity>
                              </View>
                            </>
                          )}

                          {compactMode && (
                            <>
                              <Text style={styles.topicNameCompact} numberOfLines={1}>{topic.name}</Text>
                              <View style={[styles.accuracyDot, { backgroundColor: getAccuracyColor(topic.accuracy) }]} />
                              <View style={styles.topicControlsCompact}>
                                <TouchableOpacity
                                  style={styles.compactControlButton}
                                  onPress={() => handleTopicControl(subject.id, topic.id, topic.isRunning ? 'pause' : 'start')}
                                >
                                  {topic.isRunning ? (
                                    <Pause size={12} color="#ffffff" />
                                  ) : (
                                    <Play size={12} color="#ffffff" />
                                  )}
                                </TouchableOpacity>
                              </View>
                            </>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Subjects Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Matérias</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>
                Digite no formato: Matéria:tópico1,tópico2;Matéria2:tópico1,tópico2
              </Text>
              <TextInput
                style={styles.bulkInput}
                placeholder="Ex: Direito Constitucional:Princípios,Direitos;Matemática:Álgebra,Geometria"
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
                  onPress={addBulkSubjects}
                >
                  <Text style={styles.saveButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal
        visible={showEditSubjectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditSubjectModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Matéria</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditSubjectModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome da Matéria</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nome da matéria"
                placeholderTextColor="#a0aec0"
                value={editingSubject?.name || ''}
                onChangeText={(text) => setEditingSubject(prev => prev ? { ...prev, name: text } : null)}
              />

              <Text style={styles.inputLabel}>Importância:</Text>
              <View style={styles.importanceOptions}>
                {[
                  { key: 'high', label: 'Alta', color: '#e53e3e' },
                  { key: 'medium', label: 'Média', color: '#d69e2e' },
                  { key: 'low', label: 'Baixa', color: '#48bb78' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.importanceOption,
                      editingSubject?.importance === option.key && styles.importanceOptionActive,
                      { borderColor: option.color }
                    ]}
                    onPress={() => setEditingSubject(prev => prev ? { ...prev, importance: option.key as any } : null)}
                  >
                    <View style={[styles.importanceOptionDot, { backgroundColor: option.color }]} />
                    <Text style={[
                      styles.importanceOptionText,
                      editingSubject?.importance === option.key && styles.importanceOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditSubjectModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={updateSubject}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Topic Modal */}
      <Modal
        visible={showEditTopicModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditTopicModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Tópico</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowEditTopicModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nome do Tópico</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nome do tópico"
                placeholderTextColor="#a0aec0"
                value={editingTopic?.name || ''}
                onChangeText={(text) => setEditingTopic(prev => prev ? { ...prev, name: text } : null)}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditTopicModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={updateTopic}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Record Modal */}
      <Modal
        visible={showRecordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRecordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Estudo</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRecordModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                {selectedSubject?.name} - {selectedTopic?.name}
              </Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tempo (min)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="0"
                    placeholderTextColor="#a0aec0"
                    keyboardType="numeric"
                    value={newRecord.timeSpent}
                    onChangeText={(text) => setNewRecord(prev => ({ ...prev, timeSpent: text }))}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Questões</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="0"
                    placeholderTextColor="#a0aec0"
                    keyboardType="numeric"
                    value={newRecord.questionsAnswered}
                    onChangeText={(text) => setNewRecord(prev => ({ ...prev, questionsAnswered: text }))}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Questões Corretas</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0"
                placeholderTextColor="#a0aec0"
                keyboardType="numeric"
                value={newRecord.questionsCorrect}
                onChangeText={(text) => setNewRecord(prev => ({ ...prev, questionsCorrect: text }))}
              />

              <Text style={styles.inputLabel}>Observações (opcional)</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Adicione suas observações..."
                placeholderTextColor="#a0aec0"
                multiline
                numberOfLines={3}
                value={newRecord.notes}
                onChangeText={(text) => setNewRecord(prev => ({ ...prev, notes: text }))}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowRecordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={addRecord}
                >
                  <Text style={styles.saveButtonText}>Registrar</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  compactButton: {
    backgroundColor: '#2d3748',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchSection: {
    padding: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#2d3748',
  },
  filterButtonActive: {
    backgroundColor: '#4a5568',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  filterButtonText: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  subjectsSection: {
    padding: 20,
    paddingTop: 10,
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
  },
  subjectCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  importanceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  topicCount: {
    color: '#a0aec0',
    fontSize: 14,
  },
  subjectActions: {
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
  topicsContainer: {
    minHeight: 120,
  },
  emptyTopics: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTopicsText: {
    color: '#4a5568',
    fontSize: 14,
  },
  topicsScrollContent: {
    paddingRight: 16,
  },
  topicCard: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  topicCardCompact: {
    width: 120,
    height: 80,
    justifyContent: 'space-between',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  topicName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  topicNameCompact: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  topicActions: {
    flexDirection: 'row',
    gap: 4,
  },
  topicActionButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#2d3748',
  },
  topicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#a0aec0',
    fontSize: 12,
  },
  accuracyContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  accuracyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accuracyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  recordsContainer: {
    marginBottom: 12,
  },
  recordsTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recordsList: {
    maxHeight: 60,
  },
  recordItem: {
    backgroundColor: '#2d3748',
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  recordDate: {
    color: '#48bb78',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recordStats: {
    color: '#a0aec0',
    fontSize: 10,
    marginTop: 2,
  },
  recordNotes: {
    color: '#e2e8f0',
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },
  topicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  topicControlsCompact: {
    alignItems: 'center',
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactControlButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48bb78',
  },
  playButton: {
    backgroundColor: '#48bb78',
  },
  stopButton: {
    backgroundColor: '#e53e3e',
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
    padding: 8,
  },
  closeButtonText: {
    color: '#a0aec0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInput: {
    backgroundColor: '#1a202c',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  importanceOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  importanceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#1a202c',
  },
  importanceOptionActive: {
    backgroundColor: '#4a5568',
  },
  importanceOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  importanceOptionText: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '600',
  },
  importanceOptionTextActive: {
    color: '#ffffff',
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