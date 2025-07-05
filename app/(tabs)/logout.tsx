import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from "../context/authContext";


const Logout = () => {
    const {logout} = useAuth();
    logout(); 
       return <Redirect href={"/(auth)"}/>   
}

export default Logout
