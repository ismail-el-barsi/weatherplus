import { StyleSheet } from 'react-native';

export const getTemperatureColor = (temperature) => {
  if (temperature >= 40) {
    return '#FF0000'; // Extreme heat
  } else if (temperature >= 30) {
    return '#FF4500'; // Very hot
  } else if (temperature >= 25) {
    return '#FF8C00'; // Hot
  } else if (temperature >= 20) {
    return '#FFB400'; // Warm
  } else if (temperature >= 15) {
    return '#87CEEB'; // Mild
  } else if (temperature >= 10) {
    return '#00BFFF'; // Cool
  } else if (temperature >= 5) {
    return '#1E90FF'; // Chilly
  } else if (temperature >= 0) {
    return '#4682B4'; // Cold
  } else if (temperature >= -10) {
    return '#5F9EA0'; // Very cold
  } else {
    return '#00FFFF'; // Freezing
  }
};

export const styles = StyleSheet.create({
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
