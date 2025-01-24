import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nick, setNick] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [message, setMessage] = useState('');
  
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const data = {
        nick,
        user_id: user.uid,
        nombre,
        apellidos,
      };

      const serverUrl = 'http://localhost:8080/proyecto01/users';

      console.log("Enviando datos al servidor:", data);

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

        setMessage('Usuario registrado y datos guardados exitosamente.');

        // Guardar el nombre del usuario en AsyncStorage
        await AsyncStorage.setItem('userName', responseData.nombre);

        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        console.log('Error del servidor:', errorData);
        setMessage(`Error al guardar los datos:${errorData.message}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setMessage('El correo electrónico ya está en uso.');
            break;
          case 'auth/invalid-email':
            setMessage('El correo electrónico no es válido.');
            break;
          case 'auth/weak-password':
            setMessage('La contraseña es muy débil.');
            break;
          default:
            setMessage('Error al registrar el usuario.');
            break;
        }
      } else if (error.message) {
        setMessage(`Error al conectar con el servidor: ${error.message}`);
      } else {
        setMessage('Error desconocido al registrar el usuario.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/formulario.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Completar los siguientes campos:</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nick"
        placeholderTextColor="#ccc"
        value={nick}
        onChangeText={setNick}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#ccc"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        placeholderTextColor="#ccc"
        value={apellidos}
        onChangeText={setApellidos}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>FINALIZAR</Text>
      </TouchableOpacity>
      
      <View style={styles.messageSection}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    color: '#a1e45a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a1e45a',
    marginTop: 20,
    width: 'auto',
  },
  buttonText: {
    color: '#a1e45a',
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
});