import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/api/axios';
import tw from 'twrnc';

const RideRequestsScreen = () => {
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    fetchRideRequests();
  }, []);

  const fetchRideRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await api.get('/ride-requests/driver-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res);
      console.log(res.data);
      setRideRequests(res.data);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error fetching ride requests' });
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await api.put(
        `/ride-requests/request/${requestId}/status`,
        {status:action},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      Toast.show({
        type: 'success',
        text1: `Request ${action}ed successfully`,
      });
      fetchRideRequests(); // Refresh UI
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: `Failed to ${action} request`,
        text2: err.response?.data?.message || 'Server error',
      });
      console.error('Ride request update error:', err);
    }
  };
  

  return (
    <ScrollView style={tw`bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4 text-black`}>Ride Requests</Text>
      {rideRequests.length === 0 ? (
        <Text style={tw`text-center text-gray-500`}>No ride requests yet</Text>
      ) : (
        rideRequests.map((ride) => (
          <View key={ride.ride_id} style={styles.card}>
            <Text style={styles.header}>
              {ride.origin} ➜ {ride.destination}
            </Text>
            <Text>Departure: {new Date(ride.departure_time).toLocaleString()}</Text>
            <Text>Available Seats: {ride.available_seats}</Text>
            <Text>Status: {ride.status}</Text>
            {ride.requests.length === 0 ? (
              <Text style={tw`text-gray-500 mt-2`}>No requests yet</Text>
            ) : (
              ride.requests.map((req) => (
                <View key={req.request_id} style={tw`mt-4 p-3 border rounded`}>
                  <Text style={tw`font-bold text-black`}>{req.rider.name} ({req.rider.email})</Text>
                  <Text>Status: {req.status}</Text>
                  <Text>Requested At: {new Date(req.requested_at).toLocaleString()}</Text>
                  {req.status === 'Pending' && (
                    <View style={tw`flex-row justify-between mt-2`}>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#28a745' }]}
                        onPress={() => handleAction(req.request_id, 'accept')}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#dc3545' }]}
                        onPress={() => handleAction(req.request_id, 'reject')}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e40af'
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default RideRequestsScreen;
