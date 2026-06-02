import { SafeAreaView, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const SafeScreen = ({ children }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
});

export default SafeScreen;
