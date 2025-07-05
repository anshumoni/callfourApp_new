import { authStyles } from '@/assets/style/auth.style'
import React from 'react'
import { Image, View } from 'react-native'

const Header = () => {
  return (
    <View style={authStyles.imageContainer}>
      <Image
              style={authStyles.image}
              source={require("@/assets/images/callfour.jpg")}
              resizeMode="contain"
            />
    </View>
  )
}

export default Header

