import { useEffect, useState, type ReactNode } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import {
  addPostComment,
  createCommunityRequest,
  createPost,
  loadEventAttendance,
  loadOrganizationFollows,
  loadPostInteractions,
  setEventAttendance,
  setOrganizationFollow,
  setPostReaction,
  setPostSave,
  sharePost,
} from "./src/lib/community";
import { supabase } from "./src/utils/supabase";
import { loadProfile, saveProfile, signOut } from "./src/lib/profile";

const theme = {
  bg: "#F4F8F5",
  card: "#FFFFFF",
  primary: "#1D6F5E",
  primaryDark: "#0F4B40",
  mint: "#DDF6EE",
  blue: "#4A90E2",
  orange: "#F39C6B",
  red: "#E56363",
  text: "#16362F",
  secondary: "#5C726C",
  border: "#DCEAE5",
};
type Tab = "Home" | "Map" | "Community" | "Events" | "Profile";
type ModalKind =
  | "post"
  | "comment"
  | "report"
  | "help"
  | "offer"
  | "organization"
  | "event"
  | "settings"
  | null;
type PostType =
  | "Announcement"
  | "Success story"
  | "Activity"
  | "Request"
  | "Opportunity"
  | "Helpful information";
type Organization = {
  id: string;
  name: string;
  type: string;
  badge: string;
  color: string;
  description: string;
  contact: string;
  following: boolean;
};
type FeedPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  type: PostType;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
};
type EventItem = {
  id: string;
  title: string;
  time: string;
  location: string;
  attendees: number;
  tag: string;
  description: string;
  joined: boolean;
};

const initialPosts: FeedPost[] = [
  {
    id: "demo-post-1",
    author: "Nadia",
    handle: "@nadia",
    body: "Our cleanup team cleared the blocked drain and the neighborhood feels safer already. Thank you, volunteers!",
    type: "Success story",
    likes: 86,
    comments: 18,
    shares: 12,
    liked: false,
    saved: false,
  },
  {
    id: "demo-post-2",
    author: "Local Care",
    handle: "@localcare",
    body: "We have donated 40 food packs this week. Looking for drivers to distribute them across West District.",
    type: "Opportunity",
    likes: 64,
    comments: 11,
    shares: 9,
    liked: false,
    saved: false,
  },
  {
    id: "demo-post-3",
    author: "Amina",
    handle: "@amina",
    body: "We are organizing a free repair workshop for students. Bring your old devices and tools if you can help!",
    type: "Announcement",
    likes: 71,
    comments: 20,
    shares: 7,
    liked: false,
    saved: false,
  },
];
const initialOrganizations: Organization[] = [
  {
    id: "demo-org-1",
    name: "Green Future Hub",
    type: "NGO",
    badge: "Verified",
    color: "#2FBF71",
    description:
      "A volunteer-led organization creating cleaner, greener neighborhoods through practical local action.",
    contact: "hello@greenfuture.example",
    following: false,
  },
  {
    id: "demo-org-2",
    name: "Civic Youth Network",
    type: "Volunteer Group",
    badge: "Verified",
    color: "#4A90E2",
    description:
      "Young neighbors building skills, friendships, and opportunities to participate in civic life.",
    contact: "connect@civicyouth.example",
    following: false,
  },
  {
    id: "demo-org-3",
    name: "North Health Center",
    type: "Health Service",
    badge: "Verified",
    color: "#F39C6B",
    description:
      "Accessible health education, screenings, and support for families across the district.",
    contact: "care@northhealth.example",
    following: false,
  },
];
const initialEvents: EventItem[] = [
  {
    id: "demo-event-1",
    title: "City cleanup drive",
    time: "Sat · 8:00 AM",
    location: "River Park",
    attendees: 124,
    tag: "Environment",
    description:
      "Spend a morning restoring the riverside with local volunteers. Gloves and supplies are provided.",
    joined: false,
  },
  {
    id: "demo-event-2",
    title: "Digital skills workshop",
    time: "Tue · 5:30 PM",
    location: "Learning Center",
    attendees: 42,
    tag: "Education",
    description:
      "A friendly hands-on session covering online safety, job tools, and everyday digital skills.",
    joined: false,
  },
  {
    id: "demo-event-3",
    title: "Community health fair",
    time: "Thu · 10:00 AM",
    location: "Town Square",
    attendees: 87,
    tag: "Health",
    description:
      "Meet local providers for free screenings, health resources, and family activities.",
    joined: false,
  },
];

