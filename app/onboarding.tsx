import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { completeOnboarding, initDatabase } from '@/utils/database';

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { firstName?: string; email?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnboard = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await initDatabase();
      await completeOnboarding(firstName, email);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setErrors({ firstName: 'Failed to complete onboarding. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🍋</Text>
          <Text style={[styles.logoText, { color: colors.text }]}>LITTLE LEMON</Text>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.primary }]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Little Lemon</Text>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroDescription}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>

          {/* Placeholder for hero image */}
          <View style={styles.heroImage}>
            <Text style={styles.imagePlaceholder}>🍗</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Get Started</Text>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Name *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.firstName ? '#e74c3c' : colors.lightGray,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={colors.icon}
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName) {
                  setErrors({ ...errors, firstName: undefined });
                }
              }}
              editable={!loading}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.email ? '#e74c3c' : colors.lightGray,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.icon}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              editable={!loading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.accent }, loading && styles.submitButtonDisabled]}
            onPress={handleOnboard}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={[styles.submitButtonText, { color: colors.text }]}>Continue</Text>
            )}
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
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingTop: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F4CE14',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    flex: 1,
    justifyContent: 'flex-start',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
