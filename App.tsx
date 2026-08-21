import { useMemo, useState, type ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const theme = {
  bg: '#F4F8F5',
  card: '#FFFFFF',
  primary: '#1D6F5E',
  primaryDark: '#0F4B40',
  accent: '#FFB703',
  mint: '#DDF6EE',
  green: '#2FBF71',
  blue: '#4A90E2',
  orange: '#F39C6B',
  red: '#E56363',
  text: '#16362F',
  secondary: '#5C726C',
  light: '#EAF2F1',
  border: '#DCEAE5',
};

type ReportStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
type HelpType = 'Request Help' | 'Offer Help';

type Activity = {
  id: number;
  title: string;
  meta: string;
  time: string;
  tint: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Report = {
  id: number;
  title: string;
  category: string;
  status: ReportStatus;
  location: string;
  eta: string;
  color: string;
};

type EventItem = {
  id: number;
  title: string;
  time: string;
  location: string;
  attendees: string;
  tag: string;
};

type FeedPost = {
  id: number;
  author: string;
  handle: string;
  body: string;
  likes: number;
  comments: number;
  shares: number;
};

const activities: Activity[] = [
  { id: 1, title: 'Neighborhood cleanup', meta: 'Today · 4:30 PM', time: 'in 2h', tint: '#DDF6EE', icon: 'trash-bin' },
  { id: 2, title: 'Food drive drop-off', meta: 'Community Hub', time: 'today', tint: '#EAF2FF', icon: 'gift' },
  { id: 3, title: 'Youth mentoring', meta: 'Library Hall', time: 'tomorrow', tint: '#FFF3D6', icon: 'school' },
];

const reports: Report[] = [
  { id: 1, title: 'Garbage overflow near market', category: 'Waste', status: 'Submitted', location: '2 min away', eta: 'Need review', color: '#F39C6B' },
  { id: 2, title: 'Broken streetlight', category: 'Safety', status: 'In Progress', location: '5 min away', eta: 'Crew assigned', color: '#4A90E2' },
  { id: 3, title: 'Flooding in alley', category: 'Water', status: 'Under Review', location: '8 min away', eta: 'Monitoring', color: '#FFB703' },
  { id: 4, title: 'Damaged road signage', category: 'Infrastructure', status: 'Resolved', location: '10 min away', eta: 'Fixed', color: '#2FBF71' },
];

const eventItems: EventItem[] = [
  { id: 1, title: 'City cleanup drive', time: 'Sat · 8:00 AM', location: 'River Park', attendees: '124 joined', tag: 'Environment' },
  { id: 2, title: 'Digital skills workshop', time: 'Tue · 5:30 PM', location: 'Learning Center', attendees: '42 joined', tag: 'Education' },
  { id: 3, title: 'Community health fair', time: 'Thu · 10:00 AM', location: 'Town Square', attendees: '87 joined', tag: 'Health' },
];

const feedPosts: FeedPost[] = [
  { id: 1, author: 'Nadia', handle: '@nadia', body: 'Our cleanup team cleared the blocked drain and the neighborhood feels safer already. Thank you, volunteers!', likes: 86, comments: 18, shares: 12 },
  { id: 2, author: 'Local Care', handle: '@localcare', body: 'We have donated 40 food packs this week. Looking for drivers to distribute them across West District.', likes: 64, comments: 11, shares: 9 },
  { id: 3, author: 'Amina', handle: '@amina', body: 'We are organizing a free repair workshop for students. Bring your old devices and tools if you can help!', likes: 71, comments: 20, shares: 7 },
];

const orgs = [
  { id: 1, name: 'Green Future Hub', type: 'NGO', badge: 'Verified', color: '#2FBF71' },
  { id: 2, name: 'Civic Youth Network', type: 'Volunteer Group', badge: 'Verified', color: '#4A90E2' },
  { id: 3, name: 'North Health Center', type: 'Health Service', badge: 'Verified', color: '#F39C6B' },
];

const notifications = [
  { id: 1, title: 'Cleanup event reminder', subtitle: 'Starts in 2 hours · River Park', color: '#2FBF71' },
  { id: 2, title: 'Report update', subtitle: 'Broken streetlight marked in progress', color: '#4A90E2' },
  { id: 3, title: 'New volunteer match', subtitle: 'Food drive needs drivers this weekend', color: '#FFB703' },
];

const statCards = [
  { label: 'Impact score', value: '4,280', icon: 'trophy' },
  { label: 'Reports resolved', value: '32', icon: 'checkmark-circle' },
  { label: 'Volunteer hours', value: '96', icon: 'time' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedReport, setSelectedReport] = useState<Report>(reports[0]);

  const currentView = useMemo(() => {
    const screens: Record<string, ReactNode> = {
      Home: <HomeTab />,
      Map: <MapTab />,
      Community: <CommunityTab />,
      Events: <EventsTab />,
      Profile: <ProfileTab />,
    };
    return screens[activeTab] ?? screens.Home;
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {currentView}
        <View style={styles.fabWrap}>
          <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar}>
          {['Home', 'Map', 'Community', 'Events', 'Profile'].map((tab) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Home: 'home',
              Map: 'map',
              Community: 'people',
              Events: 'calendar',
              Profile: 'person',
            };
            const isSelected = activeTab === tab;
            return (
              <Pressable key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
                <Ionicons name={icons[tab]} size={22} color={isSelected ? theme.primary : '#7D908C'} />
                <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>{tab}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function HomeTab() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Good morning, Maya</Text>
          <Text style={styles.title}>CommunityConnect</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroLabel}>Nearby impact</Text>
          <Text style={styles.heroTitle}>You’re 2.4 km from active community projects</Text>
        </View>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Community Champion</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        {statCards.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as keyof typeof Ionicons.glyphMap} size={18} color={theme.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Nearby activities" action="View all" />
      <View style={styles.cardList}>
        {activities.map((item) => (
          <View key={item.id} style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: item.tint }]}>
              <Ionicons name={item.icon} size={22} color={theme.primaryDark} />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.meta}</Text>
            </View>
            <Text style={styles.timePill}>{item.time}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Recent reports" action="Map view" />
      <View style={styles.reportList}>
        {reports.map((report) => (
          <TouchableOpacity key={report.id} style={styles.reportCard} activeOpacity={0.85}>
            <View style={styles.reportTop}>
              <View>
                <Text style={styles.cardTitle}>{report.title}</Text>
                <Text style={styles.cardMeta}>{report.category} · {report.location}</Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: report.color }]} />
            </View>
            <View style={styles.reportFooter}>
              <Text style={[styles.statusTag, { backgroundColor: `${report.color}22`, color: report.color }]}>{report.status}</Text>
              <Text style={styles.metaText}>{report.eta}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Notifications" action="See all" />
      {notifications.map((item) => (
        <View key={item.id} style={styles.notificationCard}>
          <View style={[styles.notificationDot, { backgroundColor: item.color }]} />
          <View style={styles.notificationText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{item.subtitle}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function MapTab() {
  return (
    <View style={styles.screenMap}>
      <View style={styles.mapHeader}>
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>Nearby</Text></TouchableOpacity>
      </View>
      <View style={styles.mapPanel}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View key={index} style={[styles.mapCell, index % 3 === 0 && styles.mapCellAccent, index % 4 === 0 && styles.mapCellDark]} />
          ))}
        </View>
        <View style={styles.mapPins}>
          <View style={[styles.pin, { backgroundColor: '#2FBF71' }]} />
          <View style={[styles.pin, { backgroundColor: '#4A90E2', top: 90, left: 170 }]} />
          <View style={[styles.pin, { backgroundColor: '#FFB703', top: 180, left: 110 }]} />
          <View style={[styles.pin, { backgroundColor: '#E56363', top: 130, left: 240 }]} />
        </View>
      </View>
      <View style={styles.mapCard}>
        <Text style={styles.cardTitle}>Waste overflow near market</Text>
        <Text style={styles.cardMeta}>Sanjivani Lane · 2 min away</Text>
        <View style={styles.mapCardRow}>
          <Text style={[styles.statusTag, { backgroundColor: '#F39C6B22', color: '#F39C6B' }]}>Waste</Text>
          <TouchableOpacity style={styles.actionButton}><Text style={styles.actionButtonText}>View report</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function CommunityTab() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Community</Text>
      <View style={styles.communityBanner}>
        <Text style={styles.bannerTitle}>What’s happening nearby?</Text>
        <Text style={styles.bannerText}>7 new opportunities, 3 urgent issues, 2 fresh announcements.</Text>
      </View>
      <SectionHeader title="Organizations" action="Directory" />
      {orgs.map((org) => (
        <View key={org.id} style={styles.orgCard}>
          <View style={[styles.orgLogo, { backgroundColor: org.color }]}>
            <Ionicons name="business" size={20} color="#fff" />
          </View>
          <View style={styles.orgMeta}>
            <Text style={styles.cardTitle}>{org.name}</Text>
            <Text style={styles.cardMeta}>{org.type}</Text>
          </View>
          <Text style={[styles.badge, { borderColor: org.color, color: org.color }]}>{org.badge}</Text>
        </View>
      ))}
      <SectionHeader title="Community feed" action="Post" />
      {feedPosts.map((post) => (
        <View key={post.id} style={styles.feedCard}>
          <View style={styles.feedHeader}>
            <View style={styles.avatar} />
            <View style={styles.feedHeaderText}>
              <Text style={styles.cardTitle}>{post.author}</Text>
              <Text style={styles.cardMeta}>{post.handle}</Text>
            </View>
          </View>
          <Text style={styles.feedBody}>{post.body}</Text>
          <View style={styles.feedActions}>
            <Text style={styles.feedAction}><Ionicons name="heart-outline" size={15} /> {post.likes}</Text>
            <Text style={styles.feedAction}><Ionicons name="chatbubble-outline" size={15} /> {post.comments}</Text>
            <Text style={styles.feedAction}><Ionicons name="share-social-outline" size={15} /> {post.shares}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function EventsTab() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Events</Text>
      <View style={styles.eventBanner}>
        <Text style={styles.bannerTitle}>Upcoming community moments</Text>
      </View>
      {eventItems.map((event) => (
        <View key={event.id} style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTag}><Text style={styles.eventTagText}>{event.tag}</Text></View>
            <Text style={styles.cardMeta}>{event.attendees}</Text>
          </View>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardMeta}>{event.time}</Text>
          <Text style={styles.cardMeta}>{event.location}</Text>
          <TouchableOpacity style={styles.joinButton}><Text style={styles.joinButtonText}>Join event</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileTab() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.title}>Maya Johnson</Text>
          <Text style={styles.cardMeta}>Student · Green District</Text>
        </View>
      </View>
      <View style={styles.profileImpactCard}>
        <Text style={styles.heroLabel}>Community Impact Score</Text>
        <Text style={styles.impactValue}>4,280</Text>
        <Text style={styles.cardMeta}>Volunteer history · 12 events · 8 problem reports resolved</Text>
      </View>
      <View style={styles.badgeRow}>
        <Badge label="Community Champion" color="#2FBF71" />
        <Badge label="Local Hero" color="#4A90E2" />
        <Badge label="Volunteer" color="#FFB703" />
      </View>
      <SectionHeader title="Skills" action="Add" />
      <View style={styles.skillRow}>
        <SkillPill label="Mentoring" />
        <SkillPill label="Cleanup" />
        <SkillPill label="Translation" />
        <SkillPill label="Food support" />
      </View>
      <SectionHeader title="Achievements" action="History" />
      <View style={styles.achievementList}>
        <Achievement title="Clean streets initiative" detail="12 volunteers joined" />
        <Achievement title="Water aid campaign" detail="18 families supported" />
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, action }: { title: string; action: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badgeChip, { borderColor: color, backgroundColor: `${color}22` }]}>
      <Text style={[styles.badgeChipText, { color }]}>{label}</Text>
    </View>
  );
}

function SkillPill({ label }: { label: string }) {
  return (
    <View style={styles.skillPill}>
      <Text style={styles.skillPillText}>{label}</Text>
    </View>
  );
}

function Achievement({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.achievementItem}>
      <Ionicons name="trophy-outline" size={22} color={theme.primary} />
      <View style={styles.achievementText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardMeta}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  container: { flex: 1, backgroundColor: theme.bg },
  screen: { flex: 1, backgroundColor: theme.bg },
  screenContent: { paddingHorizontal: 18, paddingBottom: 100, paddingTop: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  eyebrow: { color: theme.secondary, fontSize: 13, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: '800', color: theme.text },
  iconButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  heroCard: { backgroundColor: theme.primary, borderRadius: 24, padding: 18, marginBottom: 18, minHeight: 110, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  heroTextWrap: { maxWidth: 220 },
  heroLabel: { fontSize: 12, color: '#D0ECE5', textTransform: 'uppercase', letterSpacing: 0.7, fontWeight: '700' },
  heroTitle: { marginTop: 10, fontSize: 24, fontWeight: '800', lineHeight: 32, color: '#fff' },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: '#ffffff22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  heroBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  statsRow: { flexDirection: 'row', marginBottom: 18, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: theme.border },
  statValue: { marginTop: 12, fontSize: 20, fontWeight: '800', color: theme.text },
  statLabel: { marginTop: 4, fontSize: 11, color: theme.secondary },
  sectionHeader: { marginTop: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: theme.text },
  sectionAction: { color: theme.primary, fontWeight: '700', fontSize: 12 },
  cardList: { gap: 12 },
  activityCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: theme.border },
  activityIcon: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  activityText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  cardMeta: { marginTop: 4, fontSize: 12, color: theme.secondary },
  timePill: { backgroundColor: theme.light, color: theme.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: '700', overflow: 'hidden' },
  reportList: { gap: 12 },
  reportCard: { backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: theme.border },
  reportTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statusDot: { width: 14, height: 14, borderRadius: 7, marginTop: 4 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusTag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: '700', overflow: 'hidden' },
  metaText: { color: theme.secondary, fontSize: 12, fontWeight: '600' },
  notificationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border },
  notificationDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  notificationText: { flex: 1 },
  tabBar: { position: 'absolute', left: 18, right: 18, bottom: 18, height: 78, backgroundColor: '#fff', borderRadius: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabText: { marginTop: 6, fontSize: 11, color: '#7D908C', fontWeight: '700' },
  tabTextActive: { color: theme.primary },
  fabWrap: { position: 'absolute', right: 26, bottom: 96, zIndex: 10 },
  fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  screenMap: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 110 },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  filterButton: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: theme.border },
  filterText: { color: theme.primary, fontSize: 12, fontWeight: '700' },
  mapPanel: { backgroundColor: '#eaf8f1', borderRadius: 24, overflow: 'hidden', height: 460, position: 'relative' },
  mapGrid: { flexDirection: 'row', flexWrap: 'wrap', height: '100%' },
  mapCell: { width: '20%', height: '16.66%', backgroundColor: '#dfeee8', borderWidth: 0.5, borderColor: '#cfe2d8' },
  mapCellAccent: { backgroundColor: '#d5efe3' },
  mapCellDark: { backgroundColor: '#d2e5db' },
  mapPins: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  pin: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 4, borderColor: '#fff', left: 100, top: 90 },
  mapCard: { marginTop: 16, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: theme.border },
  mapCardRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionButton: { backgroundColor: theme.primary, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  communityBanner: { backgroundColor: '#fff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: theme.border, marginBottom: 14 },
  bannerTitle: { fontSize: 18, fontWeight: '800', color: theme.text },
  bannerText: { marginTop: 8, fontSize: 13, color: theme.secondary },
  orgCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border },
  orgLogo: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orgMeta: { flex: 1 },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 5, fontSize: 10, fontWeight: '700', overflow: 'hidden' },
  feedCard: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border },
  feedHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#dff1eb', marginRight: 12 },
  feedHeaderText: { flex: 1 },
  feedBody: { marginTop: 12, fontSize: 14, lineHeight: 20, color: theme.text },
  feedActions: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  feedAction: { fontSize: 12, color: theme.secondary, fontWeight: '700' },
  eventBanner: { backgroundColor: theme.mint, borderRadius: 18, padding: 18, marginBottom: 14 },
  eventCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  eventTag: { backgroundColor: '#DDF6EE', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  eventTagText: { color: theme.primary, fontSize: 11, fontWeight: '700' },
  joinButton: { backgroundColor: theme.primary, borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginTop: 14 },
  joinButtonText: { color: '#fff', fontWeight: '800' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#d8f0ea', marginRight: 16 },
  profileInfo: { flex: 1 },
  profileImpactCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: theme.border },
  impactValue: { fontSize: 36, fontWeight: '900', color: theme.text, marginTop: 8 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18, marginBottom: 8 },
  badgeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  badgeChipText: { fontSize: 11, fontWeight: '800' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  skillPill: { backgroundColor: '#fff', borderWidth: 1, borderColor: theme.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  skillPillText: { color: theme.text, fontWeight: '700', fontSize: 12 },
  achievementList: { gap: 12 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: theme.border },
  achievementText: { flex: 1, marginLeft: 12 },
});

export default App;
