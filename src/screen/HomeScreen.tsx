import type { EdgeInsets } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
const LogoImage = require('../assets/logo.png');
type MainScreenProps = {
  safeAreaInsets?: EdgeInsets;
};

const HERO_IMAGE_URI = LogoImage;
type ListOfNavigation = {
  id: number;
  title: string;
  link: string;
  category: string;
  description: string;
};
const listOfNavigation: ListOfNavigation[] = [
  {
    id: 1,
    title: 'Apple invite carosel onboarding',
    link: 'AppleInvite',
    category: 'Onboarding',
    description:
      'A polished onboarding inspired by the Apple event invite animation.',
  },
  {
    id: 2,
    title: 'Circular slider with carousel',
    link: 'CircularSlider',
    category: 'Onboarding',
    description:
      'An engaging circular slider combined with a carousel effect for onboarding screens.',
  },
];

function HomeScreen({ navigation }: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#0b0c10' : '#f7f7f7';
  const textColor = isDarkMode ? '#f3f6f9' : '#1a1a1a';
  const secondaryTextColor = isDarkMode ? '#b2becd' : '#4c5c68';
  const cardBackground = isDarkMode ? '#11141c' : '#ffffff';
  const accentColor = isDarkMode ? '#6ce2df' : '#2563eb';
  const [activeTab, setActiveTab] = useState('All');
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    spinAnim.setValue(0);
    pulseAnim.setValue(0);
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );

    spinLoop.start();
    pulseLoop.start();

    return () => {
      spinLoop.stop();
      pulseLoop.stop();
    };
  }, [spinAnim, pulseAnim]);

  const heroRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const heroScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const tabs = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(listOfNavigation.map(item => item.category)),
    );
    return ['All', ...uniqueCategories];
  }, []);
  const filteredNavigation = useMemo(() => {
    if (activeTab === 'All') {
      return listOfNavigation;
    }
    return listOfNavigation.filter(item => item.category === activeTab);
  }, [activeTab]);
  const handleNavigaiton = (link: string) => {
    navigation.navigate(link);
  };
  const _renderItem = (item: ListOfNavigation) => {
    return (
      <TouchableOpacity
        style={[styles.navCard, { backgroundColor: cardBackground }]}
        activeOpacity={0.85}
        onPress={() => handleNavigaiton(item.link)}
      >
        <View style={styles.navCardHeader}>
          <Text style={[styles.navCardCategory, { color: secondaryTextColor }]}>
            {item.category}
          </Text>
        </View>
        <Text style={[styles.navCardTitle, { color: textColor }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.navCardDescription, { color: secondaryTextColor }]}
        >
          {item.description}
        </Text>
        <Text style={[styles.navCardCta, { color: accentColor }]}>
          View demo →
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.heading, { color: textColor }]}>
          Welcome to Animation Starter
        </Text>
        <Text style={[styles.subheading, { color: secondaryTextColor }]}>
          Explore curated animation demos and interaction patterns.
        </Text>
        <Animated.Image
          accessibilityRole="image"
          accessibilityLabel="React Native logo"
          resizeMode="contain"
          source={HERO_IMAGE_URI}
          style={[
            styles.heroImage,
            {
              transform: [{ rotate: heroRotation }, { scale: heroScale }],
            },
          ]}
        />

        <FlatList
          data={filteredNavigation}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => _renderItem(item)}
          contentContainerStyle={styles.navList}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={[styles.emptyState, { color: secondaryTextColor }]}>
              Nothing here yet. Check back soon!
            </Text>
          }
        />
      </ScrollView>
    </View>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 32,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroImage: {
    width: 220,
    height: 220,
    // tintColor: '#61dafb',
    marginBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  tabButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  navList: {
    width: '100%',
  },
  navCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16,
  },
  navCardHeader: {
    marginBottom: 8,
  },
  navCardCategory: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  navCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  navCardCta: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    textAlign: 'center',
    paddingVertical: 32,
  },
  copy: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
});
