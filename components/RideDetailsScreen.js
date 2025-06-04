import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView,ScrollView, ActivityIndicator ,TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../src/api/axios";
import Ionicons from 'react-native-vector-icons/Ionicons';

const RideDetailsScreen = () => {
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubroutes, setShowSubroutes] = useState(false);
  

  const fetchRideDetails = async () => {
    try {
      const ride_id = await AsyncStorage.getItem('ride_id');
      const token = await AsyncStorage.getItem('userToken');

      if (!ride_id || !token) {
        throw new Error('Ride ID or token not found.');
      }

      const response = await api.get(`/rides/ride/${ride_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setRideDetails(response.data);
    } catch (err) {
      console.error('Error fetching ride details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!rideDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load ride details.</Text>
      </View>
    );
  }

  return (

    // <SafeAreaView style={styles.container}>
    //     <ScrollView style={styles.content}>
    //   <Text style={styles.heading}>Ride Details</Text>

    //   <Text style={styles.label}>From:</Text>
    //   <Text style={styles.value}>{rideDetails.originStopName}</Text>

    //   <Text style={styles.label}>To:</Text>
    //   <Text style={styles.value}>{rideDetails.destinationStopName}</Text>

    //   <Text style={styles.label}>Departure Time:</Text>
    //   <Text style={styles.value}>{new Date(rideDetails.departure_time).toLocaleString()}</Text>

    //   <Text style={styles.label}>Available Seats:</Text>
    //   <Text style={styles.value}>{rideDetails.available_seats}</Text>

    //   <Text style={styles.label}>Route ID:</Text>
    //   <Text style={styles.value}>{rideDetails.route_id}</Text>

    //   <Text style={styles.subheading}>Subroutes:</Text>
    //   {rideDetails.subroutes.map((sr, idx) => (
    //     <View key={idx} style={styles.subrouteBox}>
    //       <Text style={styles.subrouteText}>
    //         {sr.from_stop_name} ➜ {sr.to_stop_name}
    //       </Text>
    //       <Text style={styles.subrouteInfo}>Distance: {sr.distance} km</Text>
    //       <Text style={styles.subrouteInfo}>Time: {sr.time} mins</Text>
    //       <Text style={styles.subrouteInfo}>Cost: ₹{sr.cost}</Text>
    //     </View>
    //   ))}
    // </ScrollView>
    // </SafeAreaView>
    <ScrollView>
      <View style={styles.container}>
      <View style={styles.rideCard}>
          <Text style={styles.sectionTitle}>Ride Created</Text>
          <Text style={styles.detailText}>
            From: <Text style={styles.bold}>{rideDetails.originStopName}</Text>
          </Text>
          <Text style={styles.detailText}>
            To: <Text style={styles.bold}>{rideDetails.destinationStopName}</Text>
          </Text>
          <Text style={styles.detailText}>
            Departure: {new Date(rideDetails.departure_time).toLocaleString()}
          </Text>
          <Text style={styles.detailText}>
            Available Seats: {rideDetails.available_seats}
          </Text>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowSubroutes(!showSubroutes)}
          >
            <Text style={styles.subrouteHeader}>Subroute Details</Text>
            <Ionicons
              name={showSubroutes ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          {showSubroutes && (
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>From</Text>
                <Text style={styles.tableCell}>To</Text>
                <Text style={styles.tableCell}>Dist</Text>
                <Text style={styles.tableCell}>Time</Text>
                <Text style={styles.tableCell}>Cost</Text>
              </View>

              {rideDetails.subroutes.map((sr, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{sr.from_stop_name}</Text>
                  <Text style={styles.tableCell}>{sr.to_stop_name}</Text>
                  <Text style={styles.tableCell}>{sr.distance} m</Text>
                  <Text style={styles.tableCell}>{sr.time} min</Text>
                  <Text style={styles.tableCell}>₹{sr.cost}</Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#d9534f', margin: 15 }]}
            onPress={() => setCreatedRideData(null)}
          >
            <Text style={styles.primaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
    </View>
    </ScrollView>
    
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },

  content:{
    padding:20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827'
  },
  primaryButton: {
    backgroundColor: '#1e40af',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#1F2937'
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 10
  },
  value: {
    fontSize: 16,
    color: '#111827'
  },
  subrouteBox: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    marginBottom:10
  },
  subrouteText: {
    fontWeight: '600',
    fontSize: 16
  },
  subrouteInfo: {
    fontSize: 14,
    color: '#4B5563'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  rideCard: {
    marginTop: 20,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom:100
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  detailText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#374151',
  },
  bold: {
    fontWeight: '600',
    color: '#111827',
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#d1d5db',
  },
  subrouteHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#e5e7eb',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    padding:5,
    fontSize: 14,
    color: '#374151',
  },
});

export default RideDetailsScreen;
