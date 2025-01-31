import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export function ComentarioScreen({ onClose }) {
  const [comentario, setComentario] = useState('');

  const handlePublicar = () => {
    if (comentario.trim() !== '') {
      console.log('Comentario publicado:', comentario);
      onClose(); // Cierra el modal después de publicar
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} onPress={onClose} />

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

export default ComentarioScreen;
