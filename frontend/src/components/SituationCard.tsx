import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  categoryLabels,
  Situation,
  statusLabels,
} from '../types/situation';

interface SituationCardProps {
  situation: Situation;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export default function SituationCard({
  situation,
  onPress,
  onToggleFavorite,
}: SituationCardProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.75}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {situation.title}
          </Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {situation.description || 'Aucune description'}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>{categoryLabels[situation.category]}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.status}>{statusLabels[situation.status]}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        activeOpacity={0.6}
      >
        <Text style={[styles.favorite, situation.is_favorite && styles.favoriteActive]}>
          {situation.is_favorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 12,
    paddingLeft: 18,
    shadowColor: '#24324A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingVertical: 17,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#1C2740',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    color: '#6D7890',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  category: {
    color: '#5268A3',
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    color: '#AAB2C2',
    fontSize: 14,
    marginHorizontal: 6,
  },
  status: {
    color: '#7F899B',
    fontSize: 12,
  },
  favoriteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58,
    paddingHorizontal: 12,
  },
  favorite: {
    color: '#A8B0BF',
    fontSize: 28,
  },
  favoriteActive: {
    color: '#F2A93B',
  },
});
