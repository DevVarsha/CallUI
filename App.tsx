import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  PanResponder,
  SafeAreaView,
} from 'react-native';
import Scale from './Scale';

export default function App() {
  const pan = useRef(new Animated.ValueXY()).current;
  const imageTranslation = useRef(new Animated.Value(-10)).current;

  const [response, setResponse] = useState('');
  const [arrowColor, setAnimation] = useState(new Animated.Value(0));
  const [isDragFinished, setIsDragFinished] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      if (isDragFinished == false) {
        if (gesture.dy < 180 && gesture.dy > -180) {
          pan.setValue({x: 0, y: gesture.dy});
        }
      }
    },
    onPanResponderRelease: (event, gesture) => {
      if (isDragFinished == true) {
        return;
      }
      if (gesture.dy > 120) {
        setIsDragFinished(true);
        setResponse('Picked');
        Animated.spring(
          pan,
          {
            toValue: {x: 0, y: 180},
            useNativeDriver: false,
          }, // Back to zero
        ).start();
      } else if (gesture.dy < -120) {
        setIsDragFinished(true);
        setResponse('Declined');
        Animated.spring(
          pan,
          {
            toValue: {x: 0, y: -180},
            useNativeDriver: false,
          }, // Back to zero
        ).start();
      } else {
        console.log('isDragFinished', isDragFinished);

        Animated.spring(
          pan,
          {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }, // Back to zero
        ).start();
      }
    },
  });

  function animateImageTranslation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageTranslation, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(imageTranslation, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }

  const animateArrowColor = () => {
    Animated.timing(arrowColor, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(arrowColor, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        animateArrowColor();
      });
    });
  };

  const boxInterpolation = arrowColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#72c8be', '#fff'],
  });

  const animatedStyle = {
    tintColor: boxInterpolation,
  };

  useEffect(() => {
    if (isDragFinished) {
      Animated.timing(imageTranslation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
      imageTranslation.stopAnimation();
    }
  }, [isDragFinished]);

  useEffect(() => {
    animateImageTranslation();
    animateArrowColor();
  }, []);

  return (
    <View style={styles.mainView}>
      <View style={{height: 400, alignItems: 'center'}}>
        <Text style={styles.name}>Varsha soni</Text>
        <Text style={styles.incoming}>incoming call...</Text>
      </View>
      <View
        style={[
          styles.bottomCircle,
          {
            backgroundColor: 'green',
          },
        ]}></View>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Animated.Image
          style={[
            styles.arrow,
            {
              ...animatedStyle,
              transform: [{rotate: '180deg'}],
              marginBottom: 70,
            },
          ]}
          source={require('./assets/down-arrow.png')}
        />
        <Animated.Image
          {...panResponder.panHandlers}
          style={[
            pan.getLayout(),
            styles.image,
            {transform: [{translateY: imageTranslation}]},
          ]}
          source={require('./assets/phone.png')}
        />
        <Animated.Image
          style={[styles.arrow, {...animatedStyle, marginTop: 70}]}
          source={require('./assets/down-arrow.png')}
        />
      </View>

      <View
        style={[
          styles.bottomCircle,
          {
            backgroundColor: 'red',
            position: 'relative',
            zIndex: -99,
          },
        ]}></View>
      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#212325',
  },
  image: {
    alignSelf: 'center',
    height: Scale(80),
    width: Scale(80),
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  arrow: {
    alignSelf: 'center',
    height: Scale(40),
    width: Scale(40),
  },
  bottomCircle: {
    height: Scale(60),
    width: Scale(60),
    borderWidth: Scale(2),
    borderColor: '#2b2c2e',
    borderRadius: Scale(70),
    alignSelf: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 100,
  },
  incoming: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    marginTop: 10,
  },
});
