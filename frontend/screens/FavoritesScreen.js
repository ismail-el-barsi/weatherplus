import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTemperatureColor } from '../components/utils';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        'https://backendweather-152814f63638.herokuapp.com/api/weather/favorites',
        {
          headers: { 'x-auth-token': token },
        }
      );
      setFavorites(res.data);
      await fetchWeatherForFavorites(res.data);
    } catch (err) {
      console.error('Error fetching favorites:', err.message);
      Alert.alert('Error', 'Could not fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForFavorites = async (cities) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        'https://backendweather-152814f63638.herokuapp.com/api/weather/favorites/weather',
        {
          headers: { 'x-auth-token': token },
        }
      );
      const weather = {};
      const iconPromises = [];

      res.data.forEach((cityWeather) => {
        weather[cityWeather.city] = cityWeather.weather;
        const iconUrl = `https:${cityWeather.weather.current.condition.icon.replace(
          '64x64',
          '128x128'
        )}`;
        iconPromises.push(Image.prefetch(iconUrl));
      });

      await Promise.all(iconPromises);
      setWeatherData(weather);
      setIconsLoaded(true);
    } catch (err) {
      console.error('Error fetching weather data for favorites:', err.message);
    }
  };

  const removeFavorite = async (city) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.delete(
        `https://backendweather-152814f63638.herokuapp.com/api/weather/favorites/${city}`,
        {
          headers: { 'x-auth-token': token },
        }
      );
      setFavorites(res.data);
      const updatedWeatherData = { ...weatherData };
      delete updatedWeatherData[city];
      setWeatherData(updatedWeatherData);
    } catch (err) {
      console.error('Error removing favorite:', err.message);
      Alert.alert('Error', 'Could not remove favorite');
    }
  };

  const handleCityPress = (city) => {
    navigation.navigate('Home', { city });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCityPress(item)}>
      <Card
        style={[
          styles.card,
          { backgroundColor: colorScheme === 'dark' ? '#333' : '#fff' },
        ]}
      >
        <Card.Title
          title={item}
          titleStyle={[
            { color: colorScheme === 'dark' ? '#fff' : '#000' },
            styles.cityName,
          ]}
        />
        {weatherData[item] ? (
          <Card.Content>
            <View style={styles.weatherInfo}>
              <Image
                source={{
                  uri: `https:${weatherData[
                    item
                  ].current.condition.icon.replace('64x64', '128x128')}`,
                }}
                style={styles.weatherIcon}
              />
              <View style={styles.weatherTextContainer}>
                <Text
                  style={[
                    styles.weatherText,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                >
                  Temperature:
                  <Text
                    style={{
                      color: getTemperatureColor(
                        weatherData[item].current.temp_c
                      ),
                    }}
                  >
                    {weatherData[item].current.temp_c}°C
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.weatherText,
                    { color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                >
                  Condition: {weatherData[item].current.condition.text}
                </Text>
              </View>
            </View>
          </Card.Content>
        ) : (
          <Text style={{ color: colorScheme === 'dark' ? '#aaa' : '#777' }}>
            Loading weather data...
          </Text>
        )}
        <Card.Actions>
          <Button onPress={() => removeFavorite(item)} mode='contained'>
            Remove
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff' },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        Favorites
      </Text>
      {loading || !iconsLoaded ? (
        <LoadingSpinner />
      ) : favorites.length === 0 ? (
        <Text
          style={[
            styles.noFavoritesText,
            { color: colorScheme === 'dark' ? '#aaa' : '#777' },
          ]}
        >
          No favorites found.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      <Button
        mode='contained'
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      >
        Return to Home
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  card: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  weatherIcon: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  weatherTextContainer: {
    flexDirection: 'column',
  },
  weatherText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
