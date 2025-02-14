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

const DailyForecast = ({ forecast }) => {
  const colorScheme = useColorScheme();

  const renderItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDate}>{item.date}</Text>
      <Image
        source={{
          uri: `https:${item.day.condition.icon.replace('64x64', '128x128')}`,
        }}
        style={{ width: 50, height: 50 }}
      />
      <Text
        style={[
          styles.forecastTemp,
          { color: getTemperatureColor(item.day.avgtemp_c) },
        ]}
      >
        {item.day.avgtemp_c}°C
      </Text>
      <Text style={styles.forecastCondition}>{item.day.condition.text}</Text>
    </View>
  );

  return (
    <View style={styles.forecastContainer}>
      <Text
        style={[
          styles.forecastTitle,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        Prévisions météorologiques
      </Text>
      <FlatList
        horizontal
        data={forecast}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    marginTop: 10,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  forecastTemp: {
    fontSize: 18,
    color: '#FF4500',
  },
  forecastCondition: {
    fontSize: 16,
    color: '#555',
  },
});

export default DailyForecast;
