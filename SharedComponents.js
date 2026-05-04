// ─── Shared UI Components ─────────────────────────────────────────────────────
// Reusable building blocks. Import from any screen.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

// ── Section Header ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={sh.row}>
      <Text style={sh.title}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text style={sh.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  title: { fontSize: 17, fontWeight: FONT.bold, color: COLORS.text },
  action: { fontSize: 13, fontWeight: FONT.semibold, color: COLORS.accent },
});

// ── Star Rating ────────────────────────────────────────────────────────────────
export function StarRating({ rating, size = 13 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={size} color={COLORS.star} />
      <Text style={{ fontSize: size, color: COLORS.star, fontWeight: FONT.semibold }}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}

// ── Badge / Tag ────────────────────────────────────────────────────────────────
export function Badge({ label, color = COLORS.accent, bg }) {
  return (
    <View style={[bd.wrap, { backgroundColor: bg || color + '22' }]}>
      <Text style={[bd.text, { color }]}>{label}</Text>
    </View>
  );
}
const bd = StyleSheet.create({
  wrap: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: RADIUS.full },
  text: { fontSize: 11, fontWeight: FONT.semibold },
});

// ── Availability Dot ───────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  const colorMap = { available: COLORS.success, busy: COLORS.warning, unavailable: COLORS.error };
  const labelMap = { available: 'Available', busy: 'Busy', unavailable: 'Unavailable' };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colorMap[status] }} />
      <Text style={{ fontSize: 12, color: colorMap[status], fontWeight: FONT.medium }}>
        {labelMap[status]}
      </Text>
    </View>
  );
}

// ── Tutorial Card (Horizontal, for Dashboard) ──────────────────────────────────
export function TutorialCardH({ item, onPress }) {
  return (
    <TouchableOpacity style={tc.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: item.thumbnail }} style={tc.thumb} />
      <View style={tc.overlay}>
        <Badge label={item.category} color={COLORS.accent} />
      </View>
      <View style={tc.info}>
        <Text style={tc.title} numberOfLines={2}>{item.title}</Text>
        <View style={tc.meta}>
          <StarRating rating={item.rating} />
          <Text style={tc.dur}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const tc = StyleSheet.create({
  card: { width: 210, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, overflow: 'hidden', marginRight: SPACING.md },
  thumb: { width: '100%', height: 118 },
  overlay: { position: 'absolute', top: 8, left: 8 },
  info: { padding: SPACING.sm },
  title: { fontSize: 13, fontWeight: FONT.semibold, color: COLORS.text, marginBottom: 6 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dur: { fontSize: 12, color: COLORS.textSub },
});

// ── Tutorial Card (Vertical, for Tutorials screen) ─────────────────────────────
export function TutorialCardV({ item, onPress }) {
  return (
    <TouchableOpacity style={tv.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.thumbnail }} style={tv.thumb} />
      {/* Play icon overlay */}
      <View style={tv.playOverlay}>
        <View style={tv.playBtn}>
          <Ionicons name="play" size={18} color="#fff" />
        </View>
      </View>
      <View style={tv.info}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
          <Badge label={item.category} color={COLORS.accent} />
          <Badge label={item.duration} color={COLORS.textSub} />
        </View>
        <Text style={tv.title}>{item.title}</Text>
        <Text style={tv.desc} numberOfLines={2}>{item.description}</Text>
        <View style={tv.footer}>
          <StarRating rating={item.rating} />
          <Text style={tv.author}>by {item.author}</Text>
          <Text style={tv.views}>{(item.views / 1000).toFixed(1)}k views</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const tv = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md },
  thumb: { width: '100%', height: 190 },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 190, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  info: { padding: SPACING.md },
  title: { fontSize: 16, fontWeight: FONT.bold, color: COLORS.text, marginBottom: 6 },
  desc: { fontSize: 13, color: COLORS.textSub, lineHeight: 19, marginBottom: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  author: { fontSize: 12, color: COLORS.textSub, flex: 1 },
  views: { fontSize: 12, color: COLORS.muted },
});

// ── Technician Card ────────────────────────────────────────────────────────────
export function TechnicianCard({ tech, onPress }) {
  return (
    <TouchableOpacity style={tk.card} onPress={onPress} activeOpacity={0.85}>
      <View style={tk.header}>
        <Image source={{ uri: tech.avatar }} style={tk.avatar} />
        <View style={tk.headerInfo}>
          <Text style={tk.name}>{tech.name}</Text>
          <Text style={tk.specialty}>{tech.specialty}</Text>
          <StatusDot status={tech.status} />
        </View>
        <View style={tk.rateBox}>
          <Text style={tk.rate}>${tech.rate}</Text>
          <Text style={tk.rateLabel}>/hr</Text>
        </View>
      </View>
      <View style={tk.skills}>
        {tech.skills.map((s) => (
          <Badge key={s} label={s} color={COLORS.textSub} />
        ))}
      </View>
      <View style={tk.footer}>
        <Ionicons name="time-outline" size={13} color={COLORS.muted} />
        <Text style={tk.avail}>{tech.availability}</Text>
        <StarRating rating={tech.rating} />
        <Text style={tk.reviews}>({tech.reviews})</Text>
      </View>
    </TouchableOpacity>
  );
}
const tk = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.sm },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: SPACING.sm },
  headerInfo: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontWeight: FONT.bold, color: COLORS.text },
  specialty: { fontSize: 13, color: COLORS.textSub, marginBottom: 2 },
  rateBox: { alignItems: 'flex-end' },
  rate: { fontSize: 20, fontWeight: FONT.black, color: COLORS.accent },
  rateLabel: { fontSize: 12, color: COLORS.textSub },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 6, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  avail: { fontSize: 12, color: COLORS.textSub, flex: 1 },
  reviews: { fontSize: 12, color: COLORS.muted },
});

// ── Location / Shop Card ───────────────────────────────────────────────────────
export function ShopCard({ shop }) {
  return (
    <View style={sc.card}>
      <View style={sc.iconBox}>
        <Ionicons name="storefront-outline" size={22} color={COLORS.accent} />
      </View>
      <View style={sc.info}>
        <Text style={sc.name}>{shop.name}</Text>
        <Text style={sc.specialty}>{shop.specialty}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <StarRating rating={shop.rating} />
          <Text style={sc.reviews}>({shop.reviews})</Text>
          <Text style={sc.hours}>{shop.hours}</Text>
        </View>
      </View>
      <View style={sc.distBox}>
        <Ionicons name="navigate-outline" size={14} color={COLORS.accent} />
        <Text style={sc.dist}>{shop.distance}</Text>
      </View>
    </View>
  );
}
const sc = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  iconBox: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.accent + '18', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: FONT.bold, color: COLORS.text },
  specialty: { fontSize: 12, color: COLORS.textSub },
  hours: { fontSize: 11, color: COLORS.success },
  reviews: { fontSize: 12, color: COLORS.muted },
  distBox: { alignItems: 'center', gap: 2 },
  dist: { fontSize: 12, fontWeight: FONT.semibold, color: COLORS.accent },
});

// ── Empty State ────────────────────────────────────────────────────────────────
export function EmptyState({ icon, message }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: SPACING.xl }}>
      <Ionicons name={icon} size={40} color={COLORS.muted} />
      <Text style={{ marginTop: SPACING.sm, color: COLORS.muted, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

// ── Loading Spinner ────────────────────────────────────────────────────────────
export function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg }}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
}
