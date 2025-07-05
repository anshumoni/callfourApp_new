import Header from "@/app/components/header";
import { authStyles } from "@/assets/style/auth.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { searchTran, sendTransactionEmail, updateUser } from "../services/callfourservice";



const Profile = () => {
  const route = useRoute();
  const router = useRouter();

  const [usermessage, setUserMessage] = useState("");
  //const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);

  const [frequency, setFrequency] = useState("");
  const [userdata, setUserData] = useState<any>({});

  const ordinalNumber = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  useEffect(() => {
    const init = async () => {
      if (!route?.params || !route?.params?.response) {
        router.navigate("/scanner");
        return;
      }

      let parsedData: any = {};
      try {
        parsedData = JSON.parse(route?.params?.response);
        setUserData(parsedData);
      } catch (err) {
        setUserMessage("Invalid QR Code format. Please try again."+err);
        return;
      }

      const authToken = await AsyncStorage.getItem("authToken");
      if (!authToken) {
        setUserMessage("User not logged in.");
        return;
      }

      const userInfo = JSON.parse(authToken);
      const email = userInfo.business_email;
      const name = userInfo.business_name;
      const reward = userInfo.business_reward;

      if (!email || !name) {
        setUserMessage("Invalid QR Code. Please try again!");
        return;
      }

      try {
        const res = await searchTran(email, parsedData["email"]);
        //setloading(true)
        if (res.message === "No results found" || res.status === "400") {
          setUserMessage(`You have just issued ${name} with ${reward}.`);
          const tranid :any= await updateUser(0, email, parsedData["email"]);
          const cleanedTranId = tranid.replace(/^0+/, "");
          //setTransactionId(cleanedTranId);
          setFrequency(`Transaction ID: ${cleanedTranId}`);
          await sendTransactionEmail(tranid, parsedData["email"], name, reward, parsedData["name"]);
          setLoading(false);
        } else {
          const freq = Array.isArray(res) ? res[0].frequency : res.frequency;
          // Array.isArray(res) ? res[0].transactionId : "N/A";
          setUserMessage(`You have just issued ${name} with ${reward}.`);
          const tranid:any = await updateUser(Number(freq) + 1, email, parsedData["email"]);
          const cleanedTranId = tranid.replace(/^0+/, "");
          //setTransactionId(cleanedTranId);

          const resultNum = parseInt(cleanedTranId.slice(0, -2));
          if (!isNaN(resultNum)) {
            setFrequency(`This is the ${ordinalNumber(resultNum)} time this month.`);
          }

          await sendTransactionEmail(tranid, parsedData["email"], name, reward, parsedData["name"]);
          setLoading(false)
        }

      } catch (error) {
        setUserMessage("Something went wrong while checking your transaction." +error);
      }
    };

    init();
  }, [route.params]);

  return (
  <View style={authStyles.container}>
    <Header />
    <ScrollView
      contentContainerStyle={authStyles.scrollContent}
      showsHorizontalScrollIndicator={false}
    >
      {Object.keys(userdata).length !== 0 ? (
        <>
          {loading ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              visible={!loading}
              style={authStyles.simmerUi}
            >
              <Text style={authStyles.titlesmall}>Loading message...</Text>
            </ShimmerPlaceHolder>
          ) : (
            <Text style={authStyles.titlesmall}>{usermessage}</Text>
          )}

          {loading ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              visible={!loading}
              style={authStyles.simmerUi}
            >
              <Text style={authStyles.titlesmall}>Loading frequency...</Text>
            </ShimmerPlaceHolder>
          ) : (
            <Text style={authStyles.titlesmall}>{frequency}</Text>
          )}

          {loading ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              visible={!loading}
              style={authStyles.simmerUi}
            >
              <Text style={authStyles.titlesmall}>Loading thanks...</Text>
            </ShimmerPlaceHolder>
          ) : (
            <Text style={authStyles.titlesmall}>Thanks for being part of Call Four.</Text>
          )}
        </>
      ) : (
        <Text style={authStyles.subtitle}>{usermessage}</Text>
      )}
    </ScrollView>
  </View>
);

};

export default Profile;
