import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../utils/Firebase';

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

      await updateProfile(user, {
        displayName: nick,
      });

      const data = {
        nick,
        user_id: user.uid,
        nombre,
        apellidos,
        profile_picture:"../../assets/perfil.png"
      };

      const serverUrl = 'http://192.168.1.145:8080/proyecto01/users';

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

        navigation.navigate('LoginScreen');
      } else {
        const errorData = await response.json();
        console.log('Error del servidor:', errorData);
        setMessage(`Error al guardar los datos: ${errorData.message}`);
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: width * 0.05,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.25, 
    resizeMode: 'contain',
    marginBottom: height * 0.03, 
  },
  title: {
    color: '#a1e45a',
    fontSize: width * 0.045, 
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    width: '100%',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    width: '100%',
    padding: height * 0.015, 
    marginBottom: height * 0.015, 
    fontSize: width * 0.04, 
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a1e45a',
    marginTop: height * 0.02,
    width: 'auto',
  },
  buttonText: {
    color: '#a1e45a',
    fontSize: width * 0.04, 
    fontWeight: 'bold',
  },
  messageSection: {
    width: '80%',
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  messageText: {
    color: '#ffffff',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
});
