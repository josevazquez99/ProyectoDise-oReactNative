import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';

export function SettingsScreen() {
    const [numeroEquipo, setnumeroEquipo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [showIncidentForm, setShowIncidentForm] = useState(false);

    const handleSubmit = async () => {
        if (!numeroEquipo || !titulo || !descripcion) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }

        const incidencia = {
            numeroEquipo,
            titulo,
            descripcion,
            fecha: new Date().toISOString()
        };

        try {
            const response = await fetch('http://192.168.1.154:8080/proyecto01/incidencias/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(incidencia)
            });

            if (!response.ok) {
                throw new Error(`Error al procesar la incidencia: ${response.status}`);
            }

            Alert.alert(
                'Incidencia enviada',
                'La incidencia se ha guardado correctamente en la base de datos y enviado el correo',
                [{
                    text: 'Aceptar',
                    onPress: () => {
                        setnumeroEquipo('');
                        setTitulo('');
                        setDescripcion('');
                        setShowIncidentForm(false);
                    }
                }]
            );
        } catch (error) {
            console.error("Error al procesar la incidencia:", error);
            Alert.alert("Error", error.message);
        }
    };

    const handleAddIncident = () => {
        setShowIncidentForm(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>INCIDENCIAS</Text>

            <View style={styles.incidentContainer}>
                <View style={[styles.incidentItem, styles.solucionado]}>
                    <Text style={styles.incidentTitle}>TÍTULO DE INCIDENCIA SOLUCIONADO</Text>
                </View>
                <View style={[styles.incidentItem, styles.tramite]}>
                    <Text style={styles.incidentTitle}>TÍTULO DE INCIDENCIA EN TRÁMITE</Text>
                </View>
                <View style={[styles.incidentItem, styles.denegado]}>
                    <Text style={styles.incidentTitle}>TÍTULO DE INCIDENCIA DENEGADA</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddIncident}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {showIncidentForm && (
                <View style={styles.incidentFormContainer}>
                    <Image
                        source={require('../../assets/imageAdd.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.label}>Nº del equipo / close:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Máx. 40 Caracteres"
                        maxLength={40}
                        placeholderTextColor="#888"
                        value={numeroEquipo}
                        onChangeText={setnumeroEquipo}
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
                        blurOnSubmit={false}
                        returnKeyType="default"
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
    incidentContainer: {
        marginBottom: 20,
    },
    incidentItem: {
        backgroundColor: '#323639',
        padding: 20,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
    },
    solucionado: {
        borderColor: '#00FF00',
    },
    tramite: {
        borderColor: '#FFFF00',
    },
    denegado: {
        borderColor: '#FF0000',
    },
    incidentTitle: {
        color: '#DFDFDF',
        fontSize: 18,
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
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#23272A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logo: {
        width: '50%',
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
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
    submitButtonText: {
        color: '#DFDFDF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
