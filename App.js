 import React, {useState, useEffect} from 'react';
 import { PermissionsAndroid, Button } from 'react-native';
 import {
   SafeAreaView,
   StyleSheet,
   ScrollView,
   View,
   StatusBar,
   Text,
   FlatList,
 } from 'react-native';
 import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
 import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
 import WifiManager from 'react-native-wifi-reborn';
 
 const App = () => {
   const [connected, setConnected] = useState({connected: false, ssid: 'S4N'});
   const [ssid, setSsid] = useState('');
   const password ="tanenbaum-1981";
   let [nearbyNetworksList,setNearbyNetworks] = useState([]);
   let [GetNearbyNetworksModalState,showGetNearbyNetworksModal] = useState(false);

   const initWifi = async () => {
     try {
       const ssid = await WifiManager.getCurrentWifiSSID();
       setSsid(ssid);
       console.log('Your current connected wifi SSID is ' + ssid);
     } catch (error) {
       setSsid('Cannot get current SSID!' + error.message);
       console.log('Cannot get current SSID!', {error});
     }
   }
 
   const requestLocationPermission = async () => {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
         {
           title: "React Native Wifi Reborn App Permission",
           message:
             "Location permission is required to connect with or scan for Wifi networks. ",
           buttonNeutral: "Ask Me Later",
           buttonNegative: "Cancel",
           buttonPositive: "OK"
         }
       );
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         initWifi();
       } else {
         console.log("Location permission denied");
       }
     } catch (err) {
       console.warn(err);
     }
   };
 
   const connectWithWifi = async () => {
     try {
       const data = await WifiManager.connectToProtectedSSID(
         ssid,
         password,
         false,
       );
       console.log('Connected successfully!', {data});
       setConnected({connected: true, ssid});
     } catch (error) {
       setConnected({connected: false, error: error.message});
       console.log('Connection failed!', {error});
     }
   };

   function getNearbyNetworks(){
    showGetNearbyNetworksModal(true);
   }
 
   const scanExample = async () => {
     WifiManager.reScanAndLoadWifiList().then(devices=>{
       // List Of Devices [Containing Only SSID]
       let devices_list = devices.map(device=>{
           return device.SSID;
       })
       setNearbyNetworks(devices_list);
       console.log(nearbyNetworksList);
       }).catch(err=>{
       console.log(err)
       })
  //    try {
  //      const data = await WifiManager.reScanAndLoadWifiList()
  //      console.log(data);
  //    } catch (error) {
  //      console.log(error);
  //    }
   }
 
   useEffect(() => {
     requestLocationPermission();
   }, []);
 
   return (
     <>
       <StatusBar barStyle="dark-content" />
       <SafeAreaView>
         <ScrollView
           contentInsetAdjustmentBehavior="automatic"
           style={styles.scrollView}>
           <Header />
           <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle}>ssid</Text>
             <Text style={styles.sectionDescription}>
               {JSON.stringify(ssid)}
             </Text>
           </View>
           <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle}>Connected</Text>
             <Text style={styles.sectionDescription}>
               {JSON.stringify(connected)}
             </Text>
           </View>
           <Button onPress={connectWithWifi} title="Connect" />
           <Button onPress={scanExample} title="Load" />
           <View style={styles.body}></View>

    <Modal isVisible={GetNearbyNetworksModalState} style={{justifyContent: 'flex-end',margin: 0,}}>
      <View style={{height:win.height/2 ,backgroundColor:'#fff',padding:15}}>
              <NearbyDevices/>
              <Button style={{backgroundColor:'#212121',width: '100%', 
              height: 50, 
              left:12,
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'absolute',
              bottom: 0}} onPress={()=>{
                showGetNearbyNetworksModal(false)
              }}> 
              <View><Text style={style.headerText}> Close </Text></View>
              </Button>
      </View></Modal>
         </ScrollView>
       </SafeAreaView>
     </>
   );
 };
 
 const styles = StyleSheet.create({
   scrollView: {
     backgroundColor: Colors.lighter,
   },
   engine: {
     position: 'absolute',
     right: 0,
   },
   body: {
     backgroundColor: Colors.white,
   },
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
     color: Colors.black,
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
     color: Colors.dark,
   },
   highlight: {
     fontWeight: '700',
   },
   footer: {
     color: Colors.dark,
     fontSize: 12,
     fontWeight: '600',
     padding: 4,
     paddingRight: 12,
     textAlign: 'right',
   },
 });
 
 export default App;
 