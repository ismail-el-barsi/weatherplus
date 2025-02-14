import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const theme = useTheme();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('Home');
      }
    };
    checkToken();
  }, []);

  const loginUser = async (values) => {
    try {
      const res = await axios.post(
        'https://backendweather-152814f63638.herokuapp.com/api/users/login',
        values
      );
      const { token } = res.data;
      await AsyncStorage.setItem('token', token);
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        icon='arrow-left'
        size={24}
        onPress={() => navigation.navigate('Home')}
        style={styles.backButton}
      />
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={loginUser}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <TextInput
              label='Email'
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              label='Password'
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button
              mode='contained'
              onPress={handleSubmit}
              style={styles.button}
            >
              Login
            </Button>
            <Text
              onPress={() => navigation.navigate('Register')}
              style={styles.link}
            >
              Don't have an account? Register
            </Text>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  formContainer: {
    paddingBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  link: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
  },
});

export default LoginScreen;
