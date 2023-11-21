import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Animated,
  PanResponder,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Scale from './Scale';
import CallPicked from './CallPicked';
import { BlurView } from "@react-native-community/blur";

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
        if (gesture.dy < 160 && gesture.dy > -160) {
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
        setResponse('Declined');
        Animated.spring(
          pan,
          {
            toValue: {x: 0, y: 160},
            useNativeDriver: false,
          }, // Back to zero
        ).start();
      } else if (gesture.dy < -120) {
        setIsDragFinished(true);
        setResponse('Picked');
        Animated.spring(
          pan,
          {
            toValue: {x: 0, y: -160},
            useNativeDriver: false,
          }, // Back to zero
        ).start();
      } else {
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
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(arrowColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
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
    <View style={{flex:1}}>
   
      
      <ImageBackground
      style={{flex:1}}
      resizeMode="cover"
      source={require("./assets/Wallpaper.webp")}
      >
        <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={50}
        reducedTransparencyFallbackColor="white"
      >
         {
      response === "Picked" ? 
<CallPicked />  :
  <View style={styles.mainView}>
  <View style={{height: 400, alignItems: 'center'}}>
    <Text style={styles.name}>Varsha soni</Text>
    <Text style={styles.incoming}>{response === "Declined" ? "Call ended..." : "incoming call..."}</Text>
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
          marginBottom: 50,
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
      style={[styles.arrow, {...animatedStyle, marginTop: 50}]}
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
    }
    
    </BlurView>
    </ImageBackground>
    
    </View>
   
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    // backgroundColor: '#212325',
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
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }
});
