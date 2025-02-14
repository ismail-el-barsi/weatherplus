import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SunriseSunset = ({ sunrise, sunset }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colorScheme === 'dark' ? '#fff' : '#000' },
        ]}
      >
        Lever et coucher du soleil
      </Text>
      <View style={styles.timeContainer}>
        <Icon name='sunny-outline' size={24} color='#FFA500' />
        <Text style={styles.timeText}>{`Lever du soleil: ${sunrise}`}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Icon name='moon-outline' size={24} color='#1E90FF' />
        <Text style={styles.timeText}>{`Coucher du soleil: ${sunset}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
});

export default SunriseSunset;
