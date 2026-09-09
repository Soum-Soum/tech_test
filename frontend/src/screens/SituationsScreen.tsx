import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { API_URL, updateFavorite } from '../api/situations';
import SituationCard from '../components/SituationCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Situations'>;

export default function SituationsScreen({ navigation }: Props) {
  const [situations, setSituations] = useState<any[]>([]);
  const [favoriteSituations, setFavoriteSituations] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSituations = async (term = search, isRefresh = false) => {
    setLoading(true);
    setError(null);
    if (isRefresh) {
      setRefreshing(true);
    }

    const url =
      `${API_URL}/situations?search=${encodeURIComponent(term)}` +
      '&page=1&page_size=50';

    try {
      setSituations([]);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Loaded situations', data.items?.length);
      setSituations(data.items || []);
    } catch (requestError) {
      console.log('Situations request failed', requestError);
      setError('Impossible de charger les situations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSituations(search);
  }, [search]);

  useFocusEffect(
    React.useCallback(() => {
      loadSituations(search);
    }, []),
  );

  useEffect(() => {
    setFavoriteSituations(situations.filter((item) => item.is_favorite));
  }, [situations]);

  const openSituation = (situation: any) => {
    (navigation as any).navigate('SituationDetail', { situation });
  };

  const toggleFavorite = async (situation: any) => {
    try {
      const updated = await updateFavorite(
        situation.id,
        !situation.is_favorite,
      );

      setSituations(
        situations.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      setError('Le favori n’a pas pu être mis à jour.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ESPACE PERSONNEL</Text>
          <Text style={styles.heading}>Mes situations</Text>
          <Text style={styles.subtitle}>
            {favoriteSituations.length} favori
            {favoriteSituations.length === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>✦</Text>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher une situation..."
          placeholderTextColor="#9BA5B6"
          style={styles.searchInput}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => loadSituations(search)}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSituations(search, true)}
            tintColor="#5268A3"
          />
        }
      >
        {loading ? (
          <View style={styles.feedback}>
            <ActivityIndicator size="large" color="#5268A3" />
            <Text style={styles.feedbackText}>Chargement...</Text>
          </View>
        ) : situations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◌</Text>
            <Text style={styles.emptyTitle}>Aucune situation trouvée</Text>
            <Text style={styles.emptyText}>
              Commencez par ajouter une situation ou modifiez votre recherche.
            </Text>
          </View>
        ) : (
          situations.map((situation, index) => (
            <SituationCard
              key={index}
              situation={situation}
              onPress={() => openSituation(situation)}
              onToggleFavorite={() => toggleFavorite(situation)}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('NewSituation')}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>＋</Text>
        <Text style={styles.addButtonLabel}>Ajouter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F5F7FB',
    flex: 1,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  eyebrow: {
    color: '#8190B2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  heading: {
    color: '#1C2740',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 5,
  },
  subtitle: {
    color: '#7D879A',
    fontSize: 13,
    marginTop: 7,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: '#E3E9FA',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginTop: 7,
    width: 48,
  },
  headerBadgeText: {
    color: '#5268A3',
    fontSize: 24,
  },
  searchWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EBF3',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    marginHorizontal: 22,
    marginTop: 25,
    paddingHorizontal: 15,
    width: 390,
  },
  searchIcon: {
    color: '#7281A5',
    fontSize: 25,
    marginRight: 9,
    marginTop: -4,
  },
  searchInput: {
    color: '#1C2740',
    flex: 1,
    fontSize: 15,
  },
  clearButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  clearText: {
    color: '#8994A8',
    fontSize: 24,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: '#FFF1F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  errorText: {
    color: '#B74C48',
    flex: 1,
    fontSize: 13,
    marginRight: 12,
  },
  retryText: {
    color: '#A43B37',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 115,
    paddingHorizontal: 22,
  },
  feedback: {
    alignItems: 'center',
    paddingTop: 90,
  },
  feedbackText: {
    color: '#7D879A',
    fontSize: 14,
    marginTop: 13,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 74,
  },
  emptyIcon: {
    color: '#B7C1DC',
    fontSize: 56,
  },
  emptyTitle: {
    color: '#35425E',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
  },
  emptyText: {
    color: '#8993A6',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#5268A3',
    borderRadius: 28,
    bottom: 22,
    elevation: 5,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    position: 'absolute',
    right: 22,
    shadowColor: '#5268A3',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 9,
    width: 138,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '300',
    marginRight: 5,
    marginTop: -2,
  },
  addButtonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
