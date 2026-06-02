import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useAuthStore } from '../store/authStore';
import { formatMemberSince } from '../lib/utils';
import { COLORS } from '../constants/colors';

export default function ProfilHeader() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.card,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 13,
    color: COLORS.tabBarInactive,
    marginTop: 4,
  },
});
