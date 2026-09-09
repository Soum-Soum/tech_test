import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { createSituation } from '../api/situations';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  categoryLabels,
  SituationCategory,
  SituationStatus,
  statusLabels,
} from '../types/situation';

type Props = NativeStackScreenProps<RootStackParamList, 'NewSituation'>;

const categories: SituationCategory[] = [
  'relationship',
  'work',
  'conflict',
  'assertiveness',
  'other',
];

const statuses: SituationStatus[] = [
  'draft',
  'active',
  'completed',
  'archived',
];

export default function NewSituationScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SituationCategory>('other');
  const [status, setStatus] = useState<SituationStatus>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSituation = async () => {
    if (!title.trim()) {
      setError('Ajoutez un titre pour continuer.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const created = await createSituation({
        title: title.trim(),
        description: description.trim(),
        category,
        status,
      });
      console.log('Created situation', created.id);
      navigation.goBack();
    } catch {
      setError('La situation n’a pas pu être créée.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.intro}>
        Notez ce que vous souhaitez préparer ou mieux comprendre.
      </Text>

      <Text style={styles.label}>Titre</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex. Demander une augmentation"
        placeholderTextColor="#9BA5B6"
        style={styles.input}
        maxLength={200}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Quelques détails pour vous aider à y voir plus clair..."
        placeholderTextColor="#9BA5B6"
        multiline
        numberOfLines={5}
        style={[styles.input, styles.descriptionInput]}
      />

      <Text style={styles.label}>Catégorie</Text>
      <View style={styles.chips}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setCategory(item)}
            style={[styles.chip, category === item && styles.chipSelected]}
          >
            <Text
              style={[styles.chipText, category === item && styles.chipTextSelected]}
            >
              {categoryLabels[item]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Statut</Text>
      <View style={styles.chips}>
        {statuses.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setStatus(item)}
            style={[styles.chip, status === item && styles.chipSelected]}
          >
            <Text
              style={[styles.chipText, status === item && styles.chipTextSelected]}
            >
              {statusLabels[item]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={saveSituation}
        disabled={saving}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {saving ? 'Enregistrement...' : 'Créer la situation'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F5F7FB',
    flex: 1,
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  intro: {
    color: '#7D879A',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 25,
  },
  label: {
    color: '#35425E',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
    marginTop: 17,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EBF3',
    borderRadius: 14,
    borderWidth: 1,
    color: '#1C2740',
    fontSize: 15,
    minHeight: 52,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  descriptionInput: {
    minHeight: 122,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EBF3',
    borderRadius: 18,
    borderWidth: 1,
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipSelected: {
    backgroundColor: '#E3E9FA',
    borderColor: '#B8C4E9',
  },
  chipText: {
    color: '#788398',
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#5268A3',
    fontWeight: '700',
  },
  error: {
    color: '#B74C48',
    fontSize: 13,
    marginTop: 17,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#5268A3',
    borderRadius: 15,
    height: 54,
    justifyContent: 'center',
    marginTop: 26,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
