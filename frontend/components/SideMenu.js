import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

const SideMenu = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkTokenExpiration = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(
          `https://backendweather-152814f63638.herokuapp.com/api/users/check-token-expiration/${token}`
        );
        if (response.data.message === 'Token has expired') {
          console.log('Token has expired');
          await AsyncStorage.removeItem('token');
          setIsLoggedIn(false);
          navigation.navigate('Login'); // Navigate to Login if token is expired
        } else {
          console.log('Token is still valid');
          setIsLoggedIn(true); // Keep the user logged in
        }
      } catch (error) {
        console.log('Error checking token expiration:', error.message);
        setIsLoggedIn(false);
        navigation.navigate('Login'); // Navigate to Login if there's an error
      }
    } else {
      console.log('No token found');
      setIsLoggedIn(false); // Ensure the user is logged out if no token is found
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  const disconnect = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    navigation.navigate('Login');
  };

  const connect = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuItems}>
        {isLoggedIn ? (
          <>
            <Button
              mode='contained'
              onPress={() => navigation.navigate('Favorites')}
              style={styles.button}
            >
              Favorites
            </Button>
            <Button mode='contained' onPress={disconnect} style={styles.button}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button mode='contained' onPress={connect} style={styles.button}>
            Connect
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    alignItems: 'center',
  },
  button: {
    marginBottom: 12,
    width: 200,
  },
});

export default SideMenu;