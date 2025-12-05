import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import LogoIcon from '@/components/icons/LogoIcon';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const displayName = useMemo(() => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  }, [user?.user_metadata?.full_name, user?.email]);

  const handleTakeQuiz = useCallback(() => {
    router.push('/gift-quiz' as Parameters<typeof router.push>[0]);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LogoIcon size={40} />
          <Text style={styles.logo}>Givio</Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello, {displayName}!</Text>
          <Text style={styles.subtitle}>
            Ready to find the perfect gift?
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleTakeQuiz}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Take Gift Quiz"
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>🎁</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Take Gift Quiz</Text>
              <Text style={styles.actionDescription}>
                Answer a few questions to get personalized recommendations
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>👤</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add Recipient</Text>
              <Text style={styles.actionDescription}>
                Save someone's preferences for later
              </Text>
            </View>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📋</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Wishlists</Text>
              <Text style={styles.actionDescription}>
                Browse saved gift ideas and occasions
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonEmoji}>🚀</Text>
            <Text style={styles.comingSoonTitle}>More features coming soon!</Text>
            <Text style={styles.comingSoonText}>
              We're working on AI gift recommendations, trending gifts, and more.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.foreground,
    letterSpacing: -0.5,
  },
  welcomeSection: {
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.foreground,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.foreground,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    letterSpacing: 0.1,
  },
  comingSoonCard: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },
  comingSoonEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
});
