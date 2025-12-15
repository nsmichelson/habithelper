import StorageService from '@/services/storage';
import { getMotivationCards, MotivationCard } from '@/data/motivationCards';
import {
  NUTRITION_OBSTACLES,
  NUTRITION_HELPERS,
  getPersonalizedCheckInOptions,
  extractNutritionProfileData,
} from '@/data/checkInMappings';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { SimplifiedTip } from '../types/simplifiedTip';
import { DailyTip, QuickComplete, UserProfile } from '../types/tip';
import QuickCompleteModal from './QuickComplete';
import TipHistoryModal from './TipHistoryModal';
import PersonalizationCard from './PersonalizationCard';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: SimplifiedTip;
  personalizedPlan?: string | null;
  onViewDetails: () => void;
  timeUntilCheckIn: number;
  onQuickComplete: (note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me') => void;
  quickCompletions?: QuickComplete[];
  totalExperiments?: number;
  successfulExperiments?: number;
  tipHistory?: Array<{
    dailyTip: DailyTip;
    tip: SimplifiedTip;
  }>;
  personalizationData?: any; // Can be raw saved data { type, data } or { savedData: { type, data } }
  onSavePersonalization?: (data: any) => void;
  showHeaderStats?: boolean;
  onToggleHeaderStats?: () => void;
  isInFocusMode?: boolean;
  focusProgress?: {
    daysCompleted: number;
    daysTotal: number;
  };
  userProfile?: UserProfile | null;
}

// Confetti particle component
const ConfettiParticle = ({ delay, startX }: { delay: number; startX: number }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-SCREEN_HEIGHT, {
        duration: 3000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );

    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(Math.random() * 100 - 50, { duration: 1500 }),
        withTiming(Math.random() * 100 - 50, { duration: 1500 })
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        1
      )
    );

    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2600, withTiming(0, { duration: 200 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#9C27B0'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        animatedStyle,
        {
          left: startX,
          backgroundColor: color,
        },
      ]}
    />
  );
};

