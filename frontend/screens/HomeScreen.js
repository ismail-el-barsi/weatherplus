import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SideMenu from 'react-native-side-menu';
import DailyForecast from '../components/DailyForecast';
import HourlyForecast from '../components/HourlyForecast';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import Menu from '../components/SideMenu';
import SunriseSunset from '../components/SunriseSunset';
import WeatherCard from '../components/WeatherCard';
import WeatherMap from '../components/WeatherMap';

const HomeScreen = ({ navigation, route }) => {
  const [city, setCity] = useState(route.params?.city || '');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const [shouldSearch, setShouldSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [highestTemp, setHighestTemp] = useState(null);
  const [lowestTemp, setLowestTemp] = useState(null);
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [location, setLocation] = useState(null);

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (route.params?.city) {
      searchWeather(route.params.city);
    } else if (!city) {
      getLocationAndWeather();
    }
  }, [route.params?.city]);

  useEffect(() => {
    if (shouldSearch && city) {
      searchWeather(city);
      setShouldSearch(false);
    }
  }, [shouldSearch]);

  const getLocationAndWeather = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission d'accéder à la localisation refusée");
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocation({ latitude, longitude });
    await getWeatherByLocation(latitude, longitude);
    await getWeatherForecastByLocation(`${latitude},${longitude}`);
    setLoading(false);
  };

  const getWeatherByLocation = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      console.error('Invalid coordinates');
      return;
    }

    try {
      const res = await axios.get(
        `https://backendweather-152814f63638.herokuapp.com/api/weather/location`,
        {
          params: { latitude, longitude },
        }
      );
      setWeather(res.data);
    } catch (err) {
      console.error(
        'Error fetching weather data:',
        err.response?.data || err.message
      );
    }
  };

  const getWeatherForecastByLocation = async (query) => {
    try {
      const res = await axios.get(
        `https://backendweather-152814f63638.herokuapp.com/api/weather/forecast/${query}`
      );
      const forecastData = res.data.forecast.forecastday;
      const currentLocalTime = res.data.location.localtime;
      filterHourlyForecast(forecastData, currentLocalTime);
      setForecast(forecastData);
      setSunrise(forecastData[0].astro.sunrise);
      setSunset(forecastData[0].astro.sunset);
    } catch (err) {
      console.error(
        'Erreur lors de la récupération des prévisions météorologiques :',
        err.message
      );
    }
  };

  const filterHourlyForecast = (forecastData, currentLocalTime) => {
    const currentDateTime = new Date(currentLocalTime);
    const endDateTime = new Date(currentDateTime);
    endDateTime.setHours(endDateTime.getHours() + 24);

    const filteredHourlyForecast = [];
    forecastData.forEach((day) => {
      day.hour.forEach((hourData) => {
        const hourDateTime = new Date(hourData.time);
        if (hourDateTime >= currentDateTime && hourDateTime <= endDateTime) {
          filteredHourlyForecast.push(hourData);
        }
      });
    });

    setHourlyForecast(filteredHourlyForecast);

    if (filteredHourlyForecast.length > 0) {
      const temperatures = filteredHourlyForecast.map(
        (forecast) => forecast.temp_c
      );
      setHighestTemp(Math.max(...temperatures));
      setLowestTemp(Math.min(...temperatures));
    }
  };

  const searchWeather = async (cityName) => {
    setLoading(true);
    if (cityName.trim() === '') {
      Alert.alert('Veuillez entrer un nom de ville');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://backendweather-152814f63638.herokuapp.com/api/weather/city/${cityName}`
      );
      setWeather(res.data);
      const { lat, lon } = res.data.location;
      setLocation({ latitude: lat, longitude: lon });
      await getWeatherForecastByLocation(cityName);
    } catch (err) {
      console.error(
        'Erreur lors de la récupération des données météorologiques :',
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    Animated.timing(menuAnimation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SideMenu
      menu={<Menu navigation={navigation} />}
      isOpen={isOpen}
      onChange={(isOpen) => setIsOpen(isOpen)}
    >
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff' },
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchContainer}>
            <SearchBar
              city={city}
              setCity={setCity}
              searchWeather={() => setShouldSearch(true)}
              toggleMenu={toggleMenu}
            />
          </View>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {weather && (
                <WeatherCard
                  weather={weather}
                  navigation={navigation} // Pass navigation prop here
                  highestTemp={highestTemp}
                  lowestTemp={lowestTemp}
                />
              )}
              {hourlyForecast.length > 0 && (
                <HourlyForecast hourlyForecast={hourlyForecast} />
              )}
              {forecast && <DailyForecast forecast={forecast} />}
              {sunrise && sunset && (
                <SunriseSunset sunrise={sunrise} sunset={sunset} />
              )}
              {location && <WeatherMap location={location} />}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SideMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default HomeScreen;
