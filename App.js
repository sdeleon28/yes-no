import * as React from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components';
import { ScreenOrientation } from 'expo';
import { StatusBar } from 'react-native';
import { Text, View } from 'react-native';
import no from './assets/no.png';
import yes from './assets/yes.png';

const pallette = {
  background: 'aquamarine',
  no: 'red',
  yes: 'green',
};

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${() => pallette.background};
`;

const NoBox = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color: ${() => pallette.no};
`;

const YesBox = styled(Animated.View)`
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background-color: ${() => pallette.yes};
`;

const ButtonBox = styled(Animated.View)`
  flex: 1;
  width: 50%;
`;

const ButtonHitArea = styled.TouchableWithoutFeedback`
  flex: 1;
  align-self: stretch;
`;

const Button = ({ style, onPress, children }) => (
  <ButtonBox style={style}>
    <ButtonHitArea onPress={onPress}>
      {children}
    </ButtonHitArea>
  </ButtonBox>
);

const Image = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: contain;
`;

const where = new Animated.Value(0.5);
const yesScaling = new Animated.Value(1);
const noScaling = new Animated.Value(1);

export default function App() {
  const [expanded, setExpanded] = React.useState(false);

  const leftWidthInterpolation = where.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0%', '50%', '100%'],
  });

  const rightWidthInterpolation = where.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['100%', '50%', '0%'],
  });

  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }, []);

  const selectOption = option => {
    const toValue = option === 'yes' ? 0 : 1;
    const scaling = option === 'yes' ? yesScaling : noScaling;
    const shrink = Animated.timing(scaling, {
      toValue: 0.8,
      easing: Easing.bounce,
      duration: 100,
      useNativeDriver: true,
    });
    const expand = Animated.spring(where, {
      toValue,
      duration: 500,
    });
    Animated.sequence([
      shrink,
      expand,
    ]).start(() => { setExpanded(true); })
  };

  const reset = () => {
    where.setValue(0.5);
    yesScaling.setValue(1);
    noScaling.setValue(1);
    setExpanded(false);
  };

  const selectNo = () => {
    if (!expanded) {
      selectOption('no');
    } else {
      reset();
    }
  };

  const selectYes = () => {
    if (!expanded) {
      selectOption('yes');
    } else {
      reset();
    }
  };

  return (
    <>
      <StatusBar hidden />
      <Container>
        <NoBox style={{ width: leftWidthInterpolation }}>
          <Button style={{ transform: [ { scale: noScaling } ]}} onPress={selectNo}>
            <Image source={no} />
          </Button>
        </NoBox>
        <YesBox style={{ width: rightWidthInterpolation }}>
          <Button style={{ transform: [ { scale: yesScaling } ]}} onPress={selectYes}>
            <Image source={yes} />
          </Button>
        </YesBox>
      </Container>
    </>
  );
}
