import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeaderProps {
  showProfileButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showProfileButton = true }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🍋</Text>
        <Text style={[styles.logoText, { color: colors.text }]}>LITTLE LEMON</Text>
      </View>

      {showProfileButton && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <Image
            source={require('@/assets/images/profile-avatar.jpg')}
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
