import {
  FlatList, RefreshControl, Text, View,
  ActivityIndicator, Alert, StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../constants/api';
import { formatPublishDate } from '../../lib/utils';
import { COLORS } from '../../constants/colors';

function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    if (loading) return;
    if (!hasMore && !refresh) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (refresh) {
        setBooks(data.books);
      } else {
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b._id));
          const newBooks = data.books.filter((b) => !existingIds.has(b._id));
          return [...prev, ...newBooks];
        });
      }
      setHasMore(pageNum < data.totalPages);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les livres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(1); }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchBooks(nextPage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchBooks(1, true);
    setRefreshing(false);
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color="#f4c430"
        />
      );
    }
    return stars;
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover" />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookMeta}>
          {item.user?.username} • {formatPublishDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  if (loading && books.length === 0) return <Loader />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Recommandations</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading ? <ActivityIndicator color={COLORS.primary} style={{ margin: 16 }} /> : null}
        ListEmptyComponent={<Text style={styles.empty}>Aucun livre pour l'instant</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, padding: 16, paddingBottom: 0 },
  bookCard: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4,
    elevation: 2,
  },
  bookImage: { width: 90, height: 120 },
  bookInfo: { flex: 1, padding: 12 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', marginBottom: 4 },
  bookCaption: { fontSize: 13, color: COLORS.gray, marginBottom: 8 },
  bookMeta: { fontSize: 12, color: COLORS.tabBarInactive },
  empty: { textAlign: 'center', color: COLORS.gray, marginTop: 40 },
});
