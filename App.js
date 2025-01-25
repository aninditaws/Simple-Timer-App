import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';

// Komponen Timer untuk mengelola dan menampilkan timer
const Timer = ({ initialMinutes, initialSeconds, onBackToInput }) => {
  const [time, setTime] = useState(initialMinutes * 60 + initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Mengelola interval timer
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTime((prevTime) => Math.max(prevTime - 1, 0)), 1000);
    } 
    return () => interval && clearInterval(interval);
  }, [isRunning]);

  // Tombol fungsi start/pause dan reset
  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTime(initialMinutes * 60 + initialSeconds);
  };

  // Format waktu ke MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <MaterialIcons name="replay" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: isRunning ? '#FF6347' : '#6C63FF' }]} onPress={handleStartPause}>
          <Ionicons name={isRunning ? "pause" : "play"} size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onBackToInput}>
          <Ionicons name="md-arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Root component yang mengelola state dan navigasi antara input dan timer
const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [showTimer, setShowTimer] = useState(false);

  // Memuat font custom
  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  // Menangani kasus font belum dimuat
  if (!fontLoaded) return <View style={styles.appContainer}><Text>Loading...</Text></View>;

  // Fungsi untuk memulai timer
  const handleStart = () => {
    if (!minutes && !seconds) {
      alert('Please enter a valid time.');
      return;
    }
    setShowTimer(true);
  };

  return (
    <ImageBackground source={require('./assets/focus-bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.appContainer}>
        <Text style={styles.header}>{showTimer ? 'Timer' : 'Set Timer'}</Text>
        {!showTimer ? (
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" value={minutes} onChangeText={setMinutes} />
            <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" value={seconds} onChangeText={setSeconds} />
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Timer initialMinutes={parseInt(minutes) || 0} initialSeconds={parseInt(seconds) || 0} onBackToInput={() => setShowTimer(false)} />
        )}
      </View>
    </ImageBackground>
  );
};

// Styles untuk aplikasi
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 10,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    width: 120,
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 18,
    backgroundColor: '#FFF',
    fontFamily: 'Inter-Regular',
  },
  startButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  timerText: {
    fontSize: 120,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
});

export default App;
