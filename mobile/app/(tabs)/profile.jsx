import {
  FlatList, Text, View, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatPublishDate } from '../../lib/utils';
import ProfilHeader from '../../components/ProfilHeader';
import LogoutButton from '../../components/LogoutButton';
import Loader from '../../components/Loader';
import styles from '../../assets/styles/profile.styles';
import { COLORS } from '../../constants/colors';

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  if (loading) return <Loader />;

  return (
    <FlatList
      style={{ backgroundColor: COLORS.background }}
      data={books}
      keyExtractor={(item) => item._id}
      renderItem={renderBookItem}
      ListHeaderComponent={
        <>
          <ProfilHeader />
          <LogoutButton />
          <Text style={styles.booksTitle}>Mes recommandations ({books.length})</Text>
        </>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>Aucune recommandation pour l'instant</Text>
      }
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
