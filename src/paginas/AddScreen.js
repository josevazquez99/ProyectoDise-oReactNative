import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../utils/Firebase';

const CLOUD_NAME = "dhjbacqmj";
const UPLOAD_PRESET = "example";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const SERVER_URL = 'http://localhost:8080/proyecto01/publicaciones';

export function AddScreen() {
    const userId = auth.currentUser.uid;
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [comentario, setComentario] = useState('');

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraPermission.status !== 'granted' || galleryPermission.status !== 'granted') {
            Alert.alert('Permiso denegado', 'Es necesario otorgar permisos para usar la cámara o la galería');
        }
    };


    const takePhoto = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al abrir la cámara:', error);
            Alert.alert('Error', 'No se pudo acceder a la cámara');
        }
    };

    const uploadImage = async () => {
        if (!image) {
            Alert.alert('Error', 'Por favor selecciona o toma una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            type: 'image/jpeg',  // Asegúrate de que el tipo de archivo sea correcto
            name: 'photo.jpg',   // Asigna un nombre adecuado
        });
        formData.append('upload_preset', UPLOAD_PRESET);

        console.log('FormData:', formData);  // Revisa los datos antes de enviarlos

        try {
            const response = await axios.post(CLOUDINARY_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const imageUrl = response.data.secure_url;

            await savePost(imageUrl, titulo, comentario);
            await saveImageToStorage(imageUrl, titulo, comentario);

            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error(error);
            if (error.response) {
                // La solicitud se hizo y el servidor respondió con un código de estado
                console.error('Error response:', error.response.data);
                console.error('Status:', error.response.status);
                Alert.alert('Error', `Error al subir la imagen: ${error.response.data.message || error.message}`);
            } else if (error.request) {
                // La solicitud fue hecha, pero no hubo respuesta
                console.error('No response received:', error.request);
                Alert.alert('Error', 'No se recibió respuesta del servidor');
            } else {
                // Algo pasó al configurar la solicitud
                console.error('Error', error.message);
                Alert.alert('Error', error.message);
            }
        }
    };

    const savePost = async (imageUrl, titulo, comentario) => {
        const userName = await AsyncStorage.getItem('userName');
        const postData = {
            user_id: userId,
            image_url: imageUrl,
            titulo,
            comentario,
            like: [],
            user: userName,
        };

        console.log("Enviando datos al servidor:", postData);

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la publicación');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Alert.alert('Error', 'No se pudo guardar la publicación');
        }
    };

    const saveImageToStorage = async (imageUrl, titulo, comentario) => {
        const userName = await AsyncStorage.getItem('userName');
        const storedImages = await AsyncStorage.getItem('images');
        const imagesArray = storedImages ? JSON.parse(storedImages) : [];
        imagesArray.push({ url: imageUrl, user: userName, caption: comentario, liked: false });
        await AsyncStorage.setItem('images', JSON.stringify(imagesArray));
        console.log("Imágenes guardadas en AsyncStorage:", imagesArray);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>PUBLICACIÓN</Text>
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => takePhoto()} style={styles.touchableOpacity}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                    <Image source={require('../../assets/image.png')} style={styles.imagePreview} />
                )}
                </TouchableOpacity>
            </View>
            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                placeholder="Máx. 40 Caracteres"
                placeholderTextColor="gray"
                value={titulo}
                maxLength={40}
                onChangeText={setTitulo}
            />
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Máx. 250 Caracteres"
                placeholderTextColor="gray"
                value={comentario}
                maxLength={250}
                multiline
                onChangeText={setComentario}
            />
            <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
                <Text style={styles.uploadButtonText}>PUBLICAR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        color: '#9FC63B',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    imageContainer: {
        width: 140,
        height: 140,
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 5,
        borderColor: '#9FC63B',
    },
    imagePreview: {
        width: '80%',
        height: '80%',
        borderRadius: 15,
    },
    label: {
        alignSelf: 'flex-start',
        color: '#9FC63B',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#262626',
        color: 'white',
        borderRadius: 5,
        width: '100%',
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#1a1a1a',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        width: '40%',
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#9FC63B',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
