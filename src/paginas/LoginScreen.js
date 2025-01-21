import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase'; 

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, introduce correo y contraseña');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {

      Alert.alert('Éxito', 'Has iniciado sesión correctamente');

      navigation.navigate('TabScreen');
        
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/vedrunaReact.png')} 
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>VEDRUNA EDUCACIÓN</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo o nick..."
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña..."
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.createAccount}>
          ¿No tienes cuenta? <Text style={styles.createAccountLink}>Crear cuenta</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 100, 
    height: 100,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    color: '#b8b8b8',
    fontSize: 14,
    marginBottom: 20,
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#70c100',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createAccount: {
    color: '#b8b8b8',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#70c100',
    fontWeight: 'bold',
  },
});
