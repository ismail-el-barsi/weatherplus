import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTemperatureColor } from '../components/utils';

const WeatherCard = ({ weather, navigation, highestTemp, lowestTemp }) => {
  const colorScheme = useColorScheme();

  const addFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(
          'Warning!',
          'Vous devez être connecté pour ajouter aux favoris'
        );
        navigation.navigate('Login');
        return;
      }

      const res = await axios.post(
        'https://backendweather-152814f63638.herokuapp.com/api/weather/favorites',
        { city: weather.location.name },
        {
          headers: { 'x-auth-token': token },
        }
      );
      Alert.alert('Info', res.data.msg);
    } catch (err) {
      console.error("Erreur lors de l'ajout aux favoris :", err.message);
      Alert.alert('Erreur', "Impossible d'ajouter aux favoris");
    }
  };

  return (
    <View style={styles.weatherContainer}>
      <Text
        style={[
          styles.cityName,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        {weather.location.name}
      </Text>
      <Text
        style={[
          styles.weatherDescription,
          { color: colorScheme === 'dark' ? '#ccc' : '#555' },
        ]}
      >
        {weather.current.condition.text}
      </Text>
      <Image
        source={{
          uri: `https:${weather.current.condition.icon.replace(
            '64x64',
            '128x128'
          )}`,
        }}
        style={{ width: 150, height: 150 }}
      />
      <Text
        style={[
          styles.temperature,
          { color: getTemperatureColor(weather.current.temp_c) },
        ]}
      >
        {weather.current.temp_c}°C
      </Text>
      <Text
        style={[
          styles.details,
          { color: colorScheme === 'dark' ? '#ccc' : '#555' },
        ]}
      >
        <Icon name='water' size={20} color='#007AFF' /> Humidité :{' '}
        {weather.current.humidity}%
      </Text>
      <Text
        style={[
          styles.details,
          { color: colorScheme === 'dark' ? '#ccc' : '#555' },
        ]}
      >
        <Icon name='leaf' size={20} color='#00BFFF' /> Vitesse du vent :{' '}
        {weather.current.wind_kph} kph
      </Text>

      {highestTemp !== null && (
        <Text style={[styles.details, { color: '#FF4500' }]}>
          <Icon name='arrow-up' size={20} color='#FF4500' /> Max Temp :{' '}
          {highestTemp}°C
        </Text>
      )}
      {lowestTemp !== null && (
        <Text style={[styles.details, { color: '#1E90FF' }]}>
          <Icon name='arrow-down' size={20} color='#1E90FF' /> Min Temp :{' '}
          {lowestTemp}°C
        </Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: '#FFB400',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
        }}
        onPress={addFavorite}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Ajouter aux favoris
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  weatherDescription: {
    fontSize: 20,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default WeatherCard;
