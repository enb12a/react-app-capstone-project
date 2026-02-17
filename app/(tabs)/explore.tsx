import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProfile } from '@/types/menu';
import { getUserProfile, saveUserProfile, initDatabase, checkOnboardingStatus } from '@/utils/database';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    orderStatusesNotification: true,
    passwordChangesNotification: true,
    specialOffersNotification: true,
    newsletterNotification: true,
  });

  const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      await initDatabase();
      const userProfile = await getUserProfile();
      if (userProfile) {
        setProfile(userProfile);
        setInitialProfile(userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<UserProfile, 'id'>, value: string | boolean) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await saveUserProfile(profile);
      setInitialProfile(profile);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    if (initialProfile) {
      setProfile(initialProfile);
      setHasChanges(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Reset onboarding status and navigate to onboarding screen
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerLogo}>🍋</Text>
          <Text style={[styles.headerLogoText, { color: colors.text }]}>LITTLE LEMON</Text>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal information</Text>

          {/* Avatar */}
          <View style={[styles.avatarSection, { backgroundColor: colors.lightGray }]}>
            <Image
              source={require('@/assets/images/profile-avatar.jpg')}
              style={styles.avatarImage}
            />
            <View style={styles.avatarButtons}>
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonBorder, { borderColor: colors.primary }]}
              >
                <Text style={[styles.buttonText, { color: colors.primary }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* First Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>First name</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.lightGray }
              ]}
              value={profile.firstName}
              onChangeText={(value) => handleInputChange('firstName', value)}
              editable={!loading}
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Last name</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.lightGray }
              ]}
              value={profile.lastName}
              onChangeText={(value) => handleInputChange('lastName', value)}
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.lightGray }
              ]}
              value={profile.email}
              onChangeText={(value) => handleInputChange('email', value)}
              editable={!loading}
            />
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone number</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.lightGray }
              ]}
              value={profile.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              editable={!loading}
            />
          </View>
        </View>

        {/* Email Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Email notifications</Text>

          {/* Order Statuses */}
          <View style={styles.notificationRow}>
            <Text style={[styles.notificationLabel, { color: colors.text }]}>Order statuses</Text>
            <Switch
              value={profile.orderStatusesNotification}
              onValueChange={(value) => handleInputChange('orderStatusesNotification', value)}
              trackColor={{ false: colors.lightGray, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          {/* Password Changes */}
          <View style={styles.notificationRow}>
            <Text style={[styles.notificationLabel, { color: colors.text }]}>Password changes</Text>
            <Switch
              value={profile.passwordChangesNotification}
              onValueChange={(value) => handleInputChange('passwordChangesNotification', value)}
              trackColor={{ false: colors.lightGray, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          {/* Special Offers */}
          <View style={styles.notificationRow}>
            <Text style={[styles.notificationLabel, { color: colors.text }]}>Special offers</Text>
            <Switch
              value={profile.specialOffersNotification}
              onValueChange={(value) => handleInputChange('specialOffersNotification', value)}
              trackColor={{ false: colors.lightGray, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>

          {/* Newsletter */}
          <View style={styles.notificationRow}>
            <Text style={[styles.notificationLabel, { color: colors.text }]}>Newsletter</Text>
            <Switch
              value={profile.newsletterNotification}
              onValueChange={(value) => handleInputChange('newsletterNotification', value)}
              trackColor={{ false: colors.lightGray, true: colors.accent }}
              thumbColor={colors.primary}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.accent }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.text }]}>Log out</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.buttonBorder, { borderColor: colors.primary }]}
            onPress={handleDiscardChanges}
            disabled={!hasChanges}
          >
            <Text style={[styles.buttonText, { color: colors.primary }]}>Discard changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSaveChanges}
            disabled={!hasChanges}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  backButton: {
    fontSize: 28,
    fontWeight: '600',
  },
  headerLogo: {
    fontSize: 20,
    marginRight: 4,
  },
  headerLogoText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    flex: 1,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  avatarButtons: {
    flex: 1,
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonBorder: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
});
