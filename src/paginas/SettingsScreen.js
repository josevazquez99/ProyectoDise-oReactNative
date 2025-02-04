import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import emailjs from '@emailjs/browser';

export function SettingsScreen() {
    const [nEquipo, setNEquipo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [showIncidentForm, setShowIncidentForm] = useState(false);

    const handleSubmit = async () => {
        if (!nEquipo || !titulo || !descripcion) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const incidencia = {
            numero_equipo: nEquipo,
            titulo: titulo,
            descripcion: descripcion,
            fecha: new Date().toISOString(),
        };

        try {
            const response = await fetch('http://192.168.1.154:8080/proyecto01/incidencias/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(incidencia),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la incidencia');
            }

            // Enviar correo con los detalles de la incidencia
            await sendEmail(incidencia);

            Alert.alert('Incidencia enviada', 'La incidencia se ha guardado correctamente y se ha enviado un correo.', [
                {
                    text: 'Aceptar',
                    onPress: () => {
                        setNEquipo('');
                        setTitulo('');
                        setDescripcion('');
                        setShowIncidentForm(false);
                    },
                },
            ]);
        } catch (error) {
            console.error('Error al enviar la incidencia:', error);
            Alert.alert('Error', 'No se pudo enviar la incidencia');
        }
    };

    const sendEmail = async (incidencia) => {
        try {
            await emailjs.send(
                'service_wvq1anh', 
                'template_p6pr2ki', 
                {
                    numero_equipo: incidencia.numero_equipo,
                    titulo: incidencia.titulo,
                    descripcion: incidencia.descripcion,
                    fecha: incidencia.fecha,
                    to_email: 'soporte@gmail.com', 
                },
                'AyxFsCkFHvUbEHcAR' 
            );
            console.log('Correo enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el correo:', error);
        }
    };

    const handleAddIncident = () => {
        setShowIncidentForm(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>INCIDENCIAS</Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddIncident}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {showIncidentForm && (
                <View style={styles.incidentFormContainer}>
                    <Text style={styles.label}>Nº del equipo:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Máx. 40 Caracteres"
                        maxLength={40}
                        placeholderTextColor="#888"
                        value={nEquipo}
                        onChangeText={setNEquipo}
                    />

                    <Text style={styles.label}>Título:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Máx. 40 Caracteres"
                        maxLength={40}
                        placeholderTextColor="#888"
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <Text style={styles.label}>Descripción del problema:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Máx. 250 Caracteres"
                        maxLength={250}
                        multiline
                        placeholderTextColor="#888"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>ENVIAR</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    addButton: {
        backgroundColor: '#9EF01A',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    addButtonText: {
        color: '#23272A',
        fontSize: 32,
        fontWeight: 'bold',
    },
    incidentFormContainer: {
        paddingHorizontal: 30,
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
    submitButton: {
        backgroundColor: '#9EF01A',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#23272A',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
