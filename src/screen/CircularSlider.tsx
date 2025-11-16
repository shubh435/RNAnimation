import { View, Image, Dimensions, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { ImageItem, imagesJson } from '../data';
import Animated, {
  clamp,
  FadeIn,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const _itemWidth = width * 0.7;
const _spacing = 12;
const _itemSize = _itemWidth * 0.24;
const _itemTotalSize = _itemSize + _spacing;
const CircularSlider = () => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler(e => {
    scrollX.value = clamp(
      e.contentOffset.x / _itemTotalSize,
      0,
      imagesJson.length - 1,
    );
    const index = Math.round(scrollX.value);
    if (index !== activeIndex) {
      runOnJS(setActiveIndex)(index);
    }
  });

  const CouroselItem = ({
    item,
    index,
    scrollX,
  }: {
    item: ImageItem;
    index: number;
    scrollX: SharedValue<number>;
  }) => {
    const url = item['image-url'];
    const styles = useAnimatedStyle(() => {
      return {
        borderWidth: 4,
        borderColor: interpolateColor(
          scrollX.value,
          [index - 1, index, index + 1],
          ['transparent', 'white', 'transparent'],
        ),
        transform: [
          {
            translateY: interpolate(
              scrollX.value,
              [index - 1, index, index + 1],
              [_itemSize / 3, 0, _itemSize / 3],
            ),
          },
        ],
      };
    });
    return (
      <Animated.View
        style={[
          { height: _itemSize, width: _itemSize, borderRadius: _itemSize / 2 },
          styles,
        ]}
      >
        <Image
          source={{ uri: url }}
          style={{ flex: 1, borderRadius: _itemSize / 2 }}
        />
      </Animated.View>
    );
  };

  return (
    <View
      style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#000' }}
    >
      <View style={[StyleSheet.absoluteFill]}>
        <Animated.Image
          key={imagesJson[activeIndex]['image-url']}
          source={{ uri: imagesJson[activeIndex]['image-url'] }}
          style={{ flex: 1 }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      </View>
      <Animated.FlatList
        data={imagesJson}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CouroselItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item, index) => index.toString()}
        style={{ flexGrow: 0, height: _itemSize * 2 }}
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (width - _itemSize) / 2,
        }}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60} // 60 fps
        snapToInterval={_itemTotalSize}
        decelerationRate="fast"
      />
    </View>
  );
};

export default CircularSlider;
