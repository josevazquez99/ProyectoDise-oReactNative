import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../utils/Firebase';

export function HomeScreen() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser.uid;

  const fetchPublicaciones = async () => {
    try {
      const url = 'http://192.168.1.171:8080/proyecto01/publicaciones'; 
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener publicaciones');
      }

      const data = await response.json();
      setPublicaciones(data || []);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const pubIndex = publicaciones.findIndex(pub => pub.id === id);
      const updatedPublicaciones = [...publicaciones];

      updatedPublicaciones[pubIndex].likes += 1;
      setPublicaciones(updatedPublicaciones);

      const url = `http://192.168.1.171:8080/proyecto01/publicaciones/put/${id}/${userId}`; 
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: updatedPublicaciones[pubIndex].likes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el like');
      }

    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a la pantalla de inicio!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          contentContainerStyle={styles.imageContainer}
          data={publicaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.userId}>ID del Usuario: {item.userId}</Text>
              <Text style={styles.title}>{item.titulo}</Text>
              {item.image_url && (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                  onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
                />
              )}
              <Text style={styles.description}>{item.comentario}</Text>
              <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Icon
                    name={item.likes > 0 ? 'heart' : 'heart-o'}
                    size={30}
                    color={item.likes > 0 ? '#ff0000' : '#ffffff'}
                  />
                </TouchableOpacity>
                <Text style={styles.likeCount}>{item.likes || 0} Likes</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingTop: 20,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  userId: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 5,
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  description: {
    color: '#cccccc',
    fontSize: 14,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  likeCount: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },
});
