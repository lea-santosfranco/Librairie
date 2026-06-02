import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  bookDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  booksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: 40,
    fontSize: 15,
  },
});
