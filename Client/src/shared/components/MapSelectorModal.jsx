// src/shared/components/MapSelectorModal.jsx
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { X } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { textStyles } from '../../theme/typography';

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html, #map {
      margin: 0; padding: 0; width: 100%; height: 100%;
    }
    #confirm-btn {
      position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
      background: #704F38; color: white; border: none; padding: 14px 28px;
      font-size: 16px; font-weight: bold; border-radius: 30px; cursor: pointer;
      z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      font-family: sans-serif;
    }
    #search-container {
      position: absolute; top: 10px; left: 10px; right: 10px;
      display: flex; gap: 8px; z-index: 1000;
    }
    #search-input {
      flex: 1; padding: 12px; border: none; border-radius: 8px;
      font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      outline: none; font-family: sans-serif;
    }
    #locate-btn {
      width: 44px; height: 44px; border: none; border-radius: 8px;
      background: white; font-size: 20px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    #address-box {
      position: absolute; top: 64px; left: 10px; right: 10px;
      background: white; padding: 12px; border-radius: 8px; font-size: 14px;
      z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-family: sans-serif; line-height: 1.4;
      color: #333;
    }
  </style>
</head>
<body>
  <div id="search-container">
    <input type="text" id="search-input" placeholder="Search address or city..." />
    <button id="locate-btn" title="Current Location">🎯</button>
  </div>
  <div id="address-box">Locating your position...</div>
  <div id="map"></div>
  <button id="confirm-btn">Confirm Location</button>

  <script>
    // Initialize map
    var defaultLat = 20.5937;
    var defaultLng = 78.9629;
    var map = L.map('map').setView([defaultLat, defaultLng], 5); // Zoom out a bit for India view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marker
    var marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
    var confirmedData = null;

    // Reverse Geocode function using Nominatim
    function reverseGeocode(lat, lng) {
      document.getElementById('address-box').innerText = "Fetching address details...";
      fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng + '&addressdetails=1')
        .then(response => response.json())
        .then(data => {
          var address = data.display_name;
          
          // Formulate a short city/town & country address
          var addr = data.address || {};
          var city = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.county || '';
          var country = addr.country || '';
          var shortAddress = city;
          if (city && country) {
            shortAddress = city + ", " + country;
          } else {
            shortAddress = city || country || "India";
          }

          document.getElementById('address-box').innerText = address;
          
          confirmedData = {
            type: 'location_data',
            lat: lat,
            lng: lng,
            address: address,
            shortAddress: shortAddress,
            addressDetails: data.address
          };

          window.ReactNativeWebView.postMessage(JSON.stringify(confirmedData));
        })
        .catch(err => {
          document.getElementById('address-box').innerText = "Coordinates: " + lat.toFixed(5) + ", " + lng.toFixed(5);
          confirmedData = {
            type: 'location_data',
            lat: lat,
            lng: lng,
            address: lat.toFixed(5) + ", " + lng.toFixed(5),
            shortAddress: lat.toFixed(5) + ", " + lng.toFixed(5),
            addressDetails: {}
          };
          window.ReactNativeWebView.postMessage(JSON.stringify(confirmedData));
        });
    }

    // Try to locate user on load
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', function(e) {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    map.on('locationerror', function() {
      reverseGeocode(defaultLat, defaultLng);
    });

    // Handle marker drag
    marker.on('dragend', function(e) {
      var position = marker.getLatLng();
      reverseGeocode(position.lat, position.lng);
    });

    // Handle map click
    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    // Locate Me button handler
    document.getElementById('locate-btn').addEventListener('click', function() {
      document.getElementById('address-box').innerText = "Locating position...";
      map.locate({ setView: true, maxZoom: 16 });
    });

    // Manual search geocoding handler
    document.getElementById('search-input').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        var query = e.target.value;
        if (!query) return;
        
        document.getElementById('address-box').innerText = "Searching...";
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&addressdetails=1')
          .then(response => response.json())
          .then(results => {
            if (results && results.length > 0) {
              var result = results[0];
              var lat = parseFloat(result.lat);
              var lng = parseFloat(result.lon);
              var latlng = L.latLng(lat, lng);
              
              map.setView(latlng, 15);
              marker.setLatLng(latlng);
              
              var address = result.display_name;
              
              var addr = result.address || {};
              var city = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.county || '';
              var country = addr.country || '';
              var shortAddress = city;
              if (city && country) {
                shortAddress = city + ", " + country;
              } else {
                shortAddress = city || country || "India";
              }

              document.getElementById('address-box').innerText = address;
              
              confirmedData = {
                type: 'location_data',
                lat: lat,
                lng: lng,
                address: address,
                shortAddress: shortAddress,
                addressDetails: result.address
              };

              window.ReactNativeWebView.postMessage(JSON.stringify(confirmedData));
            } else {
              document.getElementById('address-box').innerText = "No results found for '" + query + "'";
            }
          })
          .catch(err => {
            document.getElementById('address-box').innerText = "Search failed. Try again.";
          });
      }
    });

    // Handle confirm click
    document.getElementById('confirm-btn').addEventListener('click', function() {
      if (confirmedData) {
        confirmedData.type = 'location_confirmed';
        window.ReactNativeWebView.postMessage(JSON.stringify(confirmedData));
      }
    });
  </script>
</body>
</html>
`;

const MapSelectorModal = ({ visible, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(true);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'location_confirmed') {
        onConfirm?.(data);
        onClose();
      }
    } catch (e) {
      console.warn('Map message parsing error:', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Location</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Map View */}
        <View style={styles.mapWrapper}>
          <WebView
            originWhitelist={['*']}
            source={{ html: MAP_HTML }}
            onLoadEnd={() => setLoading(false)}
            onMessage={handleMessage}
            style={styles.webview}
            geolocationEnabled={true}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    backgroundColor: colors.white,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...textStyles.h5,
    fontWeight: '700',
    color: colors.text,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapSelectorModal;