export default function ExperimentModeSwipe({
  tip,
  personalizedPlan = null,
  onViewDetails,
  timeUntilCheckIn,
  onQuickComplete,
  quickCompletions = [],
  totalExperiments = 0,
  successfulExperiments = 0,
  tipHistory = [],
  personalizationData,
  onSavePersonalization,
  showHeaderStats = false,
  onToggleHeaderStats,
  isInFocusMode = false,
  focusProgress,
  userProfile
}: Props) {
  // Normalize personalization data - can come as raw { type, data } or nested { savedData: { type, data } }
  const savedPersonalizationData = personalizationData?.savedData ||
    (personalizationData?.type ? personalizationData : null);
  const hasSavedPlan = !!savedPersonalizationData;

  // Debug logging for personalization data
  console.log('ExperimentModeSwipe - personalizationData received:', personalizationData);
  console.log('ExperimentModeSwipe - savedPersonalizationData normalized:', savedPersonalizationData);
  console.log('ExperimentModeSwipe - hasSavedPlan:', hasSavedPlan);

  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [helpView, setHelpView] = useState<'main' | 'sub_options' | 'resolution'>('main');
  const [selectedHelpCategory, setSelectedHelpCategory] = useState<string | null>(null);
  const [selectedHelpSubOption, setSelectedHelpSubOption] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewedCards, setViewedCards] = useState<string[]>(['protip']);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [dynamicQuizAnswer, setDynamicQuizAnswer] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: SimplifiedTip }>>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false);
  const [centralizedCompletionCount, setCentralizedCompletionCount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  // Check-in state
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedInFavor, setSelectedInFavor] = useState<string[]>([]);
  const [selectedObstacles, setSelectedObstacles] = useState<string[]>([]);

  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);
  const holdProgress = useSharedValue(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streak = focusProgress?.daysCompleted || 5;

  // Button spring animation
  const buttonsScale = useSharedValue(0.8);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(20);

  // Trigger button spring animation on mount
  useEffect(() => {
    buttonsScale.value = withSpring(1, { damping: 12, stiffness: 150 });
    buttonsOpacity.value = withSpring(1, { damping: 15, stiffness: 100 });
    buttonsTranslateY.value = withSpring(0, { damping: 14, stiffness: 120 });
  }, []);

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [
      { scale: buttonsScale.value },
      { translateY: buttonsTranslateY.value },
    ],
  }));

  // Bottom sheet animations
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const openSheet = () => {
    backdropOpacity.value = withTiming(1, { duration: 250 });
    sheetTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
  };

  const closeSheet = (callback?: () => void) => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    sheetTranslateY.value = withTiming(400, { duration: 250 }, () => {
      if (callback) {
        runOnJS(callback)();
      }
    });
  };

  const resetHelpMenu = () => {
    setHelpView('main');
    setSelectedHelpCategory(null);
    setSelectedHelpSubOption(null);
  };

  // Open sheet when modals become visible
  useEffect(() => {
    if (showHelpMenu || activeCard || showCheckIn) {
      openSheet();
    }
  }, [showHelpMenu, activeCard, showCheckIn]);

  // Troubleshooting Tree Data
  const helpCategories = [
    {
      id: 'forgot',
      emoji: '😅',
      label: 'I forgot or keep forgetting',
      description: 'Memory & reminders',
      options: [
        { id: 'forgot_plain', label: 'I just plain forgot', action: 'reminder', content: "No problem. Let's set a reminder for a time that actually works." },
        { id: 'distracted', label: 'I remembered but got distracted', action: 'habit_stack', content: "Distractions happen. Let's anchor this to something you already do (like brushing teeth)." },
        { id: 'wrong_time', label: "It's hard to remember this time of day", action: 'reschedule', content: "Maybe this time doesn't fit your flow. Want to try doing it at a different time?" },
      ]
    },
    {
      id: 'logistics',
      emoji: '🛠️',
      label: "I don't have what I needed",
      description: 'Missing ingredients or gear',
      options: [
        { id: 'missing_item', label: "I'm missing an ingredient/item", action: 'substitutions', content: (tip.substitutions && tip.substitutions.length > 0) ? "Here are some swaps you might have on hand:\n" + tip.substitutions.map(s => `• ${s.item}: Try ${s.swaps.join(' or ')}`).join('\n') : "Can you improvise with something similar, or do you want to skip today?" },
        { id: 'no_equipment', label: "I don't have the equipment", action: 'low_tech', content: tip.low_tech_version ? `No fancy gear needed. Try this low-tech version:\n${tip.low_tech_version}` : "No worries. Let's pick a tip that uses what you have." },
        { id: 'too_expensive', label: "It costs too much", action: 'budget', content: "Health shouldn't break the bank. Let's swap this for a zero-cost option." },
      ]
    },
    {
      id: 'schedule',
      emoji: '📅',
      label: 'My schedule changed',
      description: 'Travel, emergencies, or busy days',
      options: [
        { id: 'no_time', label: 'I have zero time right now', action: 'micro', content: tip.micro_version ? `Do the 1-minute version instead:\n${tip.micro_version}` : "Just do the first tiny step. That counts!" },
        { id: 'traveling', label: 'I\'m traveling / out of routine', action: 'adapt', content: "Travel mode on. Aim for 'good enough,' not perfect. Can you do 50% of it?" },
        { id: 'emergency', label: 'An emergency came up', action: 'skip', content: "Life happens. Mark it as 'Life got in the way' and we'll reset for tomorrow. No streak penalty." },
      ]
    },
    {
      id: 'cravings',
      emoji: '🍕',
      label: 'Cravings or social stuff',
      description: 'Parties, peer pressure, urges',
      options: [
        { id: 'social', label: "I'm at a restaurant/party", action: 'social_defense', content: "Social defense mode: 1. Order first. 2. Hold a drink (water). 3. Focus on the people." },
        { id: 'craving', label: 'I have a strong craving', action: 'urge_surf', content: "Let's surf the urge. It usually peaks in 20 mins. Want to start a 5-minute timer?" },
        { id: 'peer_pressure', label: 'Peer pressure / Family', action: 'script', content: "Try this script: 'I'm experimenting with something new for my digestion/energy right now.' People usually back off." },
      ]
    },
    {
      id: 'resistance',
      emoji: '🫣',
      label: 'Something feels off',
      description: 'Physical or emotional barriers',
      options: [
        { id: 'physically_bad', label: 'I feel physically bad (bloated, tired)', action: 'rest', content: "Rest is productive too. Let's count 'Resting' as your win for today." },
        { id: 'anxious', label: 'I feel anxious/overwhelmed by it', action: 'shrink', content: "The task might be too big. What's the tiniest first step? Just do that." },
        { id: 'not_in_mood', label: "I'm just not in the mood", action: 'motivation', content: "Fair enough. Is it a 'hard no' or a 'maybe for 1 minute'?" },
      ]
    },
    {
      id: 'efficacy',
      emoji: '🤔',
      label: 'Tried but not working',
      description: "didn't help or tasted bad",
      options: [
        { id: 'no_result', label: "I did it, but didn't get the result", action: 'patience', content: "Biology is slow. This usually takes time to feel a difference. Stick with it one more day?" },
        { id: 'unpleasant', label: 'It was unpleasant / tasted bad', action: 'dislike', content: "Noted. We won't show you this one again. Let's try something different." },
        { id: 'incomplete', label: "I couldn't finish it", action: 'partial', content: "Partial reps count! You did more than zero. That's a win." },
      ]
    }
  ];

  const rootOptions = [
    {
      id: 'start_now',
      emoji: '⚡',
      label: 'Help me get started now',
      description: 'Just the first simple step',
      action: () => {
        if (tip.micro_version) {
          // If we have a specific micro version, go to resolution view directly
          // We can reuse the resolution view by mocking a category/option selection or create a dedicated state
          // For simplicity, let's reuse resolution with a special ID
          setSelectedHelpCategory('schedule'); // Reuse schedule category as it likely has the "no time" option which maps to micro
          setSelectedHelpSubOption('no_time');
          setHelpView('resolution');
        } else {
          // Fallback if no micro version defined
          setSelectedHelpCategory('schedule');
          setSelectedHelpSubOption('no_time');
          setHelpView('resolution');
        }
      }
    },
    {
      id: 'easier',
      emoji: '🔀',
      label: 'Make it easier or different',
      description: 'See 2-3 alternative options',
      action: () => {
        if (tip.variants && tip.variants.length > 0) {
          setHelpView('variants');
        } else {
          // If no variants, maybe default to "I don't have equipment" or similar?
          // Or show a message saying "No variants available"
          setSelectedHelpCategory('logistics');
          setHelpView('sub_options'); // Fallback to logistics
        }
      }
    },
    {
      id: 'troubleshoot',
      emoji: '🔧',
      label: 'Troubleshoot',
      description: "Something's getting in the way",
      action: () => {
        setHelpView('troubleshoot_categories');
      }
    }
  ];

  // Area-specific check-in options
  const getCheckInOptions = () => {
    const area = tip?.area || 'nutrition';

    type CheckInOption = { id: string; icon: keyof typeof Ionicons.glyphMap; label: string };
    type CheckInSection = { label: string; options: CheckInOption[] };

    // Feeling is the same across all areas
    const feeling: CheckInSection = {
      label: "How are you feeling?",
      options: [
        { id: 'great', icon: 'sunny-outline', label: 'Great' },
        { id: 'good', icon: 'happy-outline', label: 'Good' },
        { id: 'okay', icon: 'remove-outline', label: 'Okay' },
        { id: 'tired', icon: 'moon-outline', label: 'Tired' },
        { id: 'stressed', icon: 'cloudy-outline', label: 'Stressed' },
      ]
    };

    // Extract user's nutrition data for personalization (supports both old and new quiz structures)
    const nutritionData = extractNutritionProfileData(userProfile as any);

    // Debug: Log what profile data we're working with
    if (__DEV__) {
      console.log('CheckIn - User profile primary_focus:', (userProfile as any)?.primary_focus);
      console.log('CheckIn - User profile specific_challenges:', (userProfile as any)?.specific_challenges);
      console.log('CheckIn - User profile medical_conditions:', (userProfile as any)?.medical_conditions);
      console.log('CheckIn - User profile lifestyle:', (userProfile as any)?.lifestyle);
      console.log('CheckIn - Extracted nutrition data:', nutritionData);
    }

    // Get personalized nutrition options based on onboarding
    const personalizedNutritionHelpers = getPersonalizedCheckInOptions(
      NUTRITION_HELPERS,
      nutritionData.barriers,
      nutritionData.goals,
      nutritionData.worked,
      nutritionData.avoided,
      nutritionData.conditions,
      nutritionData.lifeRole
    );

    const personalizedNutritionObstacles = getPersonalizedCheckInOptions(
      NUTRITION_OBSTACLES,
      nutritionData.barriers,
      nutritionData.goals,
      nutritionData.worked,
      nutritionData.avoided,
      nutritionData.conditions,
      nutritionData.lifeRole
    );

    // Area-specific "in favor" and "obstacles" options
    const areaOptions: Record<string, { inFavor: CheckInSection; obstacles: CheckInSection }> = {
      nutrition: {
        inFavor: {
          label: "What's working in your favor?",
          options: personalizedNutritionHelpers as CheckInOption[]
        },
        obstacles: {
          label: "What might get in the way?",
          options: personalizedNutritionObstacles as CheckInOption[]
        }
      },
      fitness: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'energized', icon: 'battery-full-outline', label: 'Feeling energized' },
            { id: 'motivated', icon: 'flash-outline', label: 'Motivated' },
            { id: 'free_time', icon: 'time-outline', label: 'Have free time' },
            { id: 'gear_ready', icon: 'fitness-outline', label: 'Gear ready' },
            { id: 'buddy', icon: 'people-outline', label: 'Workout buddy' },
            { id: 'good_weather', icon: 'sunny-outline', label: 'Good weather' },
            { id: 'good_playlist', icon: 'musical-notes-outline', label: 'Good playlist' },
            { id: 'goal_in_mind', icon: 'trophy-outline', label: 'Goal in mind' },
            { id: 'habit_established', icon: 'repeat-outline', label: 'Habit established' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'tired', icon: 'moon-outline', label: 'Feeling tired' },
            { id: 'sore', icon: 'bandage-outline', label: 'Body is sore' },
            { id: 'busy', icon: 'calendar-outline', label: 'Busy schedule' },
            { id: 'weather', icon: 'rainy-outline', label: 'Bad weather' },
            { id: 'no_motivation', icon: 'trending-down-outline', label: 'Low motivation' },
            { id: 'no_gym', icon: 'close-circle-outline', label: 'No gym access' },
            { id: 'minor_ache', icon: 'medkit-outline', label: 'Minor ache' },
            { id: 'no_equipment', icon: 'barbell-outline', label: 'No equipment' },
            { id: 'self_conscious', icon: 'eye-off-outline', label: 'Self-conscious' },
            { id: 'family_needs', icon: 'home-outline', label: 'Family needs' },
          ]
        }
      },
      sleep: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'relaxed', icon: 'leaf-outline', label: 'Feeling relaxed' },
            { id: 'no_caffeine', icon: 'cafe-outline', label: 'No late caffeine' },
            { id: 'early_dinner', icon: 'restaurant-outline', label: 'Ate dinner early' },
            { id: 'quiet_home', icon: 'home-outline', label: 'Quiet at home' },
            { id: 'tired', icon: 'moon-outline', label: 'Naturally tired' },
            { id: 'no_screens', icon: 'phone-portrait-outline', label: 'Limiting screens' },
            { id: 'cool_room', icon: 'thermometer-outline', label: 'Cool room' },
            { id: 'fresh_sheets', icon: 'bed-outline', label: 'Fresh sheets' },
            { id: 'dark_room', icon: 'contrast-outline', label: 'Dark room' },
            { id: 'winddown_time', icon: 'book-outline', label: 'Wind-down time' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'wired', icon: 'flash-outline', label: 'Feeling wired' },
            { id: 'screens', icon: 'phone-portrait-outline', label: 'Screen temptation' },
            { id: 'late_caffeine', icon: 'cafe-outline', label: 'Had caffeine late' },
            { id: 'stress', icon: 'cloudy-outline', label: 'Mind racing' },
            { id: 'noise', icon: 'volume-high-outline', label: 'Noisy environment' },
            { id: 'late_plans', icon: 'calendar-outline', label: 'Late night plans' },
            { id: 'too_hot_cold', icon: 'thermometer-outline', label: 'Too hot/cold' },
            { id: 'pets', icon: 'paw-outline', label: 'Pets' },
            { id: 'partner_kids', icon: 'people-outline', label: 'Partner/Kids' },
            { id: 'discomfort', icon: 'medkit-outline', label: 'Discomfort' },
            { id: 'ate_late', icon: 'restaurant-outline', label: 'Ate late' },
          ]
        }
      },
      stress: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'calm', icon: 'leaf-outline', label: 'Feeling calm' },
            { id: 'light_day', icon: 'sunny-outline', label: 'Light schedule' },
            { id: 'support', icon: 'people-outline', label: 'Support available' },
            { id: 'slept_well', icon: 'moon-outline', label: 'Slept well' },
            { id: 'quiet_space', icon: 'home-outline', label: 'Have quiet space' },
            { id: 'free_time', icon: 'time-outline', label: 'Have free time' },
            { id: 'nature_time', icon: 'flower-outline', label: 'Nature time' },
            { id: 'music_audio', icon: 'musical-notes-outline', label: 'Music/Audio' },
            { id: 'good_perspective', icon: 'glasses-outline', label: 'Good perspective' },
            { id: 'moved_body', icon: 'walk-outline', label: 'Moved body' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'overwhelmed', icon: 'alert-circle-outline', label: 'Feeling overwhelmed' },
            { id: 'busy', icon: 'calendar-outline', label: 'Packed schedule' },
            { id: 'deadlines', icon: 'time-outline', label: 'Deadlines looming' },
            { id: 'conflict', icon: 'people-outline', label: 'People stress' },
            { id: 'no_space', icon: 'close-circle-outline', label: 'No quiet space' },
            { id: 'tired', icon: 'moon-outline', label: 'Too tired' },
            { id: 'news_socials', icon: 'newspaper-outline', label: 'News/Socials' },
            { id: 'financial_worry', icon: 'cash-outline', label: 'Financial worry' },
            { id: 'health_worry', icon: 'heart-outline', label: 'Health worry' },
            { id: 'traffic_travel', icon: 'car-outline', label: 'Traffic/Travel' },
            { id: 'hungry', icon: 'pizza-outline', label: 'Hungry' },
          ]
        }
      },
      organization: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'motivated', icon: 'flash-outline', label: 'Feeling motivated' },
            { id: 'free_time', icon: 'time-outline', label: 'Have free time' },
            { id: 'clear_head', icon: 'sunny-outline', label: 'Clear headed' },
            { id: 'tools_ready', icon: 'construct-outline', label: 'Tools ready' },
            { id: 'home', icon: 'home-outline', label: 'At home' },
            { id: 'energized', icon: 'battery-full-outline', label: 'Energized' },
            { id: 'have_list', icon: 'list-outline', label: 'Have a list' },
            { id: 'clear_space', icon: 'sparkles-outline', label: 'Clear space' },
            { id: 'good_pressure', icon: 'timer-outline', label: 'Good pressure' },
            { id: 'early_win', icon: 'checkmark-circle-outline', label: 'Early win' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'overwhelmed', icon: 'alert-circle-outline', label: 'Feeling overwhelmed' },
            { id: 'busy', icon: 'calendar-outline', label: 'Too busy' },
            { id: 'distractions', icon: 'notifications-outline', label: 'Distractions' },
            { id: 'tired', icon: 'moon-outline', label: 'Too tired' },
            { id: 'not_home', icon: 'car-outline', label: 'Away from home' },
            { id: 'procrastinating', icon: 'hourglass-outline', label: 'Procrastinating' },
            { id: 'messy_space', icon: 'trash-outline', label: 'Messy space' },
            { id: 'perfectionism', icon: 'pencil-outline', label: 'Perfectionism' },
            { id: 'interruptions', icon: 'people-outline', label: 'Interruptions' },
            { id: 'brain_fog', icon: 'cloud-outline', label: 'Brain fog' },
            { id: 'missing_info', icon: 'help-circle-outline', label: 'Missing info' },
          ]
        }
      },
      relationships: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'good_mood', icon: 'happy-outline', label: 'In a good mood' },
            { id: 'free_time', icon: 'time-outline', label: 'Have quality time' },
            { id: 'connected', icon: 'heart-outline', label: 'Feeling connected' },
            { id: 'partner_available', icon: 'people-outline', label: 'Partner available' },
            { id: 'calm', icon: 'leaf-outline', label: 'Feeling patient' },
            { id: 'rested', icon: 'sunny-outline', label: 'Well rested' },
            { id: 'shared_activity', icon: 'bicycle-outline', label: 'Shared activity' },
            { id: 'good_news', icon: 'star-outline', label: 'Good news' },
            { id: 'physical_touch', icon: 'hand-left-outline', label: 'Physical touch' },
            { id: 'both_willing', icon: 'heart-circle-outline', label: 'Both willing' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'stressed', icon: 'cloudy-outline', label: 'Stressed out' },
            { id: 'busy', icon: 'calendar-outline', label: 'Both busy' },
            { id: 'tension', icon: 'alert-circle-outline', label: 'Some tension' },
            { id: 'tired', icon: 'moon-outline', label: 'Too tired' },
            { id: 'distracted', icon: 'phone-portrait-outline', label: 'Distractions' },
            { id: 'apart', icon: 'location-outline', label: 'Not together' },
            { id: 'miscommunication', icon: 'chatbubbles-outline', label: 'Miscommunication' },
            { id: 'money_stress', icon: 'cash-outline', label: 'Money stress' },
            { id: 'hangry', icon: 'restaurant-outline', label: 'Hunger/Hangry' },
            { id: 'screens_present', icon: 'phone-portrait-outline', label: 'Screens present' },
            { id: 'parenting', icon: 'people-outline', label: 'Parenting' },
          ]
        }
      },
      mindset: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'motivated', icon: 'flash-outline', label: 'Feeling motivated' },
            { id: 'clear_head', icon: 'sunny-outline', label: 'Clear head' },
            { id: 'rested', icon: 'bed-outline', label: 'Well rested' },
            { id: 'quiet_time', icon: 'volume-off-outline', label: 'Quiet time' },
            { id: 'good_mood', icon: 'happy-outline', label: 'Good mood' },
            { id: 'journal_ready', icon: 'book-outline', label: 'Journal ready' },
            { id: 'support', icon: 'people-outline', label: 'Support available' },
            { id: 'accomplished', icon: 'trophy-outline', label: 'Recent win' },
            { id: 'curious', icon: 'bulb-outline', label: 'Feeling curious' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'anxious', icon: 'alert-circle-outline', label: 'Anxious thoughts' },
            { id: 'distracted', icon: 'phone-portrait-outline', label: 'Distracted' },
            { id: 'tired', icon: 'moon-outline', label: 'Too tired' },
            { id: 'overwhelmed', icon: 'cloud-outline', label: 'Overwhelmed' },
            { id: 'negative_thoughts', icon: 'sad-outline', label: 'Negative thoughts' },
            { id: 'no_time', icon: 'time-outline', label: 'No time' },
            { id: 'noisy', icon: 'volume-high-outline', label: 'Noisy environment' },
            { id: 'comparison', icon: 'people-outline', label: 'Comparing myself' },
            { id: 'perfectionism', icon: 'checkmark-done-outline', label: 'Perfectionism' },
            { id: 'low_energy', icon: 'battery-dead-outline', label: 'Low energy' },
          ]
        }
      },
      productivity: {
        inFavor: {
          label: "What's working in your favor?",
          options: [
            { id: 'motivated', icon: 'flash-outline', label: 'Feeling motivated' },
            { id: 'clear_schedule', icon: 'calendar-outline', label: 'Clear schedule' },
            { id: 'rested', icon: 'sunny-outline', label: 'Well rested' },
            { id: 'quiet_space', icon: 'volume-off-outline', label: 'Quiet space' },
            { id: 'have_list', icon: 'list-outline', label: 'Have a list' },
            { id: 'deadline', icon: 'timer-outline', label: 'Good deadline pressure' },
            { id: 'tools_ready', icon: 'laptop-outline', label: 'Tools ready' },
            { id: 'focused', icon: 'eye-outline', label: 'Feeling focused' },
            { id: 'early_win', icon: 'trophy-outline', label: 'Early win today' },
          ]
        },
        obstacles: {
          label: "What might get in the way?",
          options: [
            { id: 'distracted', icon: 'phone-portrait-outline', label: 'Distractions' },
            { id: 'tired', icon: 'moon-outline', label: 'Too tired' },
            { id: 'overwhelmed', icon: 'cloud-outline', label: 'Overwhelmed' },
            { id: 'procrastinating', icon: 'hourglass-outline', label: 'Procrastinating' },
            { id: 'interruptions', icon: 'notifications-outline', label: 'Interruptions' },
            { id: 'unclear_priorities', icon: 'help-circle-outline', label: 'Unclear priorities' },
            { id: 'low_energy', icon: 'battery-dead-outline', label: 'Low energy' },
            { id: 'perfectionism', icon: 'checkmark-done-outline', label: 'Perfectionism' },
            { id: 'meetings', icon: 'people-outline', label: 'Too many meetings' },
            { id: 'decision_fatigue', icon: 'git-branch-outline', label: 'Decision fatigue' },
          ]
        }
      }
    };

    // Map 'exercise' to 'fitness' since tips use 'exercise' but options use 'fitness'
    const mappedArea = (area as string) === 'exercise' ? 'fitness' : area;
    const areaConfig = areaOptions[mappedArea] || areaOptions.nutrition;

    return {
      feeling,
      inFavor: areaConfig.inFavor,
      obstacles: areaConfig.obstacles
    };
  };

  const checkInOptions = getCheckInOptions();

  const toggleInFavor = (id: string) => {
    if (selectedInFavor.includes(id)) {
      setSelectedInFavor(selectedInFavor.filter(f => f !== id));
    } else {
      setSelectedInFavor([...selectedInFavor, id]);
    }
  };

  const toggleObstacle = (id: string) => {
    if (selectedObstacles.includes(id)) {
      setSelectedObstacles(selectedObstacles.filter(o => o !== id));
    } else {
      setSelectedObstacles([...selectedObstacles, id]);
    }
  };

  const handleSaveCheckIn = () => {
    closeSheet(() => setShowCheckIn(false));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const totalCheckInSelections = selectedInFavor.length + selectedObstacles.length + selectedFeelings.length;

  // Get motivation cards from centralized data file
  const area = tip?.area || 'nutrition';
  const motivationCards = getMotivationCards(
    selectedFeelings,
    selectedObstacles,
    selectedInFavor,
    area
  );
  const activeMotivationCard = motivationCards.find(c => c.id === activeCard);

  // Load centralized completion count on mount
  useEffect(() => {
    const loadCompletionCount = async () => {
      const completions = await StorageService.getHabitCompletions();
      const count = completions.get(tip.tip_id) || 0;
      setCentralizedCompletionCount(count);

      // If already completed today, mark as completed
      if (count > 0 || quickCompletions.length > 0) {
        setCompleted(true);
      }
    };
    loadCompletionCount();
  }, [tip.tip_id, quickCompletions.length]);

  useEffect(() => {
    if (!hasSeenCelebration) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      celebrationScale.value = withSpring(1, {
        damping: 8,
        stiffness: 100,
        mass: 0.5
      });

      celebrationOpacity.value = withTiming(1, { duration: 300 });

      celebrationOpacity.value = withDelay(
        2500,
        withTiming(0, {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1)
        })
      );

      setTimeout(() => {
        setShowCelebration(false);
        setHasSeenCelebration(true);
      }, 3500);
    }
  }, []);

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationOpacity.value,
  }));

  // Progress ring animation for hold-to-complete
  const holdProgressAnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * 75; // radius of 75 for larger button
    const strokeDashoffset = circumference * (1 - holdProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // Smaller progress ring for inline button
  const holdProgressAnimatedPropsSmall = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * 46; // radius of 46 for smaller button
    const strokeDashoffset = circumference * (1 - holdProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // Bigger progress ring for primary button (140px, radius 66)
  const holdProgressAnimatedPropsBig = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * 66;
    const strokeDashoffset = circumference * (1 - holdProgress.value);
    return {
      strokeDashoffset,
    };
  });

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
    setShowQuickComplete(true);
  };

  const handlePressIn = () => {
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Start the hold progress animation
    holdProgress.value = withTiming(1, {
      duration: 1500, // 1.5 seconds to complete
      easing: Easing.linear,
    });

    // Set timeout to trigger completion
    holdTimeoutRef.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCompleted(true);
      setShowQuickComplete(true);
      setIsHolding(false);
      holdProgress.value = 0;
    }, 1500);
  };

  const handlePressOut = () => {
    if (isHolding) {
      setIsHolding(false);
      // Cancel the completion
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      // Reset the progress
      holdProgress.value = withTiming(0, { duration: 200 });
    }
  };

  const handleCardTap = (cardId: string) => {
    setActiveCard(cardId);
    if (!viewedCards.includes(cardId)) {
      setViewedCards([...viewedCards, cardId]);
    }
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "Check-in time!";
    if (hours === 1) return "1h left";
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m left`;
    }
    return `${Math.round(hours)}h left`;
  };

  return (
    <View style={styles.container}>
      {/* Confetti Animation (only on first load) */}
      {showCelebration && !hasSeenCelebration && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 50}
              startX={Math.random() * SCREEN_WIDTH}
            />
          ))}
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Tip Card */}
        <View style={styles.mainCard}>
          {/* Image/Visual Area with Action Buttons */}
          <LinearGradient
            colors={['#fed7aa', '#fde68a', '#fdba74']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.visualArea}
          >
            {/* Celebration Overlay */}
            {showCelebration && !hasSeenCelebration && (
              <Animated.View style={[styles.celebrationOverlay, celebrationAnimatedStyle]}>
                <LinearGradient
                  colors={['rgba(76, 175, 80, 0.95)', 'rgba(69, 178, 85, 0.95)']}
                  style={styles.celebrationGradient}
                >
                  <Ionicons name="rocket" size={72} color="#FFF" />
                  <Text style={styles.celebrationTitle}>You're Experimenting!</Text>
                  <Text style={styles.celebrationSubtitle}>Let's make it happen!</Text>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Meta info - top left */}
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="flame" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.metaText}>Day {streak}/7</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{formatTimeRemaining(timeUntilCheckIn)}</Text>
            </View>

            {/* Decorative circles */}
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />

            {/* Tip Content */}
            <View style={styles.tipContentInHeader}>
              {!showPlan && !showDetails ? (
                // Default view - title and action links
                <>
                  <Text style={styles.todaysFocusHeader}>TODAY'S FOCUS</Text>
                  <Text style={styles.tipTitleHeader}>{tip.summary}</Text>

                  {/* Secondary actions row: Details, Plan, Help */}
                  <View style={styles.secondaryActionsRow}>
                    <TouchableOpacity
                      onPress={() => setShowDetails(true)}
                      style={styles.secondaryActionPill}
                    >
                      <Ionicons name="information-circle-outline" size={16} color="#92400e" />
                      <Text style={styles.secondaryActionText}>Details</Text>
                    </TouchableOpacity>
                    <Text style={styles.secondaryActionDivider}>•</Text>
                    <TouchableOpacity
                      onPress={() => setShowPlan(true)}
                      style={styles.secondaryActionPill}
                    >
                      <View style={styles.planButtonContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#92400e" />
                        <Text style={styles.secondaryActionText}>Plan</Text>
                        {/* Show unread indicator when tip supports personalization but no plan is saved */}
                        {tip.personalization_prompt && !hasSavedPlan && (
                          <View style={styles.unreadIndicator} />
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.secondaryActionDivider}>•</Text>
                    <TouchableOpacity
                      onPress={() => setShowHelpMenu(true)}
                      style={styles.secondaryActionPill}
                    >
                      <Ionicons name="heart" size={16} color="#db2777" />
                      <Text style={styles.secondaryActionText}>Help</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : showDetails ? (
                // Details view
                <>
                  <View style={styles.planHeaderInHeader}>
                    <Text style={styles.planTitleHeader}>About This Tip</Text>
                    <TouchableOpacity
                      onPress={() => setShowDetails(false)}
                      style={styles.backButtonHeader}
                    >
                      <Ionicons name="chevron-back" size={16} color="#92400e" />
                      <Text style={styles.backButtonTextHeader}>Back</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.tipDescriptionHeader}>
                    {tip.short_description || tip.details_md.split('\n')[0].replace('**The Experiment:** ', '')}
                  </Text>
                  {tip.details_md && (
                    <Text style={styles.tipDetailsExtraHeader}>
                      {tip.details_md
                        .replace('**The Experiment:** ', '')
                        .replace(/\*\*/g, '')
                        .split('\n')
                        .filter((line: string) => line.trim())
                        .slice(1, 3)
                        .join('\n\n')}
                    </Text>
                  )}
                </>
              ) : (
                // Plan view
                <>
                  <View style={styles.planHeaderInHeader}>
                    <Text style={styles.planTitleHeader}>
                      {hasSavedPlan ? 'Your Plan' : 'Make It Yours'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowPlan(false)}
                      style={styles.backButtonHeader}
                    >
                      <Ionicons name="chevron-back" size={16} color="#92400e" />
                      <Text style={styles.backButtonTextHeader}>Back</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Show PersonalizationCard if tip supports it */}
                  {tip.personalization_prompt ? (
                    <View style={styles.planPersonalizationContainer}>
                      <PersonalizationCard
                        tip={tip}
                        savedData={savedPersonalizationData}
                        onSave={onSavePersonalization}
                        showHeader={false}
                        theme={{
                          primary: '#ea580c',
                          primaryLight: '#fb923c',
                          primaryLighter: '#fdba74',
                          primaryLightest: '#fff7ed',
                          gray900: '#1A1A1A',
                          gray700: '#4A4A4A',
                          gray500: '#767676',
                          gray300: '#B8B8B8',
                          gray100: '#F5F5F5',
                          white: '#FFFFFF',
                        }}
                      />
                    </View>
                  ) : (
                    // Fallback for tips without personalization - show generic message
                    <View style={styles.noPlanContainer}>
                      <Ionicons name="bulb-outline" size={32} color="#92400e" />
                      <Text style={styles.noPlanText}>
                        Try this experiment today and see how it goes!
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Primary Action Button - Big "I did it!" */}
            <Animated.View style={[styles.primaryActionContainer, buttonsAnimatedStyle]}>
              {!completed ? (
                <>
                  <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.95}
                    style={styles.primaryButtonWrapperBig}
                  >
                    <View style={styles.primaryButtonOuterBig}>
                      <View style={styles.primaryButtonInnerBig}>
                        <LinearGradient
                          colors={isHolding ? ['#ea580c', '#c2410c'] : ['#fb923c', '#f97316']}
                          style={styles.primaryButtonGradientBig}
                        >
                          <Ionicons name="checkmark-sharp" size={36} color="#fff" />
                          <Text style={styles.primaryButtonTextBigPop}>
                            {isHolding ? 'Hold...' : 'I did it!'}
                          </Text>
                        </LinearGradient>
                      </View>
                    </View>
                    {/* Progress Ring */}
                    <Svg
                      style={styles.primaryProgressRingBig}
                      width={140}
                      height={140}
                      viewBox="0 0 140 140"
                    >
                      <Circle
                        cx="70"
                        cy="70"
                        r="66"
                        stroke="rgba(251,146,60,0.35)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <AnimatedCircle
                        cx="70"
                        cy="70"
                        r="66"
                        stroke="#fb923c"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 66}
                        animatedProps={holdProgressAnimatedPropsBig}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    </Svg>
                  </TouchableOpacity>
                  <Text style={styles.actionHintOnGradient}>
                    {isHolding ? 'Keep holding...' : 'Hold to complete'}
                  </Text>
                </>
              ) : (
                <View style={styles.completedButtonOnGradient}>
                  <Ionicons name="checkmark-sharp" size={36} color="#22c55e" />
                  <Text style={styles.completedButtonTextOnGradient}>Done!</Text>
                </View>
              )}
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Daily Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={styles.insightsSectionTitle}>TODAY'S MOTIVATION</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            {/* Check-in Card - Featured first card */}
            {(() => {
              const hasSelections = selectedInFavor.length > 0 || selectedObstacles.length > 0 || selectedFeelings.length > 0;
              return (
                <TouchableOpacity
                  onPress={() => setShowCheckIn(true)}
                  style={styles.heroCard}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={hasSelections ? ['#fef3c7', '#fde68a'] : ['#fed7aa', '#fde68a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCardGradient}
                  >
                    <View style={styles.heroCardTopRow}>
                      <Text style={styles.heroCardLabelOrange}>CHECK-IN</Text>
                      <View style={styles.heroCardPlusButton}>
                        <Ionicons
                          name={hasSelections ? "create-outline" : "add"}
                          size={18}
                          color="#ea580c"
                        />
                      </View>
                    </View>

                {/* Show icons if any selections exist, otherwise show prompt */}
                {hasSelections ? (
                  // Show selected icons with color coding by section
                  <>
                    {/* Feelings row - amber */}
                    {selectedFeelings.length > 0 && (
                      <View style={styles.checkInIconsRow}>
                        {selectedFeelings.slice(0, 3).map((feelingId) => {
                          const feeling = checkInOptions.feeling.options.find(f => f.id === feelingId);
                          return feeling ? (
                            <View key={feelingId} style={[styles.checkInCardIconBubble, styles.checkInCardIconFeeling]}>
                              <Ionicons name={feeling.icon} size={14} color="#d97706" />
                            </View>
                          ) : null;
                        })}
                        {selectedFeelings.length > 3 && (
                          <Text style={styles.checkInCardMoreText}>+{selectedFeelings.length - 3}</Text>
                        )}
                      </View>
                    )}
                    {/* In favor row - green */}
                    {selectedInFavor.length > 0 && (
                      <View style={styles.checkInIconsRow}>
                        {selectedInFavor.slice(0, 3).map((favorId) => {
                          const favor = checkInOptions.inFavor.options.find(f => f.id === favorId);
                          return favor ? (
                            <View key={favorId} style={[styles.checkInCardIconBubble, styles.checkInCardIconInFavor]}>
                              <Ionicons name={favor.icon} size={14} color="#059669" />
                            </View>
                          ) : null;
                        })}
                        {selectedInFavor.length > 3 && (
                          <View style={[styles.checkInCardIconBubble, styles.checkInCardIconInFavor]}>
                            <Text style={styles.checkInCardIconInFavorMoreText}>+{selectedInFavor.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    )}
                    {/* Obstacles row - orange/red */}
                    {selectedObstacles.length > 0 && (
                      <View style={styles.checkInIconsRow}>
                        {selectedObstacles.slice(0, 3).map((obstacleId) => {
                          const obstacle = checkInOptions.obstacles.options.find(o => o.id === obstacleId);
                          return obstacle ? (
                            <View key={obstacleId} style={[styles.checkInCardIconBubble, styles.checkInCardIconObstacle]}>
                              <Ionicons name={obstacle.icon} size={14} color="#dc2626" />
                            </View>
                          ) : null;
                        })}
                        {selectedObstacles.length > 3 && (
                          <View style={[styles.checkInCardIconBubble, styles.checkInCardIconObstacle]}>
                            <Text style={styles.checkInCardIconObstacleMoreText}>+{selectedObstacles.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    )}
                    <Text style={styles.heroCardSubtitleOrange}>Tap to update</Text>
                  </>
                ) : (
                  // Show prompt when nothing selected
                  <>
                    <Text style={styles.heroCardTitleOrange}>How's today?</Text>
                    <Text style={styles.heroCardSubtitleOrange}>Quick check-in</Text>
                  </>
                )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })()}

            {/* Dynamic Motivation Cards based on check-in - show first if any */}
            {motivationCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                onPress={() => handleCardTap(card.id)}
                style={[
                  styles.insightCard,
                  !viewedCards.includes(card.id) && styles.insightCardUnread
                ]}
              >
                {!viewedCards.includes(card.id) && (
                  <View style={[styles.unreadDot, { backgroundColor: card.iconColor }]} />
                )}
                <View style={styles.insightCardHeader}>
                  <View style={[styles.insightIcon, { backgroundColor: card.iconBg }]}>
                    <Ionicons name={card.icon} size={16} color={card.iconColor} />
                  </View>
                  <Text style={[
                    styles.insightCardTitle,
                    viewedCards.includes(card.id) && styles.insightCardTitleViewed
                  ]}>
                    {card.title}
                  </Text>
                </View>
                <Text style={[
                  styles.insightCardText,
                  viewedCards.includes(card.id) && styles.insightCardTextViewed
                ]}>
                  {card.text}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Fun Fact Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('funfact')}
              style={[
                styles.insightCard,
                !viewedCards.includes('funfact') && styles.insightCardUnread
              ]}
            >
              {!viewedCards.includes('funfact') && <View style={[styles.unreadDot, { backgroundColor: '#fbbf24' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('funfact') ? '#fef3c7' : '#fef9c3' }]}>
                  <Ionicons name="bulb" size={16} color={viewedCards.includes('funfact') ? '#d97706' : '#ca8a04'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('funfact') && styles.insightCardTitleViewed]}>Fun Fact</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('funfact') && styles.insightCardTextViewed]}>
                Walking after eating can lower blood sugar by up to 30%!
              </Text>
            </TouchableOpacity>

            {/* Quiz Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('quiz')}
              style={[
                styles.insightCard,
                !viewedCards.includes('quiz') && styles.insightCardUnreadPurple
              ]}
            >
              {!viewedCards.includes('quiz') && <View style={[styles.unreadDot, { backgroundColor: '#a855f7' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('quiz') ? '#f3e8ff' : '#ede9fe' }]}>
                  <Ionicons name="school" size={16} color={viewedCards.includes('quiz') ? '#9333ea' : '#7c3aed'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('quiz') && styles.insightCardTitleViewed]}>Quick Quiz</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('quiz') && styles.insightCardTextViewed]}>Test your knowledge!</Text>
              <View style={[styles.quizButton, viewedCards.includes('quiz') && styles.quizButtonViewed]}>
                <Text style={styles.quizButtonText}>Take Quiz →</Text>
              </View>
            </TouchableOpacity>

            {/* Pro Tip Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('protip')}
              style={[
                styles.insightCard,
                !viewedCards.includes('protip') && styles.insightCardUnreadTeal
              ]}
            >
              {!viewedCards.includes('protip') && <View style={[styles.unreadDot, { backgroundColor: '#14b8a6' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('protip') ? '#ccfbf1' : '#d1fae5' }]}>
                  <Ionicons name="heart" size={16} color={viewedCards.includes('protip') ? '#0d9488' : '#059669'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('protip') && styles.insightCardTitleViewed]}>Pro Tip</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('protip') && styles.insightCardTextViewed]}>
                Try walking with a podcast to make it more enjoyable!
              </Text>
            </TouchableOpacity>

            {/* Community Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('community')}
              style={[
                styles.insightCard,
                !viewedCards.includes('community') && styles.insightCardUnreadOrange
              ]}
            >
              {!viewedCards.includes('community') && <View style={[styles.unreadDot, { backgroundColor: '#f97316' }]} />}
              <View style={styles.insightCardHeader}>
                <Text style={styles.communityEmoji}>👥</Text>
                <Text style={[styles.insightCardTitle, viewedCards.includes('community') && styles.insightCardTitleViewed]}>Community</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('community') && styles.insightCardTextViewed]}>
                <Text style={[styles.communityCount, viewedCards.includes('community') && styles.communityCountViewed]}>2,341</Text> people did this tip today!
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Dynamic Motivation Modal */}
      <Modal
        visible={!!activeMotivationCard?.modalContent}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => { setActiveCard(null); setDynamicQuizAnswer(null); })}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => { setActiveCard(null); setDynamicQuizAnswer(null); })}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => { setActiveCard(null); setDynamicQuizAnswer(null); })}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            {activeMotivationCard?.modalContent && (
              <View style={styles.modalContent}>
                <View style={[styles.modalIcon, { backgroundColor: activeMotivationCard.iconBg }]}>
                  <Ionicons name={activeMotivationCard.icon} size={32} color={activeMotivationCard.iconColor} />
                </View>
                <Text style={styles.modalTitle}>{activeMotivationCard.modalContent.title}</Text>

                {/* Description / Question */}
                {activeMotivationCard.type === 'quiz' ? (
                   <Text style={styles.quizQuestion}>{activeMotivationCard.modalContent.question}</Text>
                ) : (
                   <Text style={styles.modalDescription}>{activeMotivationCard.modalContent.description}</Text>
                )}

                {/* Content Body */}
                {activeMotivationCard.type === 'quiz' ? (
                   <>
                     <View style={styles.quizOptions}>
                       {activeMotivationCard.modalContent.options?.map((option) => (
                         <TouchableOpacity
                           key={option.id}
                           onPress={() => setDynamicQuizAnswer(option.id)}
                           disabled={dynamicQuizAnswer !== null}
                           style={[
                             styles.quizOption,
                             dynamicQuizAnswer === null && styles.quizOptionDefault,
                             dynamicQuizAnswer !== null && option.correct && styles.quizOptionCorrect,
                             dynamicQuizAnswer === option.id && !option.correct && styles.quizOptionIncorrect,
                             dynamicQuizAnswer !== null && !option.correct && dynamicQuizAnswer !== option.id && styles.quizOptionFaded
                           ]}
                         >
                            <View style={[
                              styles.quizOptionLetter,
                              dynamicQuizAnswer === null && styles.quizOptionLetterDefault,
                              dynamicQuizAnswer !== null && option.correct && styles.quizOptionLetterCorrect,
                              dynamicQuizAnswer === option.id && !option.correct && styles.quizOptionLetterIncorrect
                            ]}>
                              <Text style={[
                                styles.quizOptionLetterText,
                                dynamicQuizAnswer !== null && option.correct && styles.quizOptionLetterTextCorrect
                              ]}>
                                {option.id === 'yes' ? 'A' : option.id === 'no' ? 'B' : option.id.toUpperCase()}
                              </Text>
                            </View>
                            <Text style={[
                              styles.quizOptionText,
                              dynamicQuizAnswer !== null && option.correct && styles.quizOptionTextCorrect
                            ]}>{option.text}</Text>
                             {dynamicQuizAnswer !== null && option.correct && (
                                <Ionicons name="checkmark" size={20} color="#22c55e" style={styles.quizCheckmark} />
                              )}
                         </TouchableOpacity>
                       ))}
                     </View>
                     {dynamicQuizAnswer && (
                        <View style={[styles.quizResult, styles.quizResultCorrect]}>
                           <Text style={styles.quizResultText}>
                             {activeMotivationCard.modalContent.answerExplanation}
                           </Text>
                        </View>
                     )}
                   </>
                ) : (
                   <View style={styles.modalBonus}>
                      <Text style={styles.modalBonusText}>
                        {activeMotivationCard.modalContent.mainText}
                      </Text>
                   </View>
                )}

                {/* Button */}
                <TouchableOpacity
                  onPress={() => closeSheet(() => { setActiveCard(null); setDynamicQuizAnswer(null); })}
                  style={styles.quizDoneButton}
                >
                  <LinearGradient
                    colors={[activeMotivationCard.iconColor, activeMotivationCard.iconColor]} // Or gradient
                    style={styles.quizDoneButtonGradient}
                  >
                    <Text style={styles.quizDoneButtonText}>{activeMotivationCard.modalContent.buttonText || 'Got it'}</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Help Menu Bottom Sheet */}
      <Modal
        visible={showHelpMenu}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); })}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); })}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              {helpView !== 'main' ? (
                <TouchableOpacity
                  onPress={() => {
                    if (helpView === 'resolution') {
                      setHelpView('sub_options');
                      setSelectedHelpSubOption(null);
                    } else {
                      setHelpView('main');
                      setSelectedHelpCategory(null);
                    }
                  }}
                  style={styles.closeButton}
                >
                  <Ionicons name="chevron-back" size={24} color="#374151" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); })}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}

              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.bottomSheetContent}>
              {helpView === 'main' && (
                <>
                  <Text style={styles.bottomSheetTitle}>How can we help?</Text>
                  <Text style={styles.bottomSheetSubtitle}>Pick an option to get moving</Text>

                  <View style={styles.helpOptions}>
                    {rootOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={option.action}
                        style={styles.helpOption}
                      >
                        <Text style={styles.helpOptionEmoji}>{option.emoji}</Text>
                        <View style={styles.helpOptionContent}>
                          <Text style={styles.helpOptionLabel}>
                            {option.id === 'start_now' ? (
                              <Text>
                                Help me get started <Text style={{fontStyle: 'italic'}}>now</Text>
                              </Text>
                            ) : option.label}
                          </Text>
                          <Text style={styles.helpOptionDescription}>{option.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {helpView === 'variants' && (
                <>
                  <Text style={styles.bottomSheetTitle}>Try something else</Text>
                  <Text style={styles.bottomSheetSubtitle}>Pick a variation that fits better today</Text>

                  <View style={styles.helpOptions}>
                    {tip.variants?.map((variant) => (
                      <TouchableOpacity
                        key={variant.id}
                        onPress={() => {
                          // In a real app, this would swap the active tip
                          // For now, we'll just close the menu and show a toast/alert or just close
                          closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); });
                          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }}
                        style={styles.helpOption}
                      >
                        <Text style={styles.helpOptionEmoji}>👉</Text>
                        <View style={styles.helpOptionContent}>
                          <Text style={styles.helpOptionLabel}>{variant.summary}</Text>
                          <Text style={styles.helpOptionDescription}>Tap to switch to this tip</Text>
                        </View>
                        <Ionicons name="swap-horizontal" size={20} color="#d1d5db" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {helpView === 'troubleshoot_categories' && (
                <>
                  <Text style={styles.bottomSheetTitle}>What's getting in the way?</Text>
                  <Text style={styles.bottomSheetSubtitle}>No judgment — let's figure it out together</Text>

                  <View style={styles.helpOptions}>
                    {helpCategories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => {
                          setSelectedHelpCategory(category.id);
                          setHelpView('sub_options');
                        }}
                        style={styles.helpOption}
                      >
                        <Text style={styles.helpOptionEmoji}>{category.emoji}</Text>
                        <View style={styles.helpOptionContent}>
                          <Text style={styles.helpOptionLabel}>{category.label}</Text>
                          <Text style={styles.helpOptionDescription}>{category.description}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {helpView === 'sub_options' && selectedHelpCategory && (
                <>
                  <Text style={styles.bottomSheetTitle}>
                    {helpCategories.find(c => c.id === selectedHelpCategory)?.label}
                  </Text>
                  <Text style={styles.bottomSheetSubtitle}>Select what best describes your situation</Text>

                  <View style={styles.helpOptions}>
                    {helpCategories.find(c => c.id === selectedHelpCategory)?.options.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => {
                          setSelectedHelpSubOption(option.id);
                          setHelpView('resolution');
                        }}
                        style={styles.helpOption}
                      >
                        <View style={styles.helpOptionContent}>
                          <Text style={styles.helpOptionLabel}>{option.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {helpView === 'resolution' && selectedHelpCategory && selectedHelpSubOption && (
                <>
                  <View style={styles.resolutionContainer}>
                    <View style={styles.resolutionIconContainer}>
                      <Ionicons name="bulb-outline" size={32} color="#f59e0b" />
                    </View>
                    <Text style={styles.resolutionTitle}>Try this</Text>
                    <Text style={styles.resolutionText}>
                      {helpCategories
                        .find(c => c.id === selectedHelpCategory)
                        ?.options.find(o => o.id === selectedHelpSubOption)
                        ?.content}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); })}
                    style={styles.quizDoneButton}
                  >
                    <LinearGradient
                      colors={['#f59e0b', '#d97706']}
                      style={styles.quizDoneButtonGradient}
                    >
                      <Text style={styles.quizDoneButtonText}>Got it, thanks!</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}

              {helpView === 'main' && (
                <TouchableOpacity
                  onPress={() => closeSheet(() => { setShowHelpMenu(false); resetHelpMenu(); })}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Never mind, I've got this</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Fun Fact Modal */}
      <Modal
        visible={activeCard === 'funfact'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="bulb" size={32} color="#f59e0b" />
              </View>
              <Text style={styles.modalTitle}>Did You Know?</Text>
              <Text style={styles.modalDescription}>
                Walking after eating can lower blood sugar levels by <Text style={styles.modalHighlight}>up to 30%</Text>. This happens because your muscles use glucose for energy during movement, helping to regulate insulin response.
              </Text>

              <View style={styles.modalBonus}>
                <Text style={styles.modalBonusText}>
                  💡 <Text style={styles.modalBonusBold}>Bonus:</Text> Even a 2-3 minute walk can make a noticeable difference!
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => closeSheet(() => setActiveCard(null))}
                  style={styles.modalSecondaryButton}
                >
                  <Text style={styles.modalSecondaryButtonText}>Got it</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => closeSheet(() => setActiveCard(null))}
                  style={styles.modalPrimaryButton}
                >
                  <LinearGradient
                    colors={['#f59e0b', '#d97706']}
                    style={styles.modalPrimaryButtonGradient}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Share this</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        visible={activeCard === 'quiz'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="school" size={32} color="#9333ea" />
              </View>
              <Text style={styles.modalTitle}>Quick Quiz</Text>
              <Text style={styles.quizQuestion}>
                When is the best time to take a walk for blood sugar benefits?
              </Text>

              <View style={styles.quizOptions}>
                {[
                  { id: 'a', text: 'Right before eating', correct: false },
                  { id: 'b', text: 'Within 30 min after eating', correct: true },
                  { id: 'c', text: '2 hours after eating', correct: false },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => setQuizAnswer(option.id)}
                    disabled={quizAnswer !== null}
                    style={[
                      styles.quizOption,
                      quizAnswer === null && styles.quizOptionDefault,
                      quizAnswer !== null && option.correct && styles.quizOptionCorrect,
                      quizAnswer === option.id && !option.correct && styles.quizOptionIncorrect,
                      quizAnswer !== null && !option.correct && quizAnswer !== option.id && styles.quizOptionFaded
                    ]}
                  >
                    <View style={[
                      styles.quizOptionLetter,
                      quizAnswer === null && styles.quizOptionLetterDefault,
                      quizAnswer !== null && option.correct && styles.quizOptionLetterCorrect,
                      quizAnswer === option.id && !option.correct && styles.quizOptionLetterIncorrect
                    ]}>
                      <Text style={[
                        styles.quizOptionLetterText,
                        quizAnswer !== null && option.correct && styles.quizOptionLetterTextCorrect
                      ]}>
                        {option.id.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[
                      styles.quizOptionText,
                      quizAnswer !== null && option.correct && styles.quizOptionTextCorrect
                    ]}>
                      {option.text}
                    </Text>
                    {quizAnswer !== null && option.correct && (
                      <Ionicons name="checkmark" size={20} color="#22c55e" style={styles.quizCheckmark} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {quizAnswer && (
                <View style={[styles.quizResult, quizAnswer === 'b' ? styles.quizResultCorrect : styles.quizResultIncorrect]}>
                  <Text style={[styles.quizResultText, quizAnswer === 'b' ? styles.quizResultTextCorrect : styles.quizResultTextIncorrect]}>
                    {quizAnswer === 'b'
                      ? "Nice work! Walking within 30 minutes after eating is most effective because that's when blood sugar peaks."
                      : "💡 Good try! The best time is within 30 minutes after eating, when blood sugar levels are at their peak."}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
                style={styles.quizDoneButton}
              >
                <LinearGradient
                  colors={['#9333ea', '#7c3aed']}
                  style={styles.quizDoneButtonGradient}
                >
                  <Text style={styles.quizDoneButtonText}>{quizAnswer ? 'Done' : 'Skip for now'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Pro Tip Modal */}
      <Modal
        visible={activeCard === 'protip'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#ccfbf1' }]}>
                <Ionicons name="heart" size={32} color="#14b8a6" />
              </View>
              <Text style={styles.modalTitle}>Pro Tip</Text>
              <Text style={styles.modalDescription}>
                Make your walk more enjoyable by pairing it with something you love!
              </Text>

              <View style={styles.proTipSuggestions}>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>🎧</Text>
                  <Text style={styles.proTipText}>Listen to a favorite podcast or audiobook</Text>
                </View>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>📞</Text>
                  <Text style={styles.proTipText}>Call a friend or family member</Text>
                </View>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>🎵</Text>
                  <Text style={styles.proTipText}>Create a special walking playlist</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.proTipDoneButton}
              >
                <LinearGradient
                  colors={['#14b8a6', '#0d9488']}
                  style={styles.proTipDoneButtonGradient}
                >
                  <Text style={styles.proTipDoneButtonText}>Great idea!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Community Modal */}
      <Modal
        visible={activeCard === 'community'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.communityModalEmoji}>👥</Text>
              <Text style={styles.modalTitle}>You're Not Alone!</Text>
              <Text style={styles.communityModalCount}>
                <Text style={styles.communityModalNumber}>2,341</Text> people completed this tip today
              </Text>

              <View style={styles.communityStats}>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>87%</Text>
                  <Text style={styles.communityStatLabel}>found it helpful</Text>
                </View>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>12k</Text>
                  <Text style={styles.communityStatLabel}>tried this week</Text>
                </View>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>4.8⭐</Text>
                  <Text style={styles.communityStatLabel}>avg rating</Text>
                </View>
              </View>

              <View style={styles.communityTestimonial}>
                <Text style={styles.communityTestimonialText}>
                  "Started doing this 2 weeks ago and I feel so much better after lunch. Game changer!"
                </Text>
                <Text style={styles.communityTestimonialAuthor}>— Sarah, Day 14</Text>
              </View>

              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.communityShareButton}
              >
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  style={styles.communityShareButtonGradient}
                >
                  <Text style={styles.communityShareButtonText}>Share my win</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Check-in Modal */}
      <Modal
        visible={showCheckIn}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setShowCheckIn(false))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setShowCheckIn(false))}
            />
          </Animated.View>
          <Animated.View style={[styles.checkInSheet, sheetAnimatedStyle]}>
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setShowCheckIn(false))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              style={styles.checkInScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <Text style={styles.checkInTitle}>Check-in</Text>
              <Text style={styles.checkInSubtitle}>
                How's today shaping up?
              </Text>

              {/* Feeling Section - First (multi-select) */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.feeling.label}
                </Text>
                <View style={styles.checkInFeelings}>
                  {checkInOptions.feeling.options.map((option) => {
                    const isSelected = selectedFeelings.includes(option.id);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => {
                          if (isSelected) {
                            setSelectedFeelings(selectedFeelings.filter(id => id !== option.id));
                          } else {
                            setSelectedFeelings([...selectedFeelings, option.id]);
                          }
                        }}
                        style={[
                          styles.checkInFeeling,
                          isSelected && styles.checkInFeelingSelected
                        ]}
                      >
                        <Ionicons
                          name={option.icon}
                          size={24}
                          color={isSelected ? '#f59e0b' : '#9ca3af'}
                        />
                        <Text style={[
                          styles.checkInFeelingLabel,
                          isSelected && styles.checkInFeelingLabelSelected
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* In Favor Section */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.inFavor.label}
                </Text>
                <View style={styles.checkInBubbles}>
                  {checkInOptions.inFavor.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleInFavor(option.id)}
                      style={[
                        styles.checkInBubble,
                        styles.checkInBubbleInFavor,
                        selectedInFavor.includes(option.id) && styles.checkInBubbleInFavorSelected
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={selectedInFavor.includes(option.id) ? '#059669' : '#9ca3af'}
                        style={styles.checkInBubbleIcon}
                      />
                      <Text style={[
                        styles.checkInBubbleLabel,
                        selectedInFavor.includes(option.id) && styles.checkInBubbleLabelInFavorSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Obstacles Section */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.obstacles.label}
                </Text>
                <View style={styles.checkInBubbles}>
                  {checkInOptions.obstacles.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleObstacle(option.id)}
                      style={[
                        styles.checkInBubble,
                        styles.checkInBubbleObstacle,
                        selectedObstacles.includes(option.id) && styles.checkInBubbleObstacleSelected
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={selectedObstacles.includes(option.id) ? '#ea580c' : '#9ca3af'}
                        style={styles.checkInBubbleIcon}
                      />
                      <Text style={[
                        styles.checkInBubbleLabel,
                        selectedObstacles.includes(option.id) && styles.checkInBubbleLabelObstacleSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={styles.checkInSaveContainer}>
              <TouchableOpacity
                onPress={handleSaveCheckIn}
                style={[
                  styles.checkInSaveButton,
                  totalCheckInSelections === 0 && styles.checkInSaveButtonDisabled
                ]}
                disabled={totalCheckInSelections === 0}
              >
                <LinearGradient
                  colors={totalCheckInSelections > 0 ? ['#fb923c', '#f59e0b'] : ['#d1d5db', '#d1d5db']}
                  style={styles.checkInSaveButtonGradient}
                >
                  <Text style={styles.checkInSaveButtonText}>
                    {totalCheckInSelections > 0
                      ? `Save Check-in (${totalCheckInSelections})`
                      : 'Select at least one'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => closeSheet(() => setShowCheckIn(false))}
                style={styles.checkInSkipButton}
              >
                <Text style={styles.checkInSkipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Quick Complete Modal */}
      <QuickCompleteModal
        visible={showQuickComplete}
        onClose={() => setShowQuickComplete(false)}
        onQuickComplete={(note) => {
          onQuickComplete(note);
          setShowQuickComplete(false);
        }}
      />

      {/* Tip History Modal */}
      <TipHistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        tips={modalTips}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
    bottom: -10,
  },

  // Main Card Styles
  mainCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  visualArea: {
    position: 'relative',
    paddingTop: 16,
    borderRadius: 24,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  celebrationGradient: {
    padding: 24,
    alignItems: 'center',
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
  },
  metaInfo: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 6,
  },
  decorCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
  },
  decorCircle1: {
    top: 16,
    left: 16,
    width: 80,
    height: 80,
  },
  decorCircle2: {
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
  },
  decorCircle3: {
    top: '50%',
    left: '50%',
    marginTop: -80,
    marginLeft: -80,
    width: 160,
    height: 160,
  },
  actionButtonsContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  // Primary "I did it" button - large, left of center
  primaryButtonWrapper: {
    width: 160,
    height: 160,
    position: 'relative',
    marginLeft: -50,
  },
  primaryProgressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  primaryButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  primaryButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 76,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  //work on this
  // Secondary "Help" button - small, positioned lower-right of primary
  secondaryButtonWrapper: {
    position: 'absolute',
    right: -75,
    bottom: -20,
    width: 72,
    height: 72,
  },
  secondaryButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 3,
  },
  secondaryButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  secondaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    marginTop: 2,
  },
  // Legacy styles kept for completed state
  actionButtonWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  actionButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  actionButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    marginBottom: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  completedButtonWrapper: {
    width: 160,
    height: 160,
  },
  completedButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 4,
  },
  actionHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 16,
  },

  // Content Area Styles (legacy - keeping for reference)
  contentArea: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  todaysFocus: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contentLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  contentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  contentLinkText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  contentLinkDivider: {
    color: '#d1d5db',
    fontSize: 12,
  },
  tipDescription: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tipDetailsExtra: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 22,
  },

  // NEW: Tip content in header styles
  tipContentInHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  todaysFocusHeader: {
    color: '#9a3412',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  tipTitleHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 28,
  },
  contentLinksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  contentLinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
  },
  contentLinkTextHeader: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  contentLinkDividerHeader: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  planHeaderInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  planTitleHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#78350f',
  },
  backButtonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(120,53,15,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  backButtonTextHeader: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '500',
  },
  tipDescriptionHeader: {
    color: '#78350f',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  tipDetailsExtraHeader: {
    color: '#92400e',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  planStepsHeader: {
    width: '100%',
    gap: 8,
  },
  planStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(120,53,15,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  planStepIndicatorHeader: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planStepCompleteHeader: {
    backgroundColor: '#dcfce7',
  },
  planStepCurrentHeader: {
    backgroundColor: '#fff',
  },
  planStepPendingHeader: {
    backgroundColor: 'rgba(120,53,15,0.1)',
  },
  planStepCheckmarkHeader: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '700',
  },
  planStepNumberHeader: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  planStepNumberPendingHeader: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '600',
  },
  planStepTextHeader: {
    color: '#78350f',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  planStepTextPendingHeader: {
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  planPersonalizationContainer: {
    width: '100%',
    marginTop: 8,
  },
  noPlanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  noPlanText: {
    color: '#78350f',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  planButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginLeft: 2,
  },

  // Secondary actions row (Details, Plan, Help)
  secondaryActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  secondaryActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(120,53,15,0.1)',
    borderRadius: 20,
  },
  secondaryActionText: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryActionDivider: {
    color: '#c2410c',
    fontSize: 10,
  },

  // Primary action container
  primaryActionContainer: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 8,
  },

  // Big primary button styles
  primaryButtonWrapperBig: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonOuterBig: {
    width: 124,
    height: 124,
    borderRadius: 62,
    padding: 4,
    backgroundColor: 'rgba(232,93,4,0.25)',
  },
  primaryButtonInnerBig: {
    flex: 1,
    borderRadius: 60,
    overflow: 'hidden',
  },
  primaryButtonGradientBig: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonTextBig: {
    color: '#ea580c',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  primaryButtonTextBigPop: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  primaryProgressRingBig: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  completedButtonOnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 30,
  },
  completedButtonTextOnGradient: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: '700',
  },
  actionHintOnGradient: {
    color: '#92400e',
    fontSize: 12,
    marginTop: 12,
  },
  viewPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewPlanText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  planSteps: {
    gap: 8,
  },
  planStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planStepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planStepComplete: {
    backgroundColor: '#dcfce7',
  },
  planStepCurrent: {
    backgroundColor: '#ffedd5',
  },
  planStepPending: {
    backgroundColor: '#f3f4f6',
  },
  planStepCheckmark: {
    color: '#16a34a',
    fontSize: 12,
  },
  planStepNumber: {
    color: '#ea580c',
    fontSize: 12,
    fontWeight: '700',
  },
  planStepNumberPending: {
    color: '#9ca3af',
    fontSize: 12,
  },
  planStepText: {
    color: '#4b5563',
    fontSize: 14,
  },
  planStepTextPending: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // Insights Section
  insightsSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  insightsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  insightsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  // Hero Card - Featured first card (same width as others, but colorful)
  heroCard: {
    width: 160,
    minHeight: 160,
    borderRadius: 16,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  heroCardGradient: {
    flex: 1,
    padding: 16,
  },
  heroCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroCardLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroCardPlusButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardTitleOrange: {
    color: '#9a3412',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardTitleCheckedIn: {
    color: '#047857',
  },
  heroCardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  heroCardSubtitleOrange: {
    color: '#c2410c',
    fontSize: 12,
  },
  heroCardSubtitleCheckedIn: {
    color: '#059669',
    fontSize: 12,
    marginTop: 8,
  },
  heroCardLabelOrange: {
    color: '#9a3412',
  },
  heroCardLabelCheckedIn: {
    color: '#047857',
  },
  heroCardPlusButtonCheckedIn: {
    backgroundColor: '#d1fae5',
  },
  heroCardCheckedIn: {
    shadowColor: '#10b981',
  },
  checkInIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  // Icon bubbles on the card - color coded by section
  checkInCardIconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInCardIconFeeling: {
    backgroundColor: '#fef3c7', // amber/yellow
  },
  checkInCardIconInFavor: {
    backgroundColor: '#d1fae5', // green
  },
  checkInCardIconObstacle: {
    backgroundColor: '#fee2e2', // red/pink
  },
  checkInCardMoreText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#d97706', // amber for feelings
  },
  checkInCardIconInFavorMoreText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#059669',
  },
  checkInCardIconObstacleMoreText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#dc2626',
  },
  // Icon bubbles in the modal (keep green/orange distinction)
  checkInIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInIconBubbleConcern: {
    backgroundColor: '#ffedd5',
  },
  checkInIconBubbleFeeling: {
    backgroundColor: '#fef3c7',
  },
  checkInIconBubbleMore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInIconBubbleMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  heroProgressContainer: {
    marginTop: 'auto',
  },
  heroProgressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  // Regular insight cards
  insightCard: {
    width: 160,
    minHeight: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightCardUnread: {
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  insightCardUnreadPurple: {
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  insightCardUnreadTeal: {
    borderWidth: 2,
    borderColor: '#99f6e4',
  },
  insightCardUnreadOrange: {
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  insightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightCardTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  insightCardTitleViewed: {
    color: '#6b7280',
  },
  insightCardText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  insightCardTextViewed: {
    color: '#9ca3af',
  },
  communityEmoji: {
    fontSize: 20,
  },
  communityCount: {
    fontWeight: '700',
    color: '#f97316',
  },
  communityCountViewed: {
    color: '#fdba74',
  },
  quizButton: {
    backgroundColor: '#9333ea',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  quizButtonViewed: {
    backgroundColor: '#c4b5fd',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  // Bottom Sheet & Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  helpOptions: {
    gap: 8,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  helpOptionEmoji: {
    fontSize: 24,
  },
  helpOptionContent: {
    flex: 1,
  },
  helpOptionLabel: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  helpOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  resolutionContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    marginBottom: 24,
  },
  resolutionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resolutionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
  },
  resolutionText: {
    fontSize: 16,
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 24,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },

  // Modal Content Styles
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalHighlight: {
    fontWeight: '700',
    color: '#f59e0b',
  },
  modalBonus: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  modalBonusText: {
    fontSize: 14,
    color: '#92400e',
  },
  modalBonusBold: {
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalPrimaryButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Quiz Modal Styles
  quizQuestion: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  quizOptions: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quizOptionDefault: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quizOptionCorrect: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#86efac',
  },
  quizOptionIncorrect: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  quizOptionFaded: {
    backgroundColor: '#f9fafb',
    opacity: 0.5,
  },
  quizOptionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizOptionLetterDefault: {
    backgroundColor: '#e9d5ff',
  },
  quizOptionLetterCorrect: {
    backgroundColor: '#bbf7d0',
  },
  quizOptionLetterIncorrect: {
    backgroundColor: '#fecaca',
  },
  quizOptionLetterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
  },
  quizOptionLetterTextCorrect: {
    color: '#15803d',
  },
  quizOptionText: {
    flex: 1,
    fontWeight: '500',
    color: '#374151',
  },
  quizOptionTextCorrect: {
    color: '#15803d',
  },
  quizCheckmark: {
    marginLeft: 'auto',
  },
  quizResult: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  quizResultCorrect: {
    backgroundColor: '#dcfce7',
  },
  quizResultIncorrect: {
    backgroundColor: '#fef3c7',
  },
  quizResultText: {
    fontSize: 14,
  },
  quizResultTextCorrect: {
    color: '#166534',
  },
  quizResultTextIncorrect: {
    color: '#92400e',
  },
  quizDoneButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quizDoneButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  quizDoneButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Pro Tip Modal Styles
  proTipSuggestions: {
    width: '100%',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  proTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  proTipEmoji: {
    fontSize: 24,
  },
  proTipText: {
    flex: 1,
    fontSize: 14,
    color: '#134e4a',
  },
  proTipDoneButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  proTipDoneButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  proTipDoneButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Community Modal Styles
  communityModalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  communityModalCount: {
    fontSize: 16,
    color: '#4b5563',
  },
  communityModalNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f97316',
  },
  communityStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  communityStatItem: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  communityStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ea580c',
  },
  communityStatLabel: {
    fontSize: 12,
    color: '#9a3412',
    marginTop: 4,
  },
  communityTestimonial: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  communityTestimonialText: {
    fontSize: 14,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  communityTestimonialAuthor: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  communityShareButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  communityShareButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  communityShareButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Check-in Modal Styles
  checkInSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  checkInScrollContent: {
    padding: 20,
  },
  checkInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  checkInSection: {
    marginBottom: 24,
  },
  checkInSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  checkInBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkInBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkInBubbleIcon: {
    marginRight: 6,
  },
  checkInBubbleInFavor: {
    backgroundColor: '#f0fdf4',
  },
  checkInBubbleInFavorSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#4ade80',
  },
  checkInBubbleObstacle: {
    backgroundColor: '#fff7ed',
  },
  checkInBubbleObstacleSelected: {
    backgroundColor: '#ffedd5',
    borderColor: '#fb923c',
  },
  checkInBubbleLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  checkInBubbleLabelInFavorSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  checkInBubbleLabelObstacleSelected: {
    color: '#ea580c',
    fontWeight: '600',
  },
  checkInFeelings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkInFeeling: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    width: 62,
  },
  checkInFeelingSelected: {
    backgroundColor: '#ffedd5',
    borderWidth: 2,
    borderColor: '#fb923c',
  },
  checkInFeelingLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  checkInFeelingLabelSelected: {
    color: '#ea580c',
    fontWeight: '600',
  },
  checkInSaveContainer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  checkInSaveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkInSaveButtonDisabled: {
    opacity: 0.7,
  },
  checkInSaveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkInSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkInSkipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkInSkipButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
