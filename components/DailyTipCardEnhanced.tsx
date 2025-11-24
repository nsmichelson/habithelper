import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { savePersonalizationData, setPendingPersonalizationData } from '@/store/slices/dailyTipSlice';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SimplifiedTip } from '../types/simplifiedTip';
import PersonalizationCard from './PersonalizationCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;

// --- 1. Theme Palettes ---
const THEMES = {
  green: {
    primary: '#2E7D32',
    primaryLight: '#4CAF50',
    primaryLighter: '#81C784',
    primaryLightest: '#E8F5E9',
  },
  orange: {
    primary: '#D84315',
    primaryLight: '#FF6B35',
    primaryLighter: '#FF8A65',
    primaryLightest: '#FFF3E0',
  },
  gold: {
    primary: '#F57C00',
    primaryLight: '#FFB300',
    primaryLighter: '#FFD54F',
    primaryLightest: '#FFF8E1',
  },
  pink: {
    primary: '#C2185B',
    primaryLight: '#EC407A',
    primaryLighter: '#F48FB1',
    primaryLightest: '#FCE4EC',
  },
  indigo: {
    primary: '#3949AB',
    primaryLight: '#5C6BC0',
    primaryLighter: '#7986CB',
    primaryLightest: '#E8EAF6',
  },
  turquoise: {
    primary: '#00838F',
    primaryLight: '#26C6DA',
    primaryLighter: '#4DD0E1',
    primaryLightest: '#E0F7FA',
  },
  violet: {
    primary: '#8E24AA',
    primaryLight: '#BA68C8',
    primaryLighter: '#CE93D8',
    primaryLightest: '#F3E5F5',
  },
};

const THEME_KEYS = Object.keys(THEMES) as (keyof typeof THEMES)[];

const NEUTRALS = {
  gray900: '#1A1A1A',
  gray700: '#4A4A4A',
  gray500: '#767676',
  gray300: '#B8B8B8',
  gray100: '#F5F5F5',
  white: '#FFFFFF',
};

interface Props {
  tip: SimplifiedTip;
  onResponse: (response: 'try_it' | 'maybe_later') => void;
  onNotForMe: () => void;
  reasons?: string[];
  userGoals?: string[];
  rejectionInfo?: {
    feedback: 'not_for_me';
    reason?: string;
  };
  maybeLaterInfo?: {
    feedback: 'maybe_later';
    savedAt?: Date | string;
  };
  onSavePersonalization?: (data: any) => void;
  savedPersonalizationData?: any;
  /**
   * If true, hides the top "Habit Helper" header and Theme Switcher.
   * Defaults to true to avoid double headers in main screens.
   */
  hideHeader?: boolean;
  /**
   * If true, selects a random theme color when the component first renders.
   * Defaults to true.
   */
  randomizeThemeOnLoad?: boolean;
}

