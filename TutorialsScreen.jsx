// ─── DIY Tutorials Screen ─────────────────────────────────────────────────────
// Lists all user-generated tutorials. Includes an expandable video player.

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { TUTORIALS } from '../constants/mockData';
import { TutorialCardV, Badge, StarRating } from '../components/SharedComponents';

// All unique categories derived from mock data
const CATEGORIES = ['All', ...new Set(TUTORIALS.map((t) => t.category))];

export default function TutorialsScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTutorial, setSelectedTutorial] = useState(null); // for modal

  // Filter tutorials by search + category
  const filtered = TUTORIALS.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      {/* ── Search Bar ──────────────────────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tutorials..."
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category Filter Tabs ─────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.md }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Tutorial List ────────────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TutorialCardV item={item} onPress={() => setSelectedTutorial(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={40} color={COLORS.muted} />
            <Text style={styles.emptyText}>No tutorials found</Text>
          </View>
        }
      />

      {/* ── Tutorial Detail Modal (with video player placeholder) ───────────── */}
      {selectedTutorial && (
        <TutorialModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}
    </View>
  );
}

// ── Tutorial Detail Modal ──────────────────────────────────────────────────────
function TutorialModal({ tutorial, onClose }) {
  const [playing, setPlaying] = useState(false);

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modal.container}>
        {/* Close button */}
        <TouchableOpacity style={modal.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ── Video Player Placeholder ─────────────────────────────────── */}
          <View style={modal.videoWrapper}>
            <View style={modal.videoPlaceholder}>
              {playing ? (
                // In production: replace with <Video /> from expo-av
                <View style={modal.playingState}>
                  <Ionicons name="play-circle" size={60} color={COLORS.accent} />
                  <Text style={modal.playingText}>Video playing...</Text>
                  <Text style={modal.playingNote}>(Replace with expo-av Video component)</Text>
                </View>
              ) : (
                <TouchableOpacity style={modal.playButton} onPress={() => setPlaying(true)}>
                  <View style={modal.playCircle}>
                    <Ionicons name="play" size={28} color="#fff" />
                  </View>
                  <Text style={modal.tapText}>Tap to play</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Duration badge */}
            <View style={modal.durationBadge}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={modal.durationText}>{tutorial.duration}</Text>
            </View>
          </View>

          {/* ── Tutorial Info ─────────────────────────────────────────────── */}
          <View style={modal.info}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: SPACING.sm }}>
              <Badge label={tutorial.category} color={COLORS.accent} />
            </View>

            <Text style={modal.title}>{tutorial.title}</Text>

            <View style={modal.metaRow}>
              <StarRating rating={tutorial.rating} size={14} />
              <Text style={modal.metaText}>{tutorial.views.toLocaleString()} views</Text>
              <Text style={modal.metaText}>by {tutorial.author}</Text>
            </View>

            <Text style={modal.description}>{tutorial.description}</Text>

            {/* Tags */}
            <View style={modal.tags}>
              {tutorial.tags.map((tag) => (
                <Badge key={tag} label={`#${tag}`} color={COLORS.textSub} />
              ))}
            </View>

            {/* What you'll need section (mock) */}
            <Text style={modal.subheading}>What You'll Need</Text>
            <View style={modal.toolList}>
              {['Phillips screwdriver', 'Plastic spudger', 'Heat gun or hair dryer', 'Replacement part'].map(
                (tool) => (
                  <View key={tool} style={modal.toolRow}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={modal.toolText}>{tool}</Text>
                  </View>
                )
              )}
            </View>

            {/* Difficulty */}
            <Text style={modal.subheading}>Difficulty</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {['Beginner', 'Intermediate', 'Advanced'].map((level, i) => (
                <Badge
                  key={level}
                  label={level}
                  color={i === 0 ? COLORS.success : i === 1 ? COLORS.warning : COLORS.error}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { marginRight: 2 },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 14 },
  catRow: { marginBottom: SPACING.sm },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catTabActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  catText: { fontSize: 13, color: COLORS.textSub, fontWeight: FONT.medium },
  catTextActive: { color: '#fff', fontWeight: FONT.semibold },
  list: { padding: SPACING.md, paddingTop: SPACING.sm },
  empty: { alignItems: 'center', paddingVertical: SPACING.xl * 2 },
  emptyText: { color: COLORS.muted, marginTop: SPACING.sm, fontSize: 14 },
});

const modal = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: SPACING.md,
    zIndex: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.full,
    padding: 8,
  },
  videoWrapper: { position: 'relative' },
  videoPlaceholder: {
    width: '100%',
    height: 230,
    backgroundColor: '#0a0c14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: { alignItems: 'center', gap: 10 },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapText: { color: COLORS.textSub, fontSize: 14 },
  playingState: { alignItems: 'center', gap: 8 },
  playingText: { color: COLORS.text, fontSize: 16, fontWeight: FONT.semibold },
  playingNote: { color: COLORS.muted, fontSize: 12 },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  durationText: { color: '#fff', fontSize: 12 },
  info: { padding: SPACING.md },
  title: { fontSize: 20, fontWeight: FONT.black, color: COLORS.text, marginBottom: 10, lineHeight: 28 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: SPACING.md },
  metaText: { fontSize: 13, color: COLORS.textSub },
  description: { fontSize: 14, color: COLORS.textSub, lineHeight: 22, marginBottom: SPACING.md },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  subheading: { fontSize: 15, fontWeight: FONT.bold, color: COLORS.text, marginBottom: 10 },
  toolList: { gap: 8, marginBottom: SPACING.md },
  toolRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toolText: { fontSize: 13, color: COLORS.textSub },
});
