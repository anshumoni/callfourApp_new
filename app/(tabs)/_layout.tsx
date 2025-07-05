import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'


const _layout = () => {
  return (
   <Tabs>
    <Tabs.Screen 
      name="index"
      options={{
        title:"Home",
        tabBarIcon:({color,size})=><Ionicons name="home" size={size} color={color}/>
      }
      }/>
     <Tabs.Screen 
      name="profile"
      options={{
        title:"Profile",
        tabBarIcon:({color,size})=><Ionicons name="person" size={size} color={color}/>
      }
      }/>
      <Tabs.Screen 
      name="scanner"
      options={{
        title:"Scanner",
        tabBarIcon:({color,size})=><Ionicons name="scan" size={size} color={color}/>
      }
      }/>
      <Tabs.Screen 
      name="logout"
      options={{
        title:"Logout",
        tabBarIcon:({color,size})=><Ionicons name="log-out-outline" size={size} color={color}/>
      }
      }/>
   </Tabs>
  )
}

export default _layout