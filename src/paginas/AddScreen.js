import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth } from '../utils/Firebase';

export default function AddScreen() {
  const [image, setImage] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [hasTakenPhoto, setHasTakenPhoto] = useState(false); 
  const navigation = useNavigation();
  const route = useRoute();
  const userId = auth.currentUser.uid;

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

    console.log("Resultado de la cámara:", result); 

    if (result.canceled) {
      console.log("La foto fue cancelada.");
      return;
    }

    const imageUri = result.assets?.[0]?.uri;

    if (imageUri) {
      setImage(imageUri);
      setHasTakenPhoto(true);
      console.log("Imagen tomada:", imageUri); 
    } else {
      console.log("No se pudo obtener la URI de la imagen.");
    }
  };

  useEffect(() => {
    if (route.params?.takePhoto) {
      takePhoto();
    }
  }, [route.params]);

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
      console.error(error);
      Alert.alert("Error", "Error al subir la imagen a Cloudinary");
    }
  };

  const handlePost = async () => {
    console.log("Título:", titulo); 
    console.log("Comentario:", comentario); 
    console.log("Imagen:", image); 

    if (!image || !titulo || !comentario) {
      Alert.alert("Error", "Debes completar todos los campos y tomar una foto");
      return;
    }

    const imageUrl = await uploadToCloudinary(image);
    if (!imageUrl) return;

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("comentario", comentario);
    formData.append("user_id", userId);
    formData.append("image_url", imageUrl);

    try {
      const response = await fetch('http://10.0.2.2:8080/proyecto01/publicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          comentario,
          user_id: userId,
          image_url: imageUrl,
        }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Publicación creada correctamente");
        navigation.navigate('TabScreen');
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Error al crear la publicación");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error al enviar la solicitud");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Publicación</Text>

      {hasTakenPhoto ? (
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#fff"
            value={titulo}
            onChangeText={setTitulo}
          />
          <TextInput
            style={styles.input}
            placeholder="Comentario"
            placeholderTextColor="#fff"
            value={comentario}
            onChangeText={setComentario}
          />
          <TouchableOpacity style={styles.button} onPress={handlePost}>
            <Text style={styles.buttonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
          <Text style={styles.text}>Esperando la foto...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#70c100',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#333',
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
});
