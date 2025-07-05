import Header from "@/app/components/header";
import { authStyles } from "@/assets/style/auth.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
const getUser = async()=>{
         const userInfo:any= await AsyncStorage.getItem('authToken');
         return JSON.parse(userInfo);

  }
const Index = () => {
  //const { userToken} = useAuth();
  const router = useRouter();
  const [loading,setloading] = useState(false)
  const [displayname,setDisplayname] = useState('')
  const openscanner =()=>{
    router.navigate('/scanner')
  }
    useFocusEffect(()=>{
     setloading(false)
    })
  useEffect(()=>{
    getUser().then(((res:any)=>setDisplayname(res.business_name)));
    //setloading(!loading);
  },[displayname]);
  return (
    <View style={authStyles.container}>
      <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsHorizontalScrollIndicator={false}>
        <Header />
        <Text style={authStyles.title}>
          Welcome {displayname?displayname:'User'}
          </Text>

        
          <View style={authStyles.formContainer}>
            <Text style={authStyles.subtitle}>
              Scan QR of customer
            </Text>
            <TouchableOpacity
                              style={[
                                authStyles.authButton,
                                loading && authStyles.buttonDisabled,
                              ]}
                              onPress={()=>{setloading(!loading);openscanner()}}
                              disabled={loading}
                              activeOpacity={0.8}
                            >
                              <Text style={authStyles.buttonText}>
                                {loading ? "Scanning" : "Scan QR Code"}
                              </Text>
                            </TouchableOpacity>
          
          </View>
        
      </ScrollView>
    </View>
  );
};

export default Index;
