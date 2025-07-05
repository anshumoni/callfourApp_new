import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const searchItems = async (qrcode: string) => {
    const authToken:any = await AsyncStorage.getItem("authToken");
    const busnessinfo = JSON.parse(authToken);
    try {
      const response = await fetch(
        `https://callfour.life/wp-json/custom-api/v1/search-entry?form_id=5&field=28&value=${qrcode}`,
          {
          method: 'GET', // or 'POST', 'PUT', etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${busnessinfo?.auth_token}`,
          },
          }
         );
      const data = await response.json();
      const returnObj = {
        name:data[0].data['1.3']+' '+data[0].data['1.6'],
        email:data[0].data['29'],
        phone:data[0].data['4']
      }
      return JSON.stringify(returnObj);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data. "+error);
    }
  };

export const searchTran = async (bus_email:string,user_email: string) => {
   const authToken:any = await AsyncStorage.getItem("authToken");
   const busnessinfo = JSON.parse(authToken);

    try {
      const response = await fetch(
        `https://callfour.life/wp-json/custom-api/v1/searchusertransaction?user_email=${user_email}&business_email=${bus_email}`,
        {
          method: 'GET', // or 'POST', 'PUT', etc.
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${busnessinfo?.auth_token}`,
          },
          }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data." +error);
    }
  };
  function generateTenDigitSequence(currentNumber:number) {
  const date = new Date();
  let numStr = currentNumber.toString().padStart(10, '0')+""+date.getFullYear()%100;
  return numStr;
}
  export const updateUser= async(freq: number,businessemail: string,useremail: string)=>{
     const authToken:any = await AsyncStorage.getItem("authToken");
    const busnessinfo = JSON.parse(authToken);

        try {
          const newfreq:number = Number(freq);
          const transaction_id = generateTenDigitSequence(newfreq+1);
          const response = await fetch('https://callfour.life/wp-json/custom-api/v1/callfourinserttransaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${busnessinfo?.auth_token}`,
              },
              body: JSON.stringify({
                user_email: useremail,
                busness_email:businessemail,
                freq: newfreq,
                tran_id:transaction_id
              })
            })

          await response.json();
          
          return transaction_id;
          
        } catch (error) {
          Alert.alert("Error", "Failed to fetch data. "+error);
        }  
      }
   export const sendTransactionEmail=async(tran_id:string,useremail:string,busname:string,reward:string,username:string)=>{
     const requestData = {
        "email": useremail,
        "name": username,
        "tran_id":tran_id,
        "business":busname,
        "reward":reward
      };
       const authToken:any = await AsyncStorage.getItem("authToken");
       const busnessinfo = JSON.parse(authToken);

    try {
      const data = await fetch(
        "https://callfour.life/wp-json/custom-api/v1/send_email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Tell server body is JSON
            'Authorization': `Bearer ${busnessinfo?.auth_token}`,
            // any custom header
          },
          body:JSON.stringify(requestData),
        }
      );
      await data.json();
      Alert.alert("Success", "Please check your email!");
               
    } catch (error) {
      Alert.alert("Error", "Error in sending email " + error);
    }
   }   
