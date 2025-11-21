import { View, Text, Pressable, PressableProps } from 'react-native';
import React from 'react';
import Animated, {
  AnimatedProps,
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  interpolate,
  interpolateColor,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
interface PaginationIndicatorProps {
  total: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}
interface ButtonProps extends AnimatedProps<PressableProps> {
  // pass any additional props if needed
}
interface PaginationProps {
  selectedIndex: number;
  total: number;
}

const _itemWidth = 100;
const _itemSpacing = 8;
const _buttonHeight = 42;
const _dotContainer = 24;
const _dotSize = _dotContainer / 3;
const _dotSpacing = 12;
const _ativeDotColor = '#fff';
const _inactiveDotColor = '#aaa';
const DOT_STEP = _dotContainer + _dotSpacing;
const _primaryButton = '#0ea5e9';
const _secondaryButton = '#e2e8f0';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
const Onboarding = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <PaginationIndicator
        total={4}
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </View>
  );
};

const Button: React.FC<ButtonProps> = ({ children, style, ...rest }) => {
  return (
    <AnimatedPressable
      style={[
        {
          width: _itemWidth,
          height: _buttonHeight,
          borderRadius: _buttonHeight / 2,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: _itemSpacing * 2,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.16,
          shadowRadius: 18,
        },
        style,
      ]}
      entering={FadeInLeft.springify().damping(80).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
      layout={layoutTransition}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};

const PaginationIndication = ({
  animation,
}: {
  animation: SharedValue<number>;
}) => {
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 750 }),
        withTiming(1, { duration: 750 }),
      ),
      -1,
      true,
    );
  }, [pulse]);

  const styles = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(pulse.value, [1, 1.06], [0.18, 0.28]),
      width: DOT_STEP + DOT_STEP * animation.value,
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: DOT_STEP,
          height: _dotContainer,
          borderRadius: _dotContainer,
          top: 0,
          left: 0,
          backgroundColor: '#44ae1dff',
          borderWidth: 1,
          borderColor: '#22d3ee',
          shadowColor: '#22d3ee',
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
        },
        styles,
      ]}
    ></Animated.View>
  );
};
const Pagination: React.FC<PaginationProps> = ({ selectedIndex, total }) => {
  const animation = useDerivedValue(() => {
    return withSpring(selectedIndex, { damping: 80, stiffness: 200 });
  });

  const Dot = ({ index, isLast }: { index: number; isLast: boolean }) => {
    const styles = useAnimatedStyle(() => {
      const proximity = 1 - Math.min(1, Math.abs(animation.value - index));
      const scale = 0.85 + 0.35 * proximity;
      const opacity = 0.45 + 0.55 * proximity;
      return {
        backgroundColor: interpolateColor(
          animation.value,
          [index - 1, index, index + 1],
          [_inactiveDotColor, _ativeDotColor, _ativeDotColor],
        ),
        transform: [{ scale }],
        opacity,
      };
    });
    return (
      <View
        style={[
          {
            width: _dotContainer,
            height: _dotContainer,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: isLast ? 0 : _dotSpacing,
          },
        ]}
        key={index}
      >
        <Animated.View
          key={index}
          style={[
            {
              width: _dotSize,
              height: _dotSize,
              borderRadius: _dotSize / 2,
            },
            styles,
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: _dotSpacing / 2,
          position: 'relative',
        }}
      >
        <PaginationIndication animation={animation} />
        {[...Array(total).keys()].map((_, index) => {
          return <Dot index={index} key={index} isLast={index === total - 1} />;
        })}
      </View>
    </View>
  );
};
const PaginationIndicator: React.FC<PaginationIndicatorProps> = ({
  total,
  selectedIndex,
  onIndexChange,
}) => {
  return (
    <View
      style={{
        paddingHorizontal: _itemSpacing,
        gap: _itemSpacing * 2,
      }}
    >
      <Pagination selectedIndex={selectedIndex} total={total} />
      <View style={{ flexDirection: 'row', marginTop: _itemSpacing }}>
        {selectedIndex > 0 && (
          <Button
            onPress={() => onIndexChange(selectedIndex - 1)}
            disabled={selectedIndex === 0}
            style={{ backgroundColor: _secondaryButton }}
          >
            <Text>Back</Text>
          </Button>
        )}

        <Button
          onPress={() => onIndexChange(selectedIndex + 1)}
          disabled={selectedIndex === total - 1}
          style={{ backgroundColor: _primaryButton, flex: 1 }}
        >
          <Animated.Text
            key={selectedIndex}
            style={{ color: 'white' }}
            layout={layoutTransition}
            entering={FadeInDown.springify().damping(80).stiffness(200)}
            exiting={FadeOutUp.springify().damping(80).stiffness(200)}
          >
            {selectedIndex < total - 1 ? 'Continue' : 'Finish'}
          </Animated.Text>
        </Button>
      </View>
    </View>
  );
};

export default Onboarding;
