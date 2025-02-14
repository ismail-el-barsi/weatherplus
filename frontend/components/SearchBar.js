import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ city, setCity, searchWeather, toggleMenu }) => {
  const colorScheme = useColorScheme();

  return (
    <React.Fragment>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
        <Icon
          name='menu'
          size={30}
          color={colorScheme === 'dark' ? '#fff' : '#000'}
        />
      </TouchableOpacity>
      <TextInput
        label='Search city'
        value={city}
        onChangeText={setCity}
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
            color: colorScheme === 'dark' ? '#fff' : '#000',
          },
        ]}
        theme={{
          colors: {
            primary: colorScheme === 'dark' ? '#FFB400' : '#007AFF',
          },
        }}
      />
      <TouchableOpacity onPress={searchWeather} style={styles.searchIcon}>
        <Icon
          name='search'
          size={30}
          color={colorScheme === 'dark' ? '#fff' : '#000'}
        />
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    marginRight: 12,
  },
  searchIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderRadius: 25,
    borderWidth: 1,
    paddingLeft: 16,
    fontSize: 22,
    height: 35,
  },
});

export default SearchBar;
