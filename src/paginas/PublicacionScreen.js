import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; 
import { auth } from '../utils/Firebase';

// Función para calcular fecha
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

export function PublicacionScreen({ route }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const userId = auth.currentUser.uid;
  const navigation = useNavigation(); 
  const { selectedPostId } = route.params; 

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName || currentUser.email || 'Usuario');
    }

    fetchPublicaciones();
    fetchComentarios();
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

  const fetchComentarios = async () => {
    try {
      const url = `http://192.168.1.154:8080/proyecto01/comentarios/${selectedPostId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener comentarios');
      }

      const data = await response.json();
      setComentarios(data || []);
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
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
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
        onError={(e) =>
          console.log('Error al cargar la imagen:', e.nativeEvent.error)
        }
      />
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Icon
            name={userLikes.has(item.id) ? 'heart' : 'heart-o'}
            size={24}
            color={userLikes.has(item.id) ? '#ff0000' : '#ffffff'}
          />
        </TouchableOpacity>
        <Text style={styles.likeCount}>{item.likes || 0} Me gusta</Text>
      </View>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.comentario}</Text>
      <Text style={styles.date}>{timeAgo(item.createdAt)}</Text>
    </View>
  );

  const selectedPost = publicaciones.find((pub) => pub.id === selectedPostId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>  
          <Icon name="arrow-left" size={20} color="#9FC63B" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.userDetails}>
            <Image
              source={require('../../assets/perfil.png')}
              style={styles.userPhoto}
            />
            <View>
              <Text style={styles.publishedBy}>Publicado por</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : selectedPost ? (
        <View style={styles.publicacion}>
          <Image
            source={{ uri: selectedPost.image_url }}
            style={styles.image}
            onError={(e) =>
              console.log('Error al cargar la imagen:', e.nativeEvent.error)
            }
          />
          <View style={styles.likeContainer}>
            <TouchableOpacity onPress={() => handleLike(selectedPost.id)}>
              <Icon
                name={userLikes.has(selectedPost.id) ? 'heart' : 'heart-o'}
                size={24}
                color={userLikes.has(selectedPost.id) ? '#ff0000' : '#ffffff'}
              />
            </TouchableOpacity>
            <Text style={styles.likeCount}>{selectedPost.likes || 0} Me gusta</Text>
          </View>
          <Text style={styles.title}>{selectedPost.titulo}</Text>
          <Text style={styles.description}>{selectedPost.comentario}</Text>
          <Text style={styles.date}>{timeAgo(selectedPost.createdAt)}</Text>

          {/* Título de comentarios */}
          <Text style={styles.commentsTitle}>COMENTARIOS</Text>

          {/* Mostrar comentarios */}
          <FlatList
            data={comentarios}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentUser}>{item.user}</Text>
                <Text style={styles.commentText}>{item.texto}</Text>
                <Text style={styles.commentDate}>{timeAgo(item.createdAt)}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      ) : (
        <Text style={styles.noPublicaciones}>Publicación no encontrada.</Text>
      )}
      
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('ComentarioScreen', { postId: selectedPostId })}
        >
        <Image source={require("../../assets/botonComentarios.png")} style={styles.floatingImage} />
        </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272A',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishedBy: {
    color: '#cccccc',
    fontSize: 12,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#9FC63B',
  },
  publicacion: {
    marginBottom: 20,
    backgroundColor: '#23272A',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
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
  commentsTitle: {
    color: '#9FC63B',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  commentContainer: {
    marginBottom: 15,
    backgroundColor: '#2f353a',
    padding: 10,
    borderRadius: 5,
  },
  commentUser: {
    color: '#9FC63B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  commentDate: {
    color: '#888888',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23272A',
  },
  noPublicaciones: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9FC63B',
    borderRadius: 50,
    padding: 10,
    zIndex: 999,
  },
  floatingImage: {
    width: 60,
    height: 60,
  },
  commentsTitle: {
    color: '#9FC63B',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  commentContainer: {
    marginBottom: 15,
    backgroundColor: '#2f353a',
    padding: 10,
    borderRadius: 5,
  },
  commentUser: {
    color: '#9FC63B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  commentDate: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 5,
  }
});
