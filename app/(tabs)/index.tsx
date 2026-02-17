import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MenuItem, Category } from '@/types/menu';
import { fetchMenuFromAPI } from '@/services/api';
import { initDatabase, saveMenuItems, getMenuItems } from '@/utils/database';
import MenuItemCard from '@/components/menu-item-card';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const CATEGORIES: Category[] = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuData();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [searchQuery, selectedCategories, menuItems]);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      
      // Initialize database
      await initDatabase();
      
      // Check if we have data in the database
      let items = await getMenuItems();
      
      if (items.length === 0) {
        // Fetch from API if database is empty
        items = await fetchMenuFromAPI();
        await saveMenuItems(items);
      }
      
      setMenuItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = menuItems;

    // Filter by categories
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.has(item.category as Category)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const toggleCategory = (category: Category) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <MenuItemCard item={item} />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Hero Section */}
            <Hero />

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.primary }]}>
              <TextInput
                style={[
                  styles.searchInput,
                  { color: colors.text, backgroundColor: colors.lightGray }
                ]}
                placeholder="Search"
                placeholderTextColor={colors.icon}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Menu Breakdown Title */}
            <View style={[styles.breakdownHeader, { backgroundColor: colors.background }]}>
              <Text style={[styles.breakdownTitle, { color: colors.text }]}>ORDER FOR DELIVERY!</Text>
            </View>

            {/* Category Filter Buttons */}
            <View style={[styles.filterContainer, { backgroundColor: colors.background }]}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterButton,
                    selectedCategories.has(category)
                      ? { backgroundColor: colors.accent }
                      : { backgroundColor: colors.lightGray }
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedCategories.has(category)
                        ? { color: colors.text }
                        : { color: colors.primary }
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No menu items found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  breakdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
