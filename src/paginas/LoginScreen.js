import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../utils/Firebase';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage('Inicio de sesión exitoso, bienvenido.');
        navigation.navigate('TabScreen');
      })
      .catch((error) => {
        setMessage('Error de inicio de sesión: ' + error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('../../assets/vedrunaReact.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>VEDRUNA</Text>
        <Text style={styles.title}>EDUCACIÓN</Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su correo..."
          placeholderTextColor="#cccccc"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Introduzca su contraseña..."
          placeholderTextColor="#cccccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messageSection}>
        <Text style={styles.messageText}>{message}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.line}></View>
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccountText}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.createAccountLink}> Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoSection: {
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  formSection: {
    width: '80%',
  },
  input: {
    backgroundColor: '#333333',
    color: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#9FC63B',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
  },
  buttonSection: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#9FC63B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageSection: {
    width: '80%',
    marginTop: 15,
    alignItems: 'center',
  },
  messageText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    width: '80%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#9FC63B',
    marginBottom: 10,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountText: {
    color: '#ffffff',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#9FC63B',
    textDecorationLine: 'underline',
  },
});
