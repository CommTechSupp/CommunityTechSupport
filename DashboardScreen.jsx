// ─── Dashboard Screen ─────────────────────────────────────────────────────────
// Home page: Popular tutorials, top-rated technicians, recently viewed

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../theme/ThemeContext';

import {
  TUTORIALS,
  TECHNICIANS,
  RECENTLY_VIEWED,
} from '../constants/mockData';

import {
  SPACING,
  RADIUS,
  FONT,
} from '../constants/theme';

import {
  SectionHeader,
  StarRating,
  TutorialCardH,
  StatusDot,
  Badge,
} from '../components/SharedComponents';

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme();

  // Dynamic theme colors
  const COLORS = theme.colors;

  // Dynamic styles
  const styles = createStyles(COLORS);

  // Top 3 rated technicians
  const topTechs = [...TECHNICIANS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Top 4 tutorials by views
  const popular = [...TUTORIALS]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Greeting Banner ─────────────────────────────────────────────── */}

      <View style={styles.banner}>
        <View>
          <Text style={styles.greeting}>
            Good morning 👋
          </Text>

          <Text style={styles.subGreeting}>
            What needs fixing today?
          </Text>
        </View>

        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name="person"
            size={22}
            color={COLORS.accent}
          />
        </View>
      </View>

      {/* ── Quick Action Pills ─────────────────────────────────────────── */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickRow}
      >
        {[
          {
            label: 'Phone Repair',
            icon: 'phone-portrait-outline',
          },
          {
            label: 'Laptop Fix',
            icon: 'laptop-outline',
          },
          {
            label: 'Networking',
            icon: 'wifi-outline',
          },
          {
            label: 'Data Recovery',
            icon: 'save-outline',
          },
          {
            label: 'Smart Home',
            icon: 'home-outline',
          },
        ].map((pill) => (
          <TouchableOpacity
            key={pill.label}
            style={styles.pill}
            onPress={() =>
              navigation.navigate('Tutorials')
            }
            activeOpacity={0.8}
          >
            <Ionicons
              name={pill.icon}
              size={16}
              color={COLORS.accent}
            />

            <Text style={styles.pillText}>
              {pill.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Popular Tutorials ──────────────────────────────────────────── */}

      <View style={styles.section}>
        <SectionHeader
          title="Popular Tutorials"
          actionLabel="See All"
          onAction={() =>
            navigation.navigate('Tutorials')
          }
        />

        <FlatList
          horizontal
          data={popular}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TutorialCardH
              item={item}
              onPress={() =>
                navigation.navigate('Tutorials')
              }
            />
          )}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      </View>

      {/* ── Top Rated Technicians ─────────────────────────────────────── */}

      <View style={styles.section}>
        <SectionHeader
          title="Top-Rated Technicians"
          actionLabel="See All"
          onAction={() =>
            navigation.navigate('Hiring')
          }
        />

        {topTechs.map((tech) => (
          <TopTechRow
            key={tech.id}
            tech={tech}
            onPress={() =>
              navigation.navigate('Hiring')
            }
            COLORS={COLORS}
            styles={styles}
          />
        ))}
      </View>

      {/* ── Recently Viewed ────────────────────────────────────────────── */}

      <View style={styles.section}>
        <SectionHeader title="Recently Viewed" />

        {RECENTLY_VIEWED.map((item) => (
          <RecentRow
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('Tutorials')
            }
            COLORS={COLORS}
            styles={styles}
          />
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Technician Row ──────────────────────────────────────────────────────────

function TopTechRow({
  tech,
  onPress,
  COLORS,
  styles,
}) {
  return (
    <TouchableOpacity
      style={styles.techRow}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri:
            tech.avatar ||
            'https://via.placeholder.com/100',
        }}
        style={styles.techAvatar}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.techName}>
          {tech.name}
        </Text>

        <Text style={styles.techSpec}>
          {tech.specialty}
        </Text>

        <StatusDot status={tech.status} />
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          gap: 4,
        }}
      >
        <StarRating rating={tech.rating || 0} />

        <Text style={styles.techRate}>
          ${tech.rate}/hr
        </Text>

        <Text style={styles.techDist}>
          {tech.distance}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Recently Viewed Row ────────────────────────────────────────────────────

function RecentRow({
  item,
  onPress,
  COLORS,
  styles,
}) {
  return (
    <TouchableOpacity
      style={styles.recentRow}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri:
            item.thumbnail ||
            'https://via.placeholder.com/100',
        }}
        style={styles.recentThumb}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={styles.recentTitle}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 4,
          }}
        >
          <Badge
            label={item.category}
            color={COLORS.accent}
          />

          <Text style={styles.recentDur}>
            {item.duration}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  );
}

// ─── Dynamic Styles ─────────────────────────────────────────────────────────

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },

    content: {
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
    },

    // Banner

    banner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
      paddingTop: SPACING.sm,
    },

    greeting: {
      fontSize: 22,
      fontWeight: FONT.black,
      color: COLORS.text,
    },

    subGreeting: {
      fontSize: 14,
      color: COLORS.textSub,
      marginTop: 2,
    },

    avatarPlaceholder: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: `${COLORS.accent}20`,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // Quick Pills

    quickRow: {
      marginBottom: SPACING.lg,
      marginHorizontal: -SPACING.md,
      paddingHorizontal: SPACING.md,
    },

    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.full,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
    },

    pillText: {
      fontSize: 13,
      color: COLORS.text,
      fontWeight: FONT.medium,
    },

    section: {
      marginBottom: SPACING.lg,
    },

    // Technician Row

    techRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.sm + 4,
      marginBottom: SPACING.sm,
      gap: SPACING.sm,
    },

    techAvatar: {
      width: 46,
      height: 46,
      borderRadius: 23,
    },

    techName: {
      fontSize: 14,
      fontWeight: FONT.bold,
      color: COLORS.text,
    },

    techSpec: {
      fontSize: 12,
      color: COLORS.textSub,
      marginBottom: 2,
    },

    techRate: {
      fontSize: 13,
      fontWeight: FONT.semibold,
      color: COLORS.accent,
    },

    techDist: {
      fontSize: 12,
      color: COLORS.muted,
    },

    // Recently Viewed

    recentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
      marginBottom: SPACING.sm,
      gap: SPACING.sm,
    },

    recentThumb: {
      width: 72,
      height: 52,
      borderRadius: RADIUS.sm,
    },

    recentTitle: {
      fontSize: 13,
      fontWeight: FONT.semibold,
      color: COLORS.text,
    },

    recentDur: {
      fontSize: 12,
      color: COLORS.textSub,
    },
  });