export default function DailyTipCardEnhanced({
  tip,
  onResponse,
  onNotForMe,
  reasons = [],
  userGoals = [],
  rejectionInfo,
  maybeLaterInfo,
  onSavePersonalization,
  savedPersonalizationData,
  hideHeader = true,
  randomizeThemeOnLoad = true // <--- New Prop Default
}: Props) {

  // Get safe area insets for proper button positioning
  const insets = useSafeAreaInsets();

  // --- Theme State ---
  // Initialize state with a random key if the prop is true
  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>(() => {
    if (randomizeThemeOnLoad) {
      const randomIndex = Math.floor(Math.random() * THEME_KEYS.length);
      return THEME_KEYS[randomIndex];
    }
    return 'green';
  });

  // Derived theme object
  const theme = useMemo(() => ({
    ...THEMES[themeKey],
    ...NEUTRALS
  }), [themeKey]);

  const cycleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setThemeKey(current => {
      const currentIndex = THEME_KEYS.indexOf(current);
      const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
      return THEME_KEYS[nextIndex];
    });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const personalizationScrollRef = useRef<ScrollView>(null);
  
  const dispatch = useAppDispatch();
  const pendingPersonalizationData = useAppSelector(state => state.dailyTip.pendingPersonalizationData);
  const reduxSavedData = useAppSelector(state => state.dailyTip.savedPersonalizationData);

  // Reset to first page when tip changes
  useEffect(() => {
    setCurrentPage(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: false });
  }, [tip.tip_id]);

  // --- Parsing Logic ---
  const parseDetailsContent = () => {
    const content = tip.details_md || '';
    const sections: { experiment?: string; whyItWorks?: string; howToTry?: string } = {};
    const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
    if (experimentMatch) sections.experiment = experimentMatch[1].trim();
    const whyMatch = content.match(/\*\*Why it Works:\*\*(.+?)(?=\*\*How to|$)/s);
    if (whyMatch) sections.whyItWorks = whyMatch[1].trim();
    const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
    if (howMatch) sections.howToTry = howMatch[1].trim();
    return sections;
  };
  
  const detailsSections = parseDetailsContent();
  const relevantGoals = userGoals.filter(userGoal => tip.goals?.includes(userGoal));
  const shouldShowPersonalization = !!tip.personalization_prompt;

  // --- Handlers ---

  const handleResponse = async (response: 'try_it' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (response === 'try_it' && pendingPersonalizationData) {
      dispatch(savePersonalizationData(pendingPersonalizationData));
      if (onSavePersonalization) {
        try {
          await onSavePersonalization(pendingPersonalizationData);
        } catch (error) {
          console.error('Error saving personalization data:', error);
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    onResponse(response);
  };
  
  const handleNotForMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNotForMe();
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const scrollToPage = (index: number) => {
    if (index >= 0 && index < pages.length) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentPage(index);
    }
  };

  // --- Helper Components ---

  const CardVisualHeader = ({ title, subtitle, icon }: any) => (
    <View style={styles.cardVisual}>
      {/* Background decoration circles */}
      <View style={styles.decoCircleBig} />
      <View style={styles.decoCircleSmall} />

      <View style={styles.timeDifficultyContainer}>
        <View style={styles.visualBadge}>
          <Ionicons name="time-outline" size={14} color={theme.primary} />
          <Text style={[styles.visualBadgeText, { color: theme.primary }]}>{tip.time ? tip.time.replace('_', ' ') : '5 min'}</Text>
        </View>
        <View style={styles.visualBadge}>
          <Text style={[styles.visualBadgeText, { color: theme.primary }]}>{tip.difficulty ? `Level ${tip.difficulty}` : 'Easy'}</Text>
        </View>
      </View>

      <Ionicons name={icon} size={56} color="white" style={styles.visualIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );

  // --- Render Methods ---

  const renderSummaryCard = () => {
    const summaryImage = tip.media?.pages?.summary || tip.media?.cover;

    // Debug logging
    console.log('=== IMAGE DEBUG ===');
    console.log('Tip ID:', tip.tip_id);
    console.log('Tip Summary:', tip.summary);
    console.log('Has media object?', !!tip.media);
    console.log('Media object:', tip.media);
    console.log('Summary image:', summaryImage);
    console.log('Image URL:', summaryImage?.url);
    console.log('===================');

    return (
      <View style={styles.pageContainer}>
        <View style={styles.mainCard}>
          {summaryImage ? (
            // Show clean image without text overlay
            <View style={styles.imageContainer}>
              <Image
                source={typeof summaryImage.url === 'string' ? { uri: summaryImage.url } : summaryImage.url}
                style={styles.coverImage}
                resizeMode="cover"
                accessibilityLabel={summaryImage.alt_text}
                // Performance optimizations
                fadeDuration={0} // Disable fade-in animation for instant display
              />
            </View>
          ) : (
            // Original gradient header when no image
            <LinearGradient
              colors={[theme.primary, theme.primaryLight]}
              style={styles.cardVisualGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CardVisualHeader
                title={tip.summary}
                subtitle="Today's Idea to Try"
                icon="bulb-outline"
              />
            </LinearGradient>
          )}

          <ScrollView style={[styles.cardContent, { backgroundColor: theme.primaryLightest }]} showsVerticalScrollIndicator={false}>
            <View style={styles.textContentContainer}>
              {/* Show title and subtitle for image version */}
              {summaryImage && (
                <>
                  <Text style={[styles.contentTitle, { color: theme.gray900 }]}>{tip.summary}</Text>
                  <Text style={[styles.contentSubtitle, { color: theme.primary }]}>Today's Idea to Try</Text>
                </>
              )}
              {/* Show description for both image and gradient versions */}
              {tip.short_description && (
                <Text style={[styles.contentDescription, { color: theme.gray700 }]}>
                  {tip.short_description}
                </Text>
              )}
            </View>
          </ScrollView>
      </View>
    </View>
    );
  };

  const renderGoalsCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="Goals" subtitle="Why this matters" icon="trophy-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Targeted Goals</Text>
          <View style={styles.tagContainer}>
             {[...new Set(tip.goals || [])].map((goal, index) => {
                const isUserGoal = relevantGoals.includes(goal);
                return (
                  <View key={index} style={[
                    styles.tag, 
                    isUserGoal && { backgroundColor: theme.primaryLightest, borderColor: theme.primaryLight, borderWidth: 1 }
                  ]}>
                    {isUserGoal && <Ionicons name="checkmark-circle" size={16} color={theme.primary} />}
                    <Text style={[
                      styles.tagText, 
                      isUserGoal && { color: theme.primary, fontWeight: '600' }
                    ]}>
                      {goal.replace(/_/g, ' ')}
                    </Text>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderBenefitsCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="The Science" subtitle="Why it works" icon="school-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
          {detailsSections.whyItWorks ? (
             <Text style={styles.bodyText}>{detailsSections.whyItWorks}</Text>
          ) : (
            <Text style={styles.bodyText}>This habit uses psychology to improve your daily routine.</Text>
          )}
          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Mechanisms</Text>
          <View style={styles.tagContainer}>
            {(tip.mechanisms || []).map((m, i) => (
              <View key={i} style={styles.tag}>
                 <Text style={styles.tagText}>{m.replace(/_/g, ' ')}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderHowToCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="How To" subtitle="Step by Step" icon="list-outline" />
        </LinearGradient>
        <ScrollView style={styles.cardContent} showsVerticalScrollIndicator={false}>
           {detailsSections.howToTry ? (
            <View>
              {detailsSections.howToTry.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
                return (
                  <View key={index} style={styles.bulletRow}>
                    {isBullet && <Text style={[styles.bulletDot, { color: theme.primary }]}>•</Text>}
                    <Text style={styles.bodyText}>{line.replace(/^[•-]\s*/, '').trim()}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.bodyText}>{detailsSections.experiment || tip.details_md}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );

  const renderPersonalizationCard = () => (
    <View style={styles.pageContainer}>
      <View style={styles.mainCard}>
        <LinearGradient colors={[theme.primary, theme.primaryLight]} style={styles.cardVisualGradient}>
          <CardVisualHeader title="Your Plan" subtitle="Customize It" icon="create-outline" />
        </LinearGradient>
        <ScrollView
          ref={personalizationScrollRef}
          style={[styles.cardContent, { paddingHorizontal: 0, flex: 1 }]}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
           <PersonalizationCard
              tip={tip}
              savedData={savedPersonalizationData || reduxSavedData}
              onSave={async (data) => {
                dispatch(savePersonalizationData(data));
                if (onSavePersonalization) await onSavePersonalization(data);
              }}
              onDataChange={(data) => dispatch(setPendingPersonalizationData(data))}
              showHeader={false}
              style={{ paddingHorizontal: 24 }}
              theme={theme}
              scrollViewRef={personalizationScrollRef}
           />
        </ScrollView>
      </View>
    </View>
  );

  // --- Navigation Setup ---

  const pages = [
    { key: 'summary', title: 'Summary', icon: 'flash', render: renderSummaryCard },
    { key: 'goals', title: 'Goals', icon: 'trophy', render: renderGoalsCard },
    { key: 'benefits', title: 'Why', icon: 'school', render: renderBenefitsCard },
    { key: 'howto', title: 'How To', icon: 'list', render: renderHowToCard },
    ...(shouldShowPersonalization ? [{ key: 'personalize', title: 'Plan', icon: 'create', render: renderPersonalizationCard }] : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      
      {/* 1. Header Title & Theme Switcher - CONDITIONALLY RENDERED */}
      {!hideHeader && (
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: theme.primary }]}>Habit Helper</Text>
          
          <TouchableOpacity 
            style={styles.themeSwitcher} 
            onPress={cycleTheme}
            activeOpacity={0.7}
          >
             <LinearGradient
              colors={[theme.primaryLight, theme.primary]}
              style={styles.themeSwitcherGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
             >
              <Ionicons name="options" size={18} color="#FFF" />
             </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. Story Progress Bar */}
      <View style={styles.storiesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {pages.map((page, index) => {
            const isActive = index === currentPage;
            const isCompleted = index < currentPage;
            
            return (
              <TouchableOpacity 
                key={page.key} 
                style={styles.storyItem}
                onPress={() => scrollToPage(index)}
                activeOpacity={0.8}
              >
                {/* The Line Connector */}
                {index < pages.length - 1 && (
                  <View style={[
                    styles.storyLine, 
                    (isCompleted || isActive) && { backgroundColor: theme.primaryLight } 
                  ]} />
                )}
                
                {/* The Circle */}
                <View style={[
                  styles.storyCircle, 
                  isActive && { 
                    backgroundColor: theme.primaryLight, 
                    transform: [{ scale: 1.05 }],
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 4,
                  },
                  (isCompleted && !isActive) && { backgroundColor: theme.primaryLighter, opacity: 0.8 }
                ]}>
                  <View style={styles.storyInner}>
                    <Ionicons 
                      name={page.icon as any} 
                      size={20} 
                      color={isActive ? theme.primary : theme.gray500} 
                    />
                  </View>
                </View>
                <Text style={[
                  styles.storyLabel,
                  isActive && { color: theme.primary, fontWeight: '600' }
                ]}>{page.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Main Card Slider */}
      <View style={styles.cardContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={pages}
          renderItem={({ item }) => item.render()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.key}
          onMomentumScrollEnd={(event) => {
            const newPage = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPage(newPage);
          }}
        />
      </View>

      {/* 4. Quick Info Bar */}
      <View style={styles.quickInfoBar}>
        <View style={styles.quickInfoItem}>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <Text style={styles.quickInfoText}>{tip.time ? tip.time.replace('_', ' ') : '5 min'}</Text>
        </View>
        <View style={styles.quickInfoDivider} />
        <View style={styles.quickInfoItem}>
          <Ionicons name="people" size={16} color={theme.primary} />
          <Text style={styles.quickInfoText}>2.4k tried</Text>
        </View>
        <View style={styles.quickInfoDivider} />
        <View style={styles.quickInfoItem}>
          <Ionicons name="wallet-outline" size={16} color={theme.primary} />
          <Text style={styles.quickInfoText}>{tip.money_cost_enum === 'free' ? 'Free' : 'Low Cost'}</Text>
        </View>
      </View>

      {/* 5. Action Buttons */}
      {!rejectionInfo && !maybeLaterInfo && (
        <View style={[styles.actionSection, { paddingBottom: 20 + insets.bottom }]}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            onPress={() => handleResponse('try_it')}
            activeOpacity={0.9}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text style={styles.primaryBtnText}>I'll Try It!</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: theme.gray300 }]}
              onPress={() => handleResponse('maybe_later')}
              activeOpacity={0.7}
            >
               <Ionicons name="bookmark-outline" size={18} color={theme.gray700} />
               <Text style={styles.secondaryBtnText}>Save for Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryBtn, { borderColor: theme.gray300 }]}
              onPress={handleNotForMe}
              activeOpacity={0.7}
            >
               <Ionicons name="close-outline" size={18} color={theme.gray700} />
               <Text style={styles.secondaryBtnText}>Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: NEUTRALS.white,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  themeSwitcher: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeSwitcherGradient: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Stories Section
  storiesSection: {
    backgroundColor: NEUTRALS.white,
    paddingTop: 20,  // Increased top padding to prevent cutoff
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 0,  // Remove margin, use spacing differently
    position: 'relative',
    width: 86,  // Increased to accommodate line positioning
  },
  storyCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    backgroundColor: NEUTRALS.gray300,
    marginBottom: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: NEUTRALS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NEUTRALS.white,
  },
  storyLabel: {
    fontSize: 11,
    color: NEUTRALS.gray500,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,  // Small margin to prevent cutoff
  },
  storyLine: {
    position: 'absolute',
    top: 28, // Center of circle height
    left: 56, // Start from right edge of circle
    width: 30, // Connect to next circle
    height: 2,
    backgroundColor: NEUTRALS.gray300,
    zIndex: -1,
  },
  // Main Card
  cardContainer: {
    flex: 1,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainCard: {
    flex: 1,
    backgroundColor: NEUTRALS.white,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  cardVisualGradient: {
    height: 220,
  },
  cardVisual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 20,
  },
  imageContainer: {
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,  // Extended gradient area for stronger effect
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 24,
  },
  imageHeaderContent: {
    alignItems: 'flex-start',
  },
  imageCardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: NEUTRALS.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  imageCardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  textContentContainer: {
    // Container for text content
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  contentSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  contentDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  reasonsContainer: {
    marginTop: 8,
  },
  reasonsLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  reasonBullet: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: '700',
  },
  reasonText: {
    fontSize: 14,
    lineHeight: 20,
    color: NEUTRALS.gray700,
    flex: 1,
  },
  decoCircleBig: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -150,
    right: -150,
  },
  decoCircleSmall: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -100,
    left: -100,
  },
  timeDifficultyContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  visualBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visualBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  visualIcon: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: NEUTRALS.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    // backgroundColor set dynamically with theme.primaryLightest
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benefitItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 13,
    color: NEUTRALS.gray700,
    fontWeight: '500',
    flex: 1,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: NEUTRALS.gray700,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: NEUTRALS.gray900,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: NEUTRALS.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    color: NEUTRALS.gray700,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: NEUTRALS.gray100,
    marginVertical: 20,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletDot: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  // Quick Info Bar
  quickInfoBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: NEUTRALS.white,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  quickInfoText: {
    fontSize: 12,
    fontWeight: '600',
    color: NEUTRALS.gray700,
  },
  quickInfoDivider: {
    width: 1,
    height: 16,
    backgroundColor: NEUTRALS.gray300,
  },
  // Actions
  actionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  primaryBtnText: {
    color: NEUTRALS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: NEUTRALS.white,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: NEUTRALS.gray700,
  },
});
