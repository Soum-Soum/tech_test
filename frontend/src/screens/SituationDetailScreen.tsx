import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { updateFavorite } from '../api/situations';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
  categoryLabels,
  statusLabels,
} from '../types/situation';

type Props = NativeStackScreenProps<RootStackParamList, 'SituationDetail'>;

export default function SituationDetailScreen({ route }: Props) {
  const [situation, setSituation] = useState(route.params.situation);
  const [error, setError] = useState<string | null>(null);

  const toggleFavorite = async () => {
    try {
      const updated = await updateFavorite(
        situation.id,
        !situation.is_favorite,
      );
      setSituation(updated);
      setError(null);
    } catch {
      setError('Le favori n’a pas pu être mis à jour.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {categoryLabels[situation.category]}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.favorite,
                  situation.is_favorite && styles.favoriteActive,
                ]}
              >
                {situation.is_favorite ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{situation.title}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{statusLabels[situation.status]}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {situation.description || 'Aucune description pour cette situation.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Créée le</Text>
            <Text style={styles.infoValue}>
              {new Date(situation.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mise à jour le</Text>
            <Text style={styles.infoValue}>
              {new Date(situation.updated_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F7FB',
    flex: 1,
  },
  container: {
    padding: 22,
  },
  heroCard: {
    backgroundColor: '#5268A3',
    borderRadius: 22,
    padding: 22,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  favorite: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 31,
  },
  favoriteActive: {
    color: '#FFD77D',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 35,
    marginTop: 26,
  },
  statusPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusDot: {
    backgroundColor: '#A8E6C1',
    borderRadius: 4,
    height: 8,
    marginRight: 7,
    width: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginTop: 17,
    padding: 20,
  },
  sectionTitle: {
    color: '#35425E',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#68748B',
    fontSize: 15,
    lineHeight: 24,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  infoLabel: {
    color: '#8A94A6',
    fontSize: 14,
  },
  infoValue: {
    color: '#35425E',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    backgroundColor: '#EEF1F6',
    height: 1,
    marginVertical: 10,
  },
  error: {
    color: '#B74C48',
    fontSize: 13,
    marginTop: 18,
    textAlign: 'center',
  },
});