export default function InteractiveApp() {
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [modal, setModal] = useState<ModalKind>(null);
  const [selectedOrganization, setSelectedOrganization] =
        useState<Organization | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState(initialPosts);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [events, setEvents] = useState(initialEvents);
  const [draft, setDraft] = useState("");
  const [postType, setPostType] = useState<PostType>("Announcement");
  const [profileName, setProfileName] = useState("Maya Johnson");
  const [profileBio, setProfileBio] = useState("Helping neighbors turn small actions into lasting local impact.");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    void loadProfile()
      .then((profile) => {
        if (mounted && profile?.display_name)
          setProfileName(profile.display_name);
        if (mounted && profile?.bio) setProfileBio(profile.bio);
        if (mounted && profile?.avatar_url) setProfileAvatarUrl(profile.avatar_url);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let mounted = true;
    const loadRemoteData = async () => {
      const [organizationResult, postResult, eventResult] = await Promise.all([
        client
          .from("organizations")
          .select(
            "id, name, organization_type, description, contact_email, verified",
          )
          .eq("verified", true)
          .order("name"),
        client
          .from("posts")
          .select("id, author_id, body, post_type, created_at")
          .order("created_at", { ascending: false })
          .limit(30),
        client
          .from("events")
          .select("id, title, description, category, starts_at, location_name")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at")
          .limit(30),
      ]);
      if (!mounted) return;
      if (!organizationResult.error && organizationResult.data?.length) {
        const mappedOrganizations = organizationResult.data.map(
          (organization, index) => ({
            id: organization.id,
            name: organization.name,
            type: organization.organization_type,
            badge: organization.verified ? "Verified" : "Community",
            color: [theme.primary, theme.blue, theme.orange][index % 3],
            description: organization.description,
            contact:
              organization.contact_email ?? "Contact details unavailable",
            following: false,
          }),
        );
        setOrganizations(mappedOrganizations);
        void loadOrganizationFollows(
          mappedOrganizations.map((organization) => organization.id),
        )
          .then((followed) => {
            if (mounted)
              setOrganizations((current) =>
                current.map((organization) => ({
                  ...organization,
                  following: followed.has(organization.id),
                })),
              );
          })
          .catch(() => undefined);
      }
      if (!postResult.error && postResult.data?.length) {
        const mappedPosts = postResult.data.map((post) => ({
          id: post.id,
          author: "Community member",
          handle: `@${post.author_id.slice(0, 8)}`,
          body: post.body,
          type:
            post.post_type === "success_story"
              ? "Success story"
              : post.post_type === "helpful_information"
                ? "Helpful information"
                : ((post.post_type.charAt(0).toUpperCase() +
                    post.post_type.slice(1)) as PostType),
          likes: 0,
          comments: 0,
          shares: 0,
          liked: false,
          saved: false,
        }));
        setPosts(mappedPosts);
        void loadPostInteractions(mappedPosts.map((post) => post.id))
          .then(({ liked, saved }) => {
            if (mounted)
              setPosts((currentPosts) =>
                currentPosts.map((post) => ({
                  ...post,
                  liked: liked.has(post.id),
                  saved: saved.has(post.id),
                })),
              );
          })
          .catch(() => undefined);
      }
      if (!eventResult.error && eventResult.data?.length) {
        const mappedEvents = eventResult.data.map((event) => ({
          id: event.id,
          title: event.title,
          time: new Date(event.starts_at).toLocaleString(),
          location: event.location_name,
          attendees: 0,
          tag: event.category,
          description: event.description,
          joined: false,
        }));
        setEvents(mappedEvents);
        void loadEventAttendance(mappedEvents.map((event) => event.id))
          .then((joined) => {
            if (mounted)
              setEvents((current) =>
                current.map((event) => ({
                  ...event,
                  joined: joined.has(event.id),
                })),
              );
          })
          .catch(() => undefined);
      }
    };
    void loadRemoteData();
    return () => {
      mounted = false;
    };
  }, []);
  const publishPost = async () => {
    if (!draft.trim()) {
      Alert.alert("Add a message", "Write something before publishing.");
      return;
    }
    const body = draft.trim();
    const post = {
      id: `local-${Date.now()}`,
      author: profileName,
      handle: "@maya",
      body,
      type: postType,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false,
    };
    setPosts([post, ...posts]);
    setDraft("");
    setModal(null);
    setActiveTab("Community");
    try {
      await createPost(body, postType);
    } catch (error) {
      setPosts(posts);
      Alert.alert(
        "Could not publish",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const toggleLike = async (id: string) => {
    const previous = posts;
    const target = posts.find((post) => post.id === id);
    if (!target) return;
    const nextLiked = !target.liked;
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: nextLiked,
              likes: post.likes + (nextLiked ? 1 : -1),
            }
          : post,
      ),
    );
    try {
      await setPostReaction(id, nextLiked);
    } catch (error) {
      setPosts(previous);
      Alert.alert(
        "Could not update like",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const toggleSave = async (id: string) => {
    const previous = posts;
    const target = posts.find((post) => post.id === id);
    if (!target) return;
    const nextSaved = !target.saved;
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, saved: nextSaved } : post,
      ),
    );
    try {
      await setPostSave(id, nextSaved);
    } catch (error) {
      setPosts(previous);
      Alert.alert(
        "Could not update save",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const toggleFollow = async () => {
    if (!selectedOrganization) return;
    const previous = selectedOrganization;
    const updated = {
      ...selectedOrganization,
      following: !selectedOrganization.following,
    };
    setSelectedOrganization(updated);
    setOrganizations(
      organizations.map((org) => (org.id === updated.id ? updated : org)),
    );
    try {
      await setOrganizationFollow(String(updated.id), updated.following);
    } catch (error) {
      setSelectedOrganization(previous);
      setOrganizations(organizations);
      Alert.alert(
        "Could not update follow",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const toggleJoin = async () => {
    if (!selectedEvent) return;
    const previous = selectedEvent;
    const updated = {
      ...selectedEvent,
      joined: !selectedEvent.joined,
      attendees: selectedEvent.attendees + (selectedEvent.joined ? -1 : 1),
    };
    setSelectedEvent(updated);
    setEvents(
      events.map((event) => (event.id === updated.id ? updated : event)),
    );
    try {
      await setEventAttendance(String(updated.id), updated.joined);
    } catch (error) {
      setSelectedEvent(previous);
      setEvents(events);
      Alert.alert(
        "Could not update attendance",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const addComment = async () => {
    if (!commentPostId || !draft.trim()) {
      Alert.alert("Add a comment", "Write a comment before sending.");
      return;
    }
    const previous = posts;
    setPosts(
      posts.map((post) =>
        post.id === commentPostId
          ? { ...post, comments: post.comments + 1 }
          : post,
      ),
    );
    const body = draft.trim();
    setDraft("");
    setModal(null);
    try {
      await addPostComment(commentPostId, body);
    } catch (error) {
      setPosts(previous);
      Alert.alert(
        "Could not add comment",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const share = async (id: string) => {
    const previous = posts;
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
    try {
      await sharePost(id);
      Alert.alert("Shared", "Post link copied to your share sheet.");
    } catch (error) {
      setPosts(previous);
      Alert.alert(
        "Could not share",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };
  const saveSettings = async () => {
    if (!profileName.trim()) {
      Alert.alert("Add a name", "Your display name cannot be empty.");
      return;
    }
    try {
      await saveProfile({ displayName: profileName, bio: profileBio, avatarUrl: profileAvatarUrl ?? undefined });
      setModal(null);
      Alert.alert("Saved", "Your profile settings were updated.");
    } catch (error) {
      Alert.alert("Could not save settings", error instanceof Error ? error.message : "Please try again.");
    }
  };
  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo permission needed", "Allow photo access to choose a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    const selectedAsset = result.assets?.[0];
    if (!result.canceled && selectedAsset) setProfileAvatarUrl(selectedAsset.uri);
  };
  const submitRequest = async (kind: "report" | "help" | "offer") => {
    if (!draft.trim()) {
      Alert.alert("Add details", "Write a few details before submitting.");
      return;
    }
    try {
      await createCommunityRequest(draft.trim(), kind);
      setDraft("");
      setModal(null);
      Alert.alert("Submitted", "Your community update has been recorded.");
    } catch (error) {
      Alert.alert("Could not submit", error instanceof Error ? error.message : "Please try again.");
    }
  };
  const views: Record<Tab, ReactNode> = {
    Home: <HomeTab setActiveTab={setActiveTab} />,
    Map: <MapTab />,
    Community: (
      <CommunityTab
        organizations={organizations}
        posts={posts}
        onOrganization={(org) => {
          setSelectedOrganization(org);
          setModal("organization");
        }}
        onPost={() => setModal("post")}
        onLike={toggleLike}
        onSave={toggleSave}
        onComment={(id) => { setCommentPostId(id); setDraft(""); setModal("comment"); }}
        onShare={share}
      />
    ),
    Events: (
      <EventsTab
        events={events}
        onEvent={(event) => {
          setSelectedEvent(event);
          setModal("event");
        }}
      />
    ),
    Profile: (
      <ProfileTab
        name={profileName}
        bio={profileBio}
        avatarUrl={profileAvatarUrl}
        onPhoto={pickProfilePhoto}
        onSettings={() => setModal("settings")}
      />
    ),
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {views[activeTab]}
        <View style={styles.fabWrap}>
          <TouchableOpacity
            accessibilityLabel="Create a post"
            style={styles.fab}
            onPress={() => setModal("post")}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.tabBar}>
          {(["Home", "Map", "Community", "Events", "Profile"] as Tab[]).map(
            (tab) => {
              const icons: Record<Tab, keyof typeof Ionicons.glyphMap> = {
                Home: "home",
                Map: "map",
                Community: "people",
                Events: "calendar",
                Profile: "person",
              };
              return (
                <Pressable
                  key={tab}
                  style={styles.tabButton}
                  onPress={() => setActiveTab(tab)}
                >
                  <Ionicons
                    name={icons[tab]}
                    size={22}
                    color={activeTab === tab ? theme.primary : "#7D908C"}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>
        <Modal
          visible={modal !== null}
          animationType="slide"
          transparent
          onRequestClose={() => setModal(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modal === "post"
                    ? "Create a post"
                    : modal === "organization"
                      ? selectedOrganization?.name
                      : modal === "event"
                        ? selectedEvent?.title
                        : modal === "settings"
                          ? "Settings"
                          : "Community request"}
                </Text>
                <TouchableOpacity onPress={() => setModal(null)}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              {modal === "post" && (
                <PostComposer
                  draft={draft}
                  setDraft={setDraft}
                  postType={postType}
                  setPostType={setPostType}
                  publishPost={publishPost}
                />
              )}
              {modal === "organization" && selectedOrganization && (
                <>
                  <Detail
                    title={
                      selectedOrganization.type +
                      " · " +
                      selectedOrganization.badge
                    }
                    body={selectedOrganization.description}
                    action={
                      selectedOrganization.following
                        ? "Following"
                        : "Follow organization"
                    }
                    onAction={toggleFollow}
                    icon="business"
                  />
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => void Linking.openURL(`mailto:${selectedOrganization.contact}`)}
                  >
                    <Ionicons name="mail-outline" size={18} color={theme.primary} />
                    <Text style={styles.contactButtonText}>{selectedOrganization.contact}</Text>
                  </TouchableOpacity>
                </>
              )}
              {modal === "event" && selectedEvent && (
                <Detail
                  title={
                    selectedEvent.tag +
                    " · " +
                    selectedEvent.attendees +
                    " joined"
                  }
                  body={
                    selectedEvent.description +
                    "\n\n" +
                    selectedEvent.time +
                    " · " +
                    selectedEvent.location
                  }
                  action={selectedEvent.joined ? "Leave event" : "Join event"}
                  onAction={toggleJoin}
                  icon="calendar"
                />
              )}
              {modal === "settings" && (
                <>
                  <Text style={styles.fieldLabel}>Display name</Text>
                  <TextInput
                    value={profileName}
                    onChangeText={setProfileName}
                    style={styles.input}
                  />
                  <Text style={[styles.fieldLabel, styles.bioLabel]}>Bio</Text>
                  <TextInput
                    multiline
                    maxLength={500}
                    value={profileBio}
                    onChangeText={setProfileBio}
                    placeholder="Tell your community a little about yourself..."
                    placeholderTextColor={theme.secondary}
                    style={[styles.input, styles.bioInput]}
                  />
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => void pickProfilePhoto()}>
                    <Text style={styles.secondaryButtonText}>Choose profile photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={saveSettings}
                  >
                    <Text style={styles.primaryButtonText}>Save settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => void signOut().catch((error) => Alert.alert("Could not sign out", error instanceof Error ? error.message : "Please try again."))}
                  >
                    <Text style={styles.secondaryButtonText}>Sign out</Text>
                  </TouchableOpacity>
                </>
              )}
              {(modal === "report" ||
                modal === "help" ||
                modal === "offer") && (
                <RequestForm
                  kind={modal}
                  draft={draft}
                  setDraft={setDraft}
                  onSubmit={() => void submitRequest(modal)}
                />
              )}
              {modal === "comment" && (
                <CommentComposer draft={draft} setDraft={setDraft} onSubmit={addComment} />
              )}
              {modal !== "organization" &&
                modal !== "event" &&
                modal !== "settings" && (
                  <View style={styles.quickActions}>
                    {(["report", "help", "offer"] as const).map((kind) => (
                      <TouchableOpacity
                        key={kind}
                        onPress={() => setModal(kind)}
                      >
                        <Text style={styles.quickActionText}>
                          {kind === "report"
                            ? "Report"
                            : kind === "help"
                              ? "Ask for help"
                              : "Offer help"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
function HomeTab({ setActiveTab }: { setActiveTab: (tab: Tab) => void }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
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
        <Text style={styles.heroLabel}>Nearby impact</Text>
        <Text style={styles.heroTitle}>
          You’re 2.4 km from active community projects
        </Text>
        <Text style={styles.heroBadgeText}>Community Champion</Text>
      </View>
      <View style={styles.statsRow}>
        {[
          ["trophy", "4,280", "Impact score"],
          ["checkmark-circle", "32", "Reports resolved"],
          ["time", "96", "Volunteer hours"],
        ].map(([icon, value, label]) => (
          <View key={label} style={styles.statCard}>
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={18}
              color={theme.primary}
            />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
      <SectionHeader title="Nearby activities" />
      <View style={styles.activityCard}>
        <Text style={styles.cardTitle}>
          Neighborhood cleanup · Today · 4:30 PM
        </Text>
      </View>
      <View style={styles.activityCard}>
        <Text style={styles.cardTitle}>
          Food drive drop-off · Community Hub
        </Text>
      </View>
      <SectionHeader title="Explore" />
      <TouchableOpacity
        style={styles.exploreCard}
        onPress={() => setActiveTab("Community")}
      >
        <Text style={styles.cardTitle}>
          Find organizations and community stories
        </Text>
        <Ionicons name="arrow-forward" size={20} color={theme.primary} />
      </TouchableOpacity>
    </ScrollView>
  );
}
function MapTab() {
  const [locationStatus, setLocationStatus] = useState<"loading" | "ready" | "denied" | "unavailable">("loading");

  const requestLocation = async () => {
    setLocationStatus("loading");
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        setLocationStatus("denied");
        return;
      }
      await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocationStatus("ready");
    } catch {
      setLocationStatus("unavailable");
    }
  };

  useEffect(() => {
    void requestLocation();
  }, []);

  return (
    <View style={styles.screenMap}>
      <View style={styles.mapHeader}>
        <Text style={styles.title}>Map</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Nearby</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapPanel}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View
              key={index}
              style={[styles.mapCell, index % 3 === 0 && styles.mapCellAccent]}
            />
          ))}
        </View>
        <View style={styles.mapPins}>
          {[
            [100, 90, "#2FBF71"],
            [170, 180, "#4A90E2"],
            [110, 270, "#FFB703"],
            [240, 140, "#E56363"],
          ].map(([left, top, color]) => (
            <View
              key={`${left}-${top}`}
              style={[
                styles.pin,
                {
                  backgroundColor: color as string,
                  left: left as number,
                  top: top as number,
                },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.mapCard}>
        <Text style={styles.cardTitle}>Community activity nearby</Text>
        <Text style={styles.cardMeta}>
          Organizations, events, and help requests will appear here.
        </Text>
        <Text style={styles.locationStatus}>
          {locationStatus === "loading"
            ? "Checking your approximate location..."
            : locationStatus === "ready"
              ? "Location enabled for nearby results"
              : locationStatus === "denied"
                ? "Location permission is off"
                : "Location is unavailable on this device"}
        </Text>
        {locationStatus !== "ready" && locationStatus !== "loading" && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => void requestLocation()}>
            <Text style={styles.secondaryButtonText}>Try location again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
function CommunityTab({
  organizations,
  posts,
  onOrganization,
  onPost,
  onLike,
  onSave,
  onComment,
  onShare,
}: {
  organizations: Organization[];
  posts: FeedPost[];
  onOrganization: (org: Organization) => void;
  onPost: () => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity style={styles.smallButton} onPress={onPost}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.smallButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.communityBanner}>
        <Text style={styles.bannerTitle}>What’s happening nearby?</Text>
        <Text style={styles.bannerText}>
          Discover local organizations, opportunities, and neighbor updates.
        </Text>
      </View>
      <SectionHeader title="Organizations" />
      {organizations.map((org) => (
        <TouchableOpacity
          key={org.id}
          style={styles.orgCard}
          onPress={() => onOrganization(org)}
        >
          <View style={[styles.orgLogo, { backgroundColor: org.color }]}>
            <Ionicons name="business" size={20} color="#fff" />
          </View>
          <View style={styles.orgMeta}>
            <Text style={styles.cardTitle}>{org.name}</Text>
            <Text style={styles.cardMeta}>{org.type}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.secondary} />
        </TouchableOpacity>
      ))}
      <SectionHeader title="Community feed" />
      {posts.map((post) => (
        <View key={post.id} style={styles.feedCard}>
          <View style={styles.feedHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.author[0]}</Text>
            </View>
            <View style={styles.feedHeaderText}>
              <Text style={styles.cardTitle}>{post.author}</Text>
              <Text style={styles.cardMeta}>
                {post.handle} · {post.type}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityLabel="Save post"
              onPress={() => onSave(post.id)}
            >
              <Ionicons
                name={post.saved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={post.saved ? theme.primary : theme.secondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.feedBody}>{post.body}</Text>
          <View style={styles.feedActions}>
            <TouchableOpacity onPress={() => onLike(post.id)}>
              <Text style={[styles.feedAction, post.liked && styles.liked]}>
                <Ionicons
                  name={post.liked ? "heart" : "heart-outline"}
                  size={16}
                />{" "}
                {post.likes}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onComment(post.id)}
            >
              <Text style={styles.feedAction}>
                <Ionicons name="chatbubble-outline" size={15} /> {post.comments}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onShare(post.id)}
            >
              <Text style={styles.feedAction}>
                <Ionicons name="share-social-outline" size={15} /> {post.shares}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
function EventsTab({
  events,
  onEvent,
}: {
  events: EventItem[];
  onEvent: (event: EventItem) => void;
}) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>Events</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Upcoming</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.eventBanner}>
        <Text style={styles.bannerTitle}>Upcoming community moments</Text>
        <Text style={styles.bannerText}>
          Join a local activity and make an impact together.
        </Text>
      </View>
      {events.map((event) => (
        <TouchableOpacity
          key={event.id}
          style={styles.eventCard}
          onPress={() => onEvent(event)}
        >
          <View style={styles.eventHeader}>
            <View style={styles.eventTag}>
              <Text style={styles.eventTagText}>{event.tag}</Text>
            </View>
            <Text style={styles.cardMeta}>{event.attendees} joined</Text>
          </View>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardMeta}>
            {event.time} · {event.location}
          </Text>
          <Text style={styles.eventLink}>
            {event.joined ? "Joined · View details" : "View details and join"}{" "}
            <Ionicons name="arrow-forward" size={14} />
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
function ProfileTab({
  name,
  bio,
  avatarUrl,
  onPhoto,
  onSettings,
}: {
  name: string;
  bio: string;
  avatarUrl: string | null;
  onPhoto: () => void;
  onSettings: () => void;
}) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
    >
      <View style={styles.headerRow}>
        <View style={styles.profileHeader}>
          <TouchableOpacity accessibilityLabel="Change profile photo" style={styles.profileAvatar} onPress={onPhoto}>
            {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.profileImage} /> : <Text style={styles.profileInitial}>{name[0]}</Text>}
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.cardMeta}>Student · Green District</Text>
            <Text style={styles.profileBio}>{bio}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={onSettings}>
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileImpactCard}>
        <Text style={styles.heroLabel}>Community Impact Score</Text>
        <Text style={styles.impactValue}>4,280</Text>
        <Text style={styles.cardMeta}>
          Volunteer history · 12 events · 8 problem reports resolved
        </Text>
      </View>
      <View style={styles.badgeRow}>
        <Badge label="Community Champion" color="#2FBF71" />
        <Badge label="Local Hero" color="#4A90E2" />
        <Badge label="Volunteer" color="#FFB703" />
      </View>
      <SectionHeader title="My activity" />
      <View style={styles.profileMenu}>
        <Text style={styles.cardTitle}>My posts</Text>
        <Text style={styles.cardMeta}>Your community updates</Text>
      </View>
      <View style={styles.profileMenu}>
        <Text style={styles.cardTitle}>My events</Text>
        <Text style={styles.cardMeta}>Events you have joined</Text>
      </View>
      <SectionHeader title="Achievements" />
      <Achievement
        title="Clean streets initiative"
        detail="12 volunteers joined"
      />
      <Achievement title="Water aid campaign" detail="18 families supported" />
    </ScrollView>
  );
}
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View
      style={[
        styles.badgeChip,
        { borderColor: color, backgroundColor: `${color}22` },
      ]}
    >
      <Text style={[styles.badgeChipText, { color }]}>{label}</Text>
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
function PostComposer({
  draft,
  setDraft,
  postType,
  setPostType,
  publishPost,
}: {
  draft: string;
  setDraft: (value: string) => void;
  postType: PostType;
  setPostType: (value: PostType) => void;
  publishPost: () => void;
}) {
  return (
    <>
      <Text style={styles.fieldLabel}>Post type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeScroll}
      >
        {(
          [
            "Announcement",
            "Success story",
            "Activity",
            "Request",
            "Opportunity",
            "Helpful information",
          ] as PostType[]
        ).map((type) => (
          <Pressable
            key={type}
            onPress={() => setPostType(type)}
            style={[
              styles.typeChip,
              postType === type && styles.typeChipActive,
            ]}
          >
            <Text
              style={[
                styles.typeChipText,
                postType === type && styles.typeChipTextActive,
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <TextInput
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="Share something useful with your community..."
        placeholderTextColor={theme.secondary}
        style={[styles.input, styles.messageInput]}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={publishPost}>
        <Text style={styles.primaryButtonText}>Publish post</Text>
      </TouchableOpacity>
    </>
  );
}

function CommentComposer({
  draft,
  setDraft,
  onSubmit,
}: {
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <>
      <Text style={styles.detailBody}>Add a thoughtful response to this post.</Text>
      <TextInput
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="Write a comment..."
        placeholderTextColor={theme.secondary}
        style={[styles.input, styles.messageInput]}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>Add comment</Text>
      </TouchableOpacity>
    </>
  );
}

function Detail({
  title,
  body,
  action,
  onAction,
  icon,
}: {
  title: string;
  body: string;
  action: string;
  onAction: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={28} color={theme.primary} />
      </View>
      <Text style={styles.detailType}>{title}</Text>
      <Text style={styles.detailBody}>{body}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onAction}>
        <Text style={styles.primaryButtonText}>{action}</Text>
      </TouchableOpacity>
    </>
  );
}
function RequestForm({
  kind,
  draft,
  setDraft,
  onSubmit,
}: {
  kind: "report" | "help" | "offer";
  draft: string;
  setDraft: (value: string) => void;
  onSubmit: () => void;
}) {
  const labels = {
    report: "Tell us what needs attention in your neighborhood.",
    help: "Describe the help you need from nearby neighbors.",
    offer: "Share what kind of help you can offer.",
  };
  return (
    <>
      <Text style={styles.detailBody}>{labels[kind]}</Text>
      <TextInput
        multiline
        value={draft}
        onChangeText={setDraft}
        placeholder="Write the details here..."
        placeholderTextColor={theme.secondary}
        style={[styles.input, styles.messageInput]}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>Submit</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.bg },
  container: { flex: 1, backgroundColor: theme.bg },
  screen: { flex: 1, backgroundColor: theme.bg },
  screenContent: { paddingHorizontal: 18, paddingBottom: 110, paddingTop: 18 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  eyebrow: { color: theme.secondary, fontSize: 13, fontWeight: "600" },
  title: { fontSize: 30, fontWeight: "800", color: theme.text },
  cardTitle: { fontSize: 16, fontWeight: "700", color: theme.text },
  cardMeta: { marginTop: 4, fontSize: 12, color: theme.secondary },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.border,
  },
  heroCard: {
    backgroundColor: theme.primary,
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    minHeight: 140,
    justifyContent: "space-between",
  },
  heroLabel: {
    fontSize: 12,
    color: "#D0ECE5",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  heroTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 32,
    color: "#fff",
    maxWidth: 290,
  },
  heroBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  statsRow: { flexDirection: "row", marginBottom: 18, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statValue: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "800",
    color: theme.text,
  },
  statLabel: { marginTop: 4, fontSize: 11, color: theme.secondary },
  sectionHeader: { marginTop: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: theme.text },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  exploreCard: {
    backgroundColor: theme.mint,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabBar: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 18,
    height: 78,
    backgroundColor: "#fff",
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 8,
  },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabText: { marginTop: 6, fontSize: 11, color: "#7D908C", fontWeight: "700" },
  tabTextActive: { color: theme.primary },
  fabWrap: { position: "absolute", right: 26, bottom: 96, zIndex: 10 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  screenMap: { flex: 1, padding: 18, paddingBottom: 110 },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  filterText: { color: theme.primary, fontSize: 12, fontWeight: "700" },
  mapPanel: {
    backgroundColor: "#eaf8f1",
    borderRadius: 24,
    overflow: "hidden",
    height: 460,
    position: "relative",
  },
  mapGrid: { flexDirection: "row", flexWrap: "wrap", height: "100%" },
  mapCell: {
    width: "20%",
    height: "16.66%",
    backgroundColor: "#dfeee8",
    borderWidth: 0.5,
    borderColor: "#cfe2d8",
  },
  mapCellAccent: { backgroundColor: "#d5efe3" },
  mapPins: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  pin: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#fff",
  },
  mapCard: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  communityBanner: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 14,
  },
  bannerTitle: { fontSize: 18, fontWeight: "800", color: theme.text },
  bannerText: { marginTop: 8, fontSize: 13, color: theme.secondary },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  smallButtonText: { color: "#fff", fontWeight: "800" },
  orgCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  orgLogo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  orgMeta: { flex: 1 },
  feedCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  feedHeader: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#dff1eb",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: theme.primary },
  feedHeaderText: { flex: 1 },
  feedBody: { marginTop: 12, fontSize: 14, lineHeight: 20, color: theme.text },
  feedActions: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feedAction: { fontSize: 12, color: theme.secondary, fontWeight: "700" },
  liked: { color: theme.red },
  eventBanner: {
    backgroundColor: theme.mint,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventTag: {
    backgroundColor: theme.mint,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eventTagText: { color: theme.primary, fontSize: 11, fontWeight: "700" },
  eventLink: { color: theme.primary, fontWeight: "800", marginTop: 14 },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#d8f0ea",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: { width: "100%", height: "100%", borderRadius: 36 },
  profileInitial: { fontSize: 28, fontWeight: "800", color: theme.primary },
  profileImpactCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.border,
  },
  impactValue: {
    fontSize: 36,
    fontWeight: "900",
    color: theme.text,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
    marginBottom: 8,
  },
  badgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeChipText: { fontSize: 11, fontWeight: "800" },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 12,
  },
  achievementText: { flex: 1, marginLeft: 12 },
  profileMenu: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#16362f66",
  },
  modalCard: {
    backgroundColor: theme.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  modalTitle: { fontSize: 24, fontWeight: "800", color: theme.text, flex: 1 },
  detailIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.mint,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailType: { color: theme.primary, fontWeight: "800", marginBottom: 14 },
  detailBody: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "800" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: { color: theme.primary, fontWeight: "800" },
  bioLabel: { marginTop: 14 },
  bioInput: { minHeight: 86, textAlignVertical: "top" },
  profileBio: { color: theme.secondary, fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 220 },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  contactButtonText: { color: theme.primary, fontWeight: "700", flex: 1 },
  locationStatus: {
    color: theme.secondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },
  fieldLabel: {
    color: theme.secondary,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
  },
  typeScroll: { marginBottom: 14 },
  typeChip: {
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  typeChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  typeChipText: { color: theme.secondary, fontSize: 12, fontWeight: "700" },
  typeChipTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
    padding: 13,
    color: theme.text,
    fontSize: 15,
  },
  messageInput: { minHeight: 110, textAlignVertical: "top" },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  quickActionText: { color: theme.primary, fontWeight: "800", fontSize: 12 },
});
