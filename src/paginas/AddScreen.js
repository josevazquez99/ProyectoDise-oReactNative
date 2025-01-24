import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../utils/Firebase';

export function AddScreen(){
  const [image, setImage] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [apiUrl] = useState('http://192.168.1.171:8080/proyecto01/publicaciones'); 
  const userId = auth.currentUser?.uid;

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso denegado", "Necesitamos permisos para acceder a la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      console.log("La foto fue cancelada.");
      return;
    }

    const imageUri = result.assets?.[0]?.uri;
    if (imageUri) {
      setImage(imageUri);
      console.log("Foto tomada:", imageUri);
    } else {
      console.log("No se pudo obtener la URI de la imagen.");
    }
  };

  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const fileExtension = filename.split('.').pop();
    const type = fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' : `image/${fileExtension}`;

    formData.append("file", {
      uri: uri,
      type: type,
      name: filename,
    });
    formData.append("upload_preset", "example");

    try {
      console.log("Subiendo imagen a Cloudinary...");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhjbacqmj/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = await response.json();
      console.log("Respuesta de Cloudinary:", data);

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Error al subir la imagen');
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "Error al subir la imagen a Cloudinary");
    }
  };

  const handlePost = async () => {
    if (!image || !titulo || !comentario) {
      Alert.alert("Error", "Debes completar todos los campos y tomar una foto");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "El usuario no está autenticado");
      return;
    }

    console.log("Iniciando subida de imagen...");
    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) {
      console.log("La imagen no se subió correctamente. Abortando publicación.");
      return;
    }

    if (!apiUrl) {
      Alert.alert("Error", "La URL de la API no está configurada");
      return;
    }

    try {
      console.log("Enviando datos al backend...");
      console.log("Datos a enviar:", {
        titulo,
        comentario,
        user_id: userId,
        image_url: imageUrl,
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "*/*"
        },
        body: JSON.stringify({
          titulo,
          comentario,
          user_id: userId,
          image_url: imageUrl,
        }),
      });

      console.log("Respuesta del backend:", response.status);

      if (response.ok) {
        Alert.alert("Éxito", "Publicación creada correctamente");
      } else {
        const errorData = await response.json();
        console.error("Error del backend:", errorData);
        Alert.alert("Error", errorData.message || "Error al crear la publicación");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Alert.alert("Error", "Error al enviar la solicitud");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>PUBLICACIÓN</Text>

        <TouchableOpacity style={styles.imageContainer} onPress={takePhoto}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../../assets/image.png')} style={styles.image} />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Máx. 40 Caracteres"
          placeholderTextColor="#ccc"
          maxLength={40}
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Máx. 250 Caracteres"
          placeholderTextColor="#ccc"
          maxLength={250}
          multiline
          value={comentario}
          onChangeText={setComentario}
        />

        <TouchableOpacity style={styles.publishButton} onPress={handlePost}>
          <Text style={styles.publishButtonText}>PUBLICAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#181a1b',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b3ff00',
    marginBottom: 20,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: '#b3ff00',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  label: {
    alignSelf: 'flex-start',
    color: '#b3ff00',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#2c2f33',
    color: '#fff',
    width: '100%',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  textarea: {
    height: 150,
    textAlignVertical: 'top',
  },
  publishButton: {
    borderWidth: 2,
    borderColor: '#b3ff00',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#181a1b',
    marginTop: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
