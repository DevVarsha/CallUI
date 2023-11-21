import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function CallPicked() {

    const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [enable, setEnable] = useState(false);


  useEffect(() => {
    let timer: any;

    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => prevMinutes + 1);
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }

    // Clean up the timer on component unmount
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleButtonClick = () => {
    setIsRunning(!isRunning);
    setMinutes(0)
    setSeconds(0)
    setEnable(true)
  };

    const pickedOption = [
        {
            name: "Audio",
            image: require("./assets/speacker.png")
        },
        {
            name: "FaceTime",
            image: require("./assets/camcorder.png")
        },
        {
            name: "Mute",
            image: require("./assets/microphone.png")
        },
        {
            name: "Add",
            image: require("./assets/add.png")
        },
        {
            name: "End",
            image: require("./assets/cut.png")
        },
        {
            name: "Keypad",
            image: require("./assets/dial.png")
        },
    ]
    const formatNumber = (num: any) => (num < 10 ? `0${num}` : num);

  return (
    <View style={styles.mainView}>
        <Text style={styles.timer}>{enable ? "call ending..." : `${formatNumber(minutes)}:${formatNumber(seconds)}`}</Text>
       <Text style={styles.name}>Varsha soni</Text>
       <View style={{flex:1}} />
       <View style={{flexDirection:"row", 
       flexWrap:"wrap", justifyContent:"space-between", 
       marginHorizontal:32}}>
        {
            pickedOption.map((item) => {
             return(
                <TouchableOpacity
                key={item.name}
                disabled={enable}
                onPress={() => {if(item.name === "End") {
                    handleButtonClick()
                }}}
                style={{marginBottom: 22, alignItems:"center" }}>
                <View style={[styles.circle,
                    {
                    backgroundColor: enable === false && item?.name === "End" ? "red" : "grey",
                opacity: enable ? 0.6 : 1}]}
                    
                        >
                <Image 
                style={{width: 36, height:36, tintColor:"#fff"}}
                resizeMode='contain'
                source={item.image}
                />
                </View>
                <Text style={styles.iconName}>{item.name}</Text>
                </TouchableOpacity>
             )
            })
        }
       </View>
      <SafeAreaView />
    </View>
  )
}

const styles = StyleSheet.create({
    mainView:{
        flex: 1,
    alignItems:"center"
    },
    name: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '700',  
        marginTop: 10,
      },
      timer: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '400',
        marginTop: 100,
      },
      circle:{
        width:80,
        height: 80,
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 40,
        marginHorizontal: 8,
      },
      iconName:{
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginTop: 10,
      }
})