import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../constants/api';
import styles from '../../assets/styles/create.styles';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Create() {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Autorise l'accès à la galerie");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setImageBase64(`data:image/jpeg;base64,${base64}`);
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de sélectionner l'image");
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#f4c430"
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmit = async () => {
    if (!title || !caption || !rating || !imageBase64) {
      Alert.alert('Erreur', 'Remplis tous les champs et ajoute une image');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, caption, rating, image: imageBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert('Succès !', 'Livre ajouté avec succès', [
        { text: 'OK', onPress: () => router.push('/(tabs)') },
      ]);
      setTitle('');
      setCaption('');
      setRating(0);
      setImage(null);
      setImageBase64(null);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.title}>Recommander un livre</Text>

        <TextInput
          style={styles.input}
          placeholder="Titre du livre"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={COLORS.gray}
        />

        <Text style={styles.label}>Note</Text>
        <View style={styles.ratingContainer}>{renderRatingStars()}</View>

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} contentFit="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color={COLORS.gray} />
              <Text style={{ color: COLORS.gray, marginTop: 8 }}>Ajouter une image</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ta recommandation..."
          value={caption}
          onChangeText={setCaption}
          multiline
          numberOfLines={4}
          placeholderTextColor={COLORS.gray}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Publication...' : 'Publier'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
