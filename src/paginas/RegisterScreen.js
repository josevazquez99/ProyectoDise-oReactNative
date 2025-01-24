import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase';

export function RegisterScreen() {
  const [form, setForm] = useState({
    nick: '',
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
  });
  
  const apiUrl = 'http://192.168.1.171:8080/proyecto01/users'; 

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const { email, password, nick, name, lastName1, lastName2 } = form;

    if (!email || !password || !nick || !name || !lastName1 || !lastName2) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const usuarioData = {
        nick,
        user_id: userId,
        nombre: name,
        apellidos: `${lastName1} ${lastName2}`,
      };

      if (!apiUrl) {
        Alert.alert("Error", "La URL de la API no está configurada");
        return;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Usuario creado correctamente en Firebase y MongoDB');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Error al registrar el usuario en MongoDB');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Error al registrar el usuario');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/formulario.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Completar los siguientes campos:</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduzca su nick"
        placeholderTextColor="#aaa"
        value={form.nick}
        onChangeText={(value) => handleInputChange('nick', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su nombre"
        placeholderTextColor="#aaa"
        value={form.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su primer apellido"
        placeholderTextColor="#aaa"
        value={form.lastName1}
        onChangeText={(value) => handleInputChange('lastName1', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su segundo apellido"
        placeholderTextColor="#aaa"
        value={form.lastName2}
        onChangeText={(value) => handleInputChange('lastName2', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo electrónico"
        placeholderTextColor="#aaa"
        value={form.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña"
        placeholderTextColor="#aaa"
        value={form.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>FINALIZAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    color: '#70c100',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    color: '#fff',
    padding: 10,
    marginVertical: 10,
  },
  submitButton: {
    width: '80%',
    backgroundColor: '#70c100',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
