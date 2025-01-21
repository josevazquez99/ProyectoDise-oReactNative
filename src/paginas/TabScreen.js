import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 
import { TouchableOpacity } from 'react-native';
import AjustesScreen from "./AjustesScreen";
import PublicacionesScreen from "./PublicacionesScreen";
import AddScreen from "./AddScreen";

export function TabScreen() {
  const Tab = createBottomTabNavigator();

  // Función para manejar la navegación a AddScreen
  const handleAddPress = (navigation) => {
    navigation.navigate('Add', { takePhoto: true });
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#282828" },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen
        name="Publicaciones"
        component={PublicacionesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={() => handleAddPress(navigation)} />
          )
        })}
      />
      <Tab.Screen
        name="Ajustes"
        component={AjustesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
