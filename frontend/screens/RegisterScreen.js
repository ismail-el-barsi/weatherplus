import axios from 'axios';
import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const RegisterScreen = ({ navigation }) => {
  const registerUser = async (values) => {
    try {
      await axios.post(
        'https://backendweather-152814f63638.herokuapp.com/api/users/register',
        values
      );
      navigation.navigate('Login');
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
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={registerUser}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <TextInput
              label='Username'
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              style={styles.input}
            />
            {touched.username && errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
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
              Register
            </Button>
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.link}
            >
              Already have an account? Login
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

export default RegisterScreen;
