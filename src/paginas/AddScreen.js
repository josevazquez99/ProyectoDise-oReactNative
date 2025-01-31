import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../utils/Firebase';

const CLOUD_NAME = "dhjbacqmj";
const UPLOAD_PRESET = "example";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const SERVER_URL = 'http://192.168.1.145:8080/proyecto01/publicaciones';

export function AddScreen() {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [comentario, setComentario] = useState('');

    useEffect(() => {
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            Alert.alert('Permiso denegado', 'Es necesario otorgar permisos para usar la cámara');
        }
    };

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

    const uploadImage = async () => {
        console.log('Se ha pulsado el botón PUBLICAR');
        if (!image) {
            Alert.alert('Error', 'Por favor selecciona o toma una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            type: 'image/jpeg',
            name: 'photo.jpg',
        });
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
            console.log('Enviando imagen a Cloudinary...');
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al subir a Cloudinary: ${errorText}`);
            }

            const data = await response.json();
            console.log('Respuesta de Cloudinary:', data);
            const imageUrl = data.secure_url;

            await savePost(imageUrl, titulo, comentario);
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Error al subir la imagen a Cloudinary:', error);
            Alert.alert('Error', 'Error al subir la imagen');
        }
    };

    const savePost = async (imageUrl, titulo, comentario) => {
        console.log('Entrando en savePost');
        const userName = auth.currentUser?.displayName || 'Usuario Anónimo'; 
        console.log('Usuario obtenido:', userName);
        console.log('Datos a enviar:', { imageUrl, titulo, comentario });

        try {
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: auth.currentUser?.uid,
                    image_url: imageUrl,
                    titulo,
                    comentario,
                    like: [],
                    user: userName,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la respuesta del servidor:', errorText);
                throw new Error(`Error del servidor: ${errorText}`);
            }

            console.log('Publicación guardada con éxito');
        } catch (error) {
            console.error('Error en savePost:', error);
            Alert.alert('Error', 'No se pudo guardar la publicación');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>PUBLICACIÓN</Text>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={styles.imageContainer} onPress={takePhoto}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Image source={require('../../assets/imageAdd.png')} style={styles.image} />
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Título:</Text>
            <TextInput
                style={styles.input}
                placeholder="Máx. 40 Caracteres"
                maxLength={40}
                placeholderTextColor="#888"
                value={titulo}
                onChangeText={setTitulo}
            />

            <Text style={styles.label}>Descripción:</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Máx. 250 Caracteres"
                maxLength={250}
                multiline
                placeholderTextColor="#888"
                value={comentario}
                onChangeText={setComentario}
                blurOnSubmit={false}
                returnKeyType="default"
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
        backgroundColor: '#23272A',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    header: {
        fontSize: 26,
        color: '#9EF01A',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderWidth: 2,
        borderColor: '#9EF01A',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 18,
        color: '#9EF01A',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#323639',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#444',
    },
    textArea: {
        height: 170,
        textAlignVertical: 'top',
    },
    uploadButton: {
        backgroundColor: '#323639',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#9EF01A',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    uploadButtonText: {
        color: '#DFDFDF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
