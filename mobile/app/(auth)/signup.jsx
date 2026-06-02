import {
  Alert, KeyboardAvoidingView, Platform, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import styles from '../../assets/styles/signup.styles';
import { COLORS } from '../../constants/colors';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSignup = async () => {
    const result = await register(username, email, password);
    if (!result.success) Alert.alert('Erreur', result.error);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>📚 Créer un compte</Text>
      <Text style={styles.subtitle}>Rejoins la communauté de lecteurs</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={COLORS.gray}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Création...' : "S'inscrire"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.linkText}>
          Déjà un compte ? <Text style={styles.link}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

