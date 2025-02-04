import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../utils/Firebase';
import { useNavigation } from '@react-navigation/native'; 

export function ComentarioScreen({ route }) {
  const [comentario, setComentario] = useState('');
  const userId = auth.currentUser?.uid;
  const postId = route.params?.postId || null; 
  const navigation = useNavigation();  

  if (!postId) {
    console.error("Error: postId no está definido en route.params");
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: No se encontró la publicación.</Text>
      </View>
    );
  }

  const handlePublicar = async () => {
    if (comentario.trim() !== '') {
      try {
        const response = await fetch('http://192.168.1.154:8080/proyecto01/comentarios/put', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            idPublicacion: postId,  
            comentario: comentario
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error al publicar el comentario');
        }
  
        setComentario('');
        navigation.goBack();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribe tu comentario..."
        value={comentario}
        onChangeText={setComentario}
      />
      <TouchableOpacity style={styles.button} onPress={handlePublicar}>
        <Text style={styles.buttonText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
