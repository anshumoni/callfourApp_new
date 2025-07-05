import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import * as Yup from "yup";
import { authStyles } from "./../../assets/style/auth.style";
import Header from "./../components/header";
import { COLORS } from "./../constants/colors";
import { useAuth } from "./../context/authContext";

export default function Index() {
  const { login} = useAuth();
  const [showpass, setshowpassword] = useState(true);
  const [loading, setloading] = useState(false);

  const validationSchema = Yup.object({
    username: Yup.string()
      .email("Invalid email")
      .required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          <Header />
          <Text style={authStyles.title}>Welcome to Callfour</Text>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setloading(!loading);
              login(JSON.stringify(values));
              
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={authStyles.formContainer}>
                <View style={authStyles.inputContainer}>
                  <TextInput
                    placeholder="Enter Username"
                    style={authStyles.textInput}
                    placeholderTextColor={COLORS.textLight}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    value={values.username}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  {touched.username && errors.username && (
                    <Text style={{ color: "red" }}>{errors.username}</Text>
                  )}
                </View>
                {/* PASSWORD CONTAINER*/}
                <View style={authStyles.inputContainer}>
                  <TextInput
                    placeholder="Enter Password"
                    style={authStyles.textInput}
                    secureTextEntry={showpass}
                    onChangeText={handleChange("[password]")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {touched.password && errors.password && (
                    <Text style={{ color: "red" }}>{errors.password}</Text>
                  )}

                  <TouchableOpacity
                    style={authStyles.eyeButton}
                    onPress={() => setshowpassword(!showpass)}
                  >
                    <Ionicons
                      name={showpass ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.textLight}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    authStyles.authButton,
                    loading && authStyles.buttonDisabled,
                  ]}
                  onPress={()=>{handleSubmit()}}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={authStyles.buttonText}>
                    {loading ? "Sign in......." : "Sign in"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
