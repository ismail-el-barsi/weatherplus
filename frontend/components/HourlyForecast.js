import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { getTemperatureColor } from '../components/utils';

const HourlyForecast = ({ hourlyForecast }) => {
  const colorScheme = useColorScheme();

  const renderHourlyItem = ({ item }) => (
    <View style={styles.hourlyItem}>
      <Text style={styles.hourlyTime}>{new Date(item.time).getHours()}:00</Text>
      <Image
        source={{
          uri: `https:${item.condition.icon.replace('64x64', '128x128')}`,
        }}
        style={{ width: 50, height: 50 }}
      />
      <Text
        style={[styles.hourlyTemp, { color: getTemperatureColor(item.temp_c) }]}
      >
        {item.temp_c}°C
      </Text>
      <Text style={styles.hourlyCondition}>{item.condition.text}</Text>
    </View>
  );

  return (
    <View style={styles.hourlyForecastContainer}>
      <Text
        style={[
          styles.forecastTitle,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        Météo horaire
      </Text>
      <FlatList
        horizontal
        data={hourlyForecast}
        renderItem={renderHourlyItem}
        keyExtractor={(item) => item.time}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hourlyForecastContainer: {
    marginTop: 10,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  hourlyTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  hourlyTemp: {
    fontSize: 18,
    color: '#FF4500',
  },
  hourlyCondition: {
    fontSize: 16,
    color: '#555',
  },
});

export default HourlyForecast;
