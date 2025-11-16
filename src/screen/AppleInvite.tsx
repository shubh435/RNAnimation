import React from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Marquee } from '@animatereactnative/marquee';
import { Stagger } from '@animatereactnative/stagger';
import { Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface ImageItem {
  description: string;
  'image-url': string;
}
const imagesJson: ImageItem[] = [
  {
    description: 'Lady with a Teddy',
    'image-url':
      'https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg',
  },
  {
    description: 'Girl with camera',
    'image-url':
      'https://images.pexels.com/photos/3812944/pexels-photo-3812944.jpeg',
  },
  {
    description: 'Beautiful Girl with Glasses',
    'image-url':
      'https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg',
  },
  {
    description: 'Redhead with frackles',
    'image-url':
      'https://images.pexels.com/photos/3228213/pexels-photo-3228213.jpeg',
  },
  {
    description: 'Girl in black dress',
    'image-url':
      'https://images.pexels.com/photos/1385472/pexels-photo-1385472.jpeg',
  },
  {
    description: 'Girl Sitting on Chair',
    'image-url':
      'https://images.pexels.com/photos/4725133/pexels-photo-4725133.jpeg',
  },
];
const { width } = Dimensions.get('window');
const _itemWidth = width * 0.7;
const _itemHeight = _itemWidth * 1.4;
const _spacing = 16;
const _itemSize = _itemWidth + _spacing;
const AppleInvite = () => {
  const offset = useSharedValue(0);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const backgroundEntering = React.useMemo(
    () => FadeIn.duration(1000).build(),
    [],
  );
  const backgroundExiting = React.useMemo(
    () => FadeOut.duration(1000).build(),
    [],
  );
  const marqueeEntering = React.useMemo(
    () =>
      FadeIn.delay(500)
        .duration(1000)
        .easing(Easing.elastic(0.9))
        .withInitialValues({
          transform: [{ translateY: -_itemHeight / 2 }],
        })
        .build(),
    [],
  );

  useAnimatedReaction(
    () => {
      const index =
        ((offset.value + width / 2) / _itemSize) % imagesJson.length;
      return Math.abs(Math.floor(index));
    },
    currentOffset => {
      runOnJS(setActiveIndex)(currentOffset);
    },
  );

  const Item = ({
    item,
    index,
    offset,
  }: {
    item: ImageItem;
    index: number;
    offset: SharedValue<number>;
  }) => {
    const _styles = useAnimatedStyle(() => {
      const itemPosition = index * _itemSize - width / 2 - _itemSize / 2;
      const totalSize = imagesJson.length * _itemSize;
      const range =
        ((itemPosition - (offset.value + totalSize * 1000)) % totalSize) +
        width +
        _itemSize / 2;

      return {
        transform: [
          {
            rotate: `${interpolate(
              range,
              [-_itemSize, (width - _itemSize) / 2, width],
              [-3, 0, 3],
            )}deg`,
          },
        ],
      };
    });
    return (
      <Animated.View
        key={index}
        style={[{ width: _itemWidth, height: _itemHeight }, _styles]}
      >
        <Image
          source={{ uri: item['image-url'] }}
          style={{ flex: 1, borderRadius: 16 }}
        />
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <View style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}>
          <Animated.Image
            key={imagesJson[activeIndex]['image-url']}
            source={{ uri: imagesJson[activeIndex]['image-url'] }}
            style={{
              flex: 1,
            }}
            blurRadius={50}
            entering={backgroundEntering}
            exiting={backgroundExiting}
          />
        </View>

        <Marquee spacing={_spacing} position={offset} speed={0.5}>
          <Animated.View
            style={{ flexDirection: 'row', gap: _spacing }}
            entering={marqueeEntering}
          >
            {imagesJson.map((item, index) => (
              <Item
                key={`${item['image-url']}-${index}`}
                item={item}
                index={index}
                offset={offset}
              />
            ))}
          </Animated.View>
        </Marquee>

        <Stagger initialEnteringDelay={1000} duration={500} stagger={100}>
          <View
            style={{
              // paddingHorizontal: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'regular',
                opacity: 0.8,
              }}
            >
              Welcome to
            </Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff' }}>
              Apple Invite
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'regular',
                opacity: 0.8,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              An example of how to create an Apple Invite style animation using
              Reanimated 2 and Animate React Native
            </Text>
          </View>
        </Stagger>
      </View>
    </GestureHandlerRootView>
  );
};

export default AppleInvite;
