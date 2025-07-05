// AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const AuthContext = createContext({
  userToken: null,
  login: ({ val }: any) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [userToken, setUserToken] = useState(null);
  const router = useRouter();

  const login = async (value: any) => {
    try {
      const data = await fetch(
        "https://callfour.life/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Tell server body is JSON
            // any custom header
          },
          body: value,
        }
      );
      const responsedata = await data.json();
     // console.log("response", responsedata);
      if (responsedata.token) {
        //Fetching reward value for business from gravity form 2
        try {
          const responseReward = await fetch(
        `https://callfour.life/wp-json/custom-api/v1/search-reward?value=${responsedata.user_display_name}`,
         
         {
          method: 'GET', // or 'POST', 'PUT', etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${responsedata.token}`,
          },
          }
         );
         const datareward = await responseReward.json();
        //console.log("reward",datareward[0].data);
          const userdata = {
            business_name: datareward[0].data['1'],
            business_email: responsedata.user_email,
            business_reward:datareward[0].data['17'],
            auth_token:responsedata.token
            //'business_address':responsedata[0].data['3.1']+responsedata[0].data['3.3']
          };
          // console.log("userdata",userdata);
          await AsyncStorage.setItem("authToken", JSON.stringify(userdata));

          // setUserToken(userdata);
          Alert.alert("Success", "You have logged in successfully!");
          router.navigate("/(tabs)");
          //navigation.replace('Profile');
        } catch (error) {
          Alert.alert(
            "Error",
            "No reward is listed in business table " + error
          );
          router.navigate("/(tabs)");
        }
      } else {
        //console.log("message", responsedata.message);
        Alert.alert("Error", "Login failed. " + responsedata.message);
        router.replace("/");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong " + error);
      router.replace("/");
    }
  };
  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("authToken");
    router.replace("/");
  };
  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
