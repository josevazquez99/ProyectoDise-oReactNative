import { StatusBar } from 'expo-status-bar';
import { Settings, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { HomeScreen, LoginScreen, RegisterScreen, TabScreen, PublicacionScreen,ComentarioScreen, SettingsScreen } from './src/paginas';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="TabScreen" component={TabScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="PublicacionScreen" component={PublicacionScreen} />
        <Stack.Screen name="ComentarioScreen" component={ComentarioScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
