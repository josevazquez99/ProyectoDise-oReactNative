import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../utils/Firebase';

const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  }
};

export function HomeScreen({ navigation }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email || 'Usuario');
    }

    fetchPublicaciones();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      const url = 'http://192.168.1.154:8080/proyecto01/publicaciones';
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
      const pubIndex = publicaciones.findIndex((pub) => pub.id === id);
      const updatedPublicaciones = [...publicaciones];
      const pub = updatedPublicaciones[pubIndex];

      if (userLikes.has(id)) {
        pub.likes -= 1;
        setUserLikes((prev) => {
          const newLikes = new Set(prev);
          newLikes.delete(id);
          return newLikes;
        });
      } else {
        pub.likes = (pub.likes || 0) + 1;
        setUserLikes((prev) => new Set(prev).add(id));
      }

      setPublicaciones(updatedPublicaciones);

      const url = `http://192.168.1.154:8080/proyecto01/publicaciones/put/${id}/${userId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: pub.likes,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el like');
      }
    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.publicacion}>
      <TouchableOpacity onPress={() => navigation.navigate('PublicacionScreen', { selectedPostId: item.id })}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          onError={(e) =>
            console.log('Error al cargar la imagen:', e.nativeEvent.error)
          }
        />
      </TouchableOpacity>
      <View style={styles.overlay}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#9FC63B" />
        </TouchableOpacity>
        <View style={styles.userDetails}>
          <Image
            source={require('../../assets/perfil.png')}
            style={styles.userPhoto}
          />
          <View style={styles.userTextContainer}>
            <Text style={styles.publishedBy}>Publicado por</Text>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.date}>{timeAgo(item.createdAt)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Icon
            name={userLikes.has(item.id) ? 'heart' : 'heart-o'}
            size={24}
            color={userLikes.has(item.id) ? '#9FC63B' : '#ffffff'}
          />
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes || 0} Me gusta</Text>
      </View>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.comentario}</Text>
      <Text style={styles.commentCount}>
        {item.comentarios && item.comentarios.length
          ? `${item.comentarios.length} comentario${item.comentarios.length > 1 ? 's' : ''}`
          : 'Sin comentarios'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/cabecera.png")} style={styles.logo} />
      <FlatList
        data={publicaciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.imageContainer}
        ListEmptyComponent={
          <Text style={styles.noPublicaciones}>
            No hay publicaciones disponibles.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
  },
  imageContainer: {
    padding: 10,
    flexGrow: 1, 
  },
  publicacion: {
    marginBottom: 20,
    backgroundColor: '#23272A',
    padding: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#9FC63B',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  publishedBy: {
    color: '#cccccc',
    fontSize: 12,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  likeCount: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 14,
  },
  title: {
    color: '#9FC63B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5,
  },
  date: {
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  logo: {
    width: '100%',
    height: 90,
    marginBottom: 20,
  },
  noPublicaciones: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  commentCount: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
});
