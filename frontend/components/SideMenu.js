import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

const SideMenu = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
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
