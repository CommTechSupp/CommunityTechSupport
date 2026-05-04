// ─── Hiring Screen ────────────────────────────────────────────────────────────
// Browse technicians + edit your own rate/availability as a service provider

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
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { TECHNICIANS } from '../constants/mockData';
import {
  TechnicianCard,
  SectionHeader,
  StarRating,
  StatusDot,
  Badge,
} from '../components/SharedComponents';

// Filter options
const FILTERS = ['All', 'Available', 'Phone', 'Laptop', 'Networking', 'Software'];

export default function HiringScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTech, setSelectedTech] = useState(null);
  const [showMyProfile, setShowMyProfile] = useState(false);

  // User's own provider profile (editable)
  const [myRate, setMyRate] = useState('35');
  const [myAvailability, setMyAvailability] = useState('Weekends, 10am–4pm');
  const [mySkills, setMySkills] = useState('Virus removal, basic setup');
  const [myBio, setMyBio] = useState('CS student offering affordable help to neighbors.');
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter technicians
  const filtered = TECHNICIANS.filter((t) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Available') return t.status === 'available';
    return (
      t.specialty.toLowerCase().includes(activeFilter.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(activeFilter.toLowerCase()))
    );
  });

  const handleSaveProfile = () => {
    if (!myRate || isNaN(Number(myRate))) {
      Alert.alert('Invalid Rate', 'Please enter a valid hourly rate.');
      return;
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <View style={styles.container}>
      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={{ paddingHorizontal: SPACING.md }}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Technician List ────────────────────────────────────────────────── */}
        <SectionHeader title={`${filtered.length} Technicians Found`} />

        {filtered.map((tech) => (
          <TechnicianCard
            key={tech.id}
            tech={tech}
            onPress={() => setSelectedTech(tech)}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={COLORS.muted} />
            <Text style={styles.emptyText}>No technicians match this filter</Text>
          </View>
        )}

        {/* ── Your Provider Profile ──────────────────────────────────────────── */}
        <View style={styles.divider} />
        <SectionHeader title="Your Provider Profile" />
        <Text style={styles.profileNote}>
          Offer your skills to the community. Set your rate and availability below.
        </Text>

        <View style={styles.profileCard}>
          {/* Rate Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Hourly Rate (USD)</Text>
            <View style={styles.rateRow}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.rateInput}
                value={myRate}
                onChangeText={setMyRate}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={COLORS.muted}
                maxLength={4}
              />
              <Text style={styles.perHr}>/hr</Text>
            </View>
          </View>

          {/* Availability Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Availability</Text>
            <TextInput
              style={styles.textInput}
              value={myAvailability}
              onChangeText={setMyAvailability}
              placeholder="e.g. Mon–Fri, 5pm–9pm"
              placeholderTextColor={COLORS.muted}
            />
          </View>

          {/* Skills Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Skills / Specialties</Text>
            <TextInput
              style={styles.textInput}
              value={mySkills}
              onChangeText={setMySkills}
              placeholder="e.g. Screen repair, OS setup"
              placeholderTextColor={COLORS.muted}
            />
          </View>

          {/* Bio Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Short Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={myBio}
              onChangeText={setMyBio}
              placeholder="Tell people a bit about yourself..."
              placeholderTextColor={COLORS.muted}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, profileSaved && styles.saveBtnSuccess]}
            onPress={handleSaveProfile}
            activeOpacity={0.85}
          >
            <Ionicons
              name={profileSaved ? 'checkmark-circle' : 'save-outline'}
              size={18}
              color="#fff"
            />
            <Text style={styles.saveBtnText}>
              {profileSaved ? 'Profile Saved!' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Technician Detail Modal ────────────────────────────────────────── */}
      {selectedTech && (
        <TechDetailModal tech={selectedTech} onClose={() => setSelectedTech(null)} />
      )}
    </View>
  );
}

