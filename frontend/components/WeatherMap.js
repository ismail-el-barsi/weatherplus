import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const WeatherMap = ({ location }) => {
  const [weatherData, setWeatherData] = useState(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location]);

  const fetchWeatherData = async (location) => {
    try {
      const res = await axios.get(
        `https://backendweather-152814f63638.herokuapp.com/api/weather/location`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        }
      );
      setWeatherData(res.data);
    } catch (err) {
      console.error('Error fetching weather data:', err.message);
    }
  };

  const renderWeatherMarker = () => {
    if (!weatherData) return null;

    const { lat, lon, name } = weatherData.location;
    const { temp_c, condition } = weatherData.current;

    return (
      <Marker coordinate={{ latitude: lat, longitude: lon }}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>{name}</Text>
          <Text style={styles.markerText}>{temp_c}°C</Text>
          <Text style={styles.markerText}>{condition.text}</Text>
        </View>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {renderWeatherMarker()}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  map: {
    height: 300,
    width: '100%',
  },
  marker: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  markerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default WeatherMap;
