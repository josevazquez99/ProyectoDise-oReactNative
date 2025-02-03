import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../utils/Firebase';
import { useNavigation } from '@react-navigation/native'; 

export function ComentarioScreen({ route }) {
  const [comentario, setComentario] = useState('');
  const userId = auth.currentUser?.uid;
  const { postId } = route.params;  
  const navigation = useNavigation();  

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
  
        const data = await response.json();
        console.log('Comentario publicado:', data);
        setComentario('');
        navigation.navigate('PublicacionScreen');  
      } catch (error) {
        console.error('Error al publicar el comentario:', error);
      }
    }
  };
  

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={() => navigation.goBack()} /> 
      <View style={styles.commentBox}>
        <Text style={styles.label}>Comentario:</Text>
        <TextInput
          style={styles.input}
          placeholder="Máx. 500 Caracteres"
          placeholderTextColor="#888"
          maxLength={500}
          multiline
          value={comentario}
          onChangeText={setComentario}
        />
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={handlePublicar}>
            <Text style={styles.buttonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  commentBox: {
    backgroundColor: '#23272A',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    color: '#9FC63B',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 150,
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#9FC63B',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
