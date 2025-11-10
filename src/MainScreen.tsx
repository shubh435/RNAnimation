import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppleInvite from './screen/AppleInvite';

type MainScreenProps = {
  safeAreaInsets?: EdgeInsets;
};

const HERO_IMAGE_URI = 'https://reactnative.dev/img/tiny_logo.png';
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
    description: 'A polished onboarding inspired by the Apple event invite animation.',
  },
];

// In App.js in a new project

function HomeScreen({ navigation }: any) {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#0b0c10' : '#f7f7f7';
  const textColor = isDarkMode ? '#f3f6f9' : '#1a1a1a';
  const secondaryTextColor = isDarkMode ? '#b2becd' : '#4c5c68';
  const cardBackground = isDarkMode ? '#11141c' : '#ffffff';
  const accentColor = isDarkMode ? '#6ce2df' : '#2563eb';
  const [activeTab, setActiveTab] = useState('All');
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
        <Image
          accessibilityRole="image"
          accessibilityLabel="React Native logo"
          resizeMode="contain"
          source={{ uri: HERO_IMAGE_URI }}
          style={styles.heroImage}
        />
        <View style={styles.tabBar}>
          {tabs.map(tab => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabButton,
                  {
                    borderColor: isActive ? accentColor : 'transparent',
                    backgroundColor: isActive
                      ? `${accentColor}22`
                      : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonLabel,
                    { color: isActive ? accentColor : secondaryTextColor },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

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

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AppleInvite" component={AppleInvite} />
    </Stack.Navigator>
  );
}

function MainScreen() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
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

export default MainScreen;
