import {
  FlatList, Text, View, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPublishDate, formatMemberSince } from '../../lib/utils';
import { COLORS } from '../../constants/colors';

function ProfilHeader({ user }) {
  if (!user) return null;
  return (
    <View style={styles.profileHeader}>
      <Image
        source={{ uri: user.profileImage }}
        style={styles.avatar}
        contentFit="cover"
      />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.memberSince}>{formatMemberSince(user.createdAt)}</Text>
    </View>
  );
}

function LogoutButton({ onLogout }) {
  const confirmLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: onLogout },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={22} color="red" />
      <Text style={styles.logoutText}>Se déconnecter</Text>
    </TouchableOpacity>
  );
}

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { user, logout } = useAuthStore();

  const fetchUserBooks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/books/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger tes livres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserBooks(); }, []);

  const handleDeleteBook = async (bookId) => {
    setDeletingId(bookId);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Suppression échouée');
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      Alert.alert('Succès', 'Livre supprimé !');
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (bookId) => {
    Alert.alert('Supprimer', 'Supprimer ce livre ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => handleDeleteBook(bookId) },
    ]);
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover" />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookDate}>{formatPublishDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item._id)} disabled={deletingId === item._id}>
        {deletingId === item._id ? (
          <ActivityIndicator size="small" color="red" />
        ) : (
          <Ionicons name="trash-outline" size={22} color="red" />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: COLORS.background }}
      data={books}
      keyExtractor={(item) => item._id}
      renderItem={renderBookItem}
      ListHeaderComponent={
        <>
          <ProfilHeader user={user} />
          <LogoutButton onLogout={logout} />
          <Text style={styles.sectionTitle}>Mes recommandations ({books.length})</Text>
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>Aucune recommandation pour l'instant</Text>}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchUserBooks();
            setRefreshing(false);
          }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  profileHeader: { alignItems: 'center', padding: 24, backgroundColor: COLORS.card },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  username: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  email: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  memberSince: { fontSize: 13, color: COLORS.tabBarInactive, marginTop: 4 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  logoutText: { color: 'red', marginLeft: 8, fontSize: 15 },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', color: COLORS.text,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  bookCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, marginHorizontal: 16,
    marginBottom: 8, borderRadius: 12, overflow: 'hidden', padding: 8,
  },
  bookImage: { width: 60, height: 80, borderRadius: 8 },
  bookInfo: { flex: 1, paddingHorizontal: 12 },
  bookTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  bookDate: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  empty: { textAlign: 'center', color: COLORS.gray, marginTop: 40 },
});
