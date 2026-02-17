import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MenuItem } from '@/types/menu';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.lightGray }]}>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.description, { color: colors.icon }]}>
          {item.description || 'No description available'}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
      </View>

      {/* Image Placeholder */}
      <View style={[styles.imageContainer, { backgroundColor: colors.lightGray }]}>
        <Text style={styles.imagePlaceholder}>🍽️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  imagePlaceholder: {
    fontSize: 40,
  },
});