// ── Technician Detail Modal ────────────────────────────────────────────────────
function TechDetailModal({ tech, onClose }) {
  const [requestSent, setRequestSent] = useState(false);

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modal.container}>
        <TouchableOpacity style={modal.closeBtn} onPress={onClose}>
          <Ionicons name="close" size={22} color={COLORS.text} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={modal.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={modal.header}>
            <View style={modal.avatarBox}>
              <Text style={modal.avatarText}>{tech.name.charAt(0)}</Text>
            </View>
            <Text style={modal.name}>{tech.name}</Text>
            <Text style={modal.specialty}>{tech.specialty}</Text>
            <StatusDot status={tech.status} />
          </View>

          {/* Stats Row */}
          <View style={modal.statsRow}>
            <StatBox label="Rate" value={`$${tech.rate}/hr`} />
            <StatBox label="Rating" value={tech.rating.toFixed(1)} />
            <StatBox label="Reviews" value={tech.reviews} />
            <StatBox label="Distance" value={tech.distance} />
          </View>

          {/* Bio */}
          <Text style={modal.sectionTitle}>About</Text>
          <Text style={modal.bio}>{tech.bio}</Text>

          {/* Skills */}
          <Text style={modal.sectionTitle}>Skills</Text>
          <View style={modal.skillWrap}>
            {tech.skills.map((s) => (
              <Badge key={s} label={s} color={COLORS.accent} />
            ))}
          </View>

          {/* Availability */}
          <Text style={modal.sectionTitle}>Availability</Text>
          <View style={modal.availRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSub} />
            <Text style={modal.availText}>{tech.availability}</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[modal.requestBtn, requestSent && modal.requestBtnSent]}
            onPress={() => setRequestSent(true)}
            disabled={requestSent || tech.status === 'unavailable'}
            activeOpacity={0.85}
          >
            <Ionicons
              name={requestSent ? 'checkmark-circle' : 'chatbubble-outline'}
              size={18}
              color="#fff"
            />
            <Text style={modal.requestBtnText}>
              {requestSent ? 'Request Sent!' : 'Send Hire Request'}
            </Text>
          </TouchableOpacity>

          {tech.status === 'unavailable' && (
            <Text style={modal.unavailNote}>This technician is currently unavailable.</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function StatBox({ label, value }) {
  return (
    <View style={modal.statBox}>
      <Text style={modal.statVal}>{value}</Text>
      <Text style={modal.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  filterRow: { paddingVertical: SPACING.sm },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterText: { fontSize: 13, color: COLORS.textSub, fontWeight: FONT.medium },
  filterTextActive: { color: '#fff', fontWeight: FONT.semibold },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  empty: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyText: { color: COLORS.muted, marginTop: SPACING.sm, fontSize: 14 },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.lg },

  profileNote: { fontSize: 13, color: COLORS.textSub, marginBottom: SPACING.md },
  profileCard: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.md },

  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: FONT.semibold, color: COLORS.textSub },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dollarSign: { fontSize: 22, color: COLORS.accent, fontWeight: FONT.black },
  rateInput: {
    fontSize: 28,
    fontWeight: FONT.black,
    color: COLORS.text,
    minWidth: 60,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    textAlign: 'center',
  },
  perHr: { fontSize: 16, color: COLORS.textSub },
  textInput: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    marginTop: SPACING.xs,
  },
  saveBtnSuccess: { backgroundColor: COLORS.success },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: FONT.bold },
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
  content: { padding: SPACING.md, paddingTop: SPACING.xl + SPACING.md },
  header: { alignItems: 'center', marginBottom: SPACING.lg, gap: 6 },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 32, fontWeight: FONT.black, color: COLORS.accent },
  name: { fontSize: 22, fontWeight: FONT.black, color: COLORS.text },
  specialty: { fontSize: 14, color: COLORS.textSub },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
  statVal: { fontSize: 16, fontWeight: FONT.black, color: COLORS.accent },
  statLabel: { fontSize: 11, color: COLORS.textSub, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: FONT.bold, color: COLORS.text, marginBottom: 8 },
  bio: { fontSize: 14, color: COLORS.textSub, lineHeight: 22, marginBottom: SPACING.md },
  skillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.md },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: SPACING.lg },
  availText: { fontSize: 14, color: COLORS.textSub },
  requestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    marginBottom: SPACING.sm,
  },
  requestBtnSent: { backgroundColor: COLORS.success },
  requestBtnText: { color: '#fff', fontSize: 16, fontWeight: FONT.bold },
  unavailNote: { textAlign: 'center', color: COLORS.muted, fontSize: 13 },
});
