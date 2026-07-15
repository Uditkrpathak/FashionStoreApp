// src/features/products/screens/ImageGalleryScreen.jsx
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const { width, height } = Dimensions.get('window');

const ImageGalleryScreen = () => {
  const navigation = useNavigation();
  const route      = useRoute();
  const { images = [], index: initialIndex = 0 } = route.params ?? {};
  const [current, setCurrent] = useState(initialIndex);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        initialScrollIndex={initialIndex}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) =>
          setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
        )}
      />
      <View style={styles.counter}>
        <Text style={styles.counterText}>{current + 1} / {images.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  close: { position: 'absolute', top: spacing[12], right: spacing[4], zIndex: 10, padding: spacing[2] },
  closeText: { color: colors.white, fontSize: 24, fontWeight: '700' },
  image:     { width, height },
  counter:   { position: 'absolute', bottom: spacing[8], width: '100%', alignItems: 'center' },
  counterText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});

export default ImageGalleryScreen;
