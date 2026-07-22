import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Animated,
  TouchableOpacity, Dimensions, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setOnboardingSeen, getOnboardingSeen } from '../../../shared/utils/storage';
import Button    from '../../../shared/components/Button';
import { colors }    from '../../../theme/colors';
import { spacing, layout }   from '../../../theme/spacing';
import { textStyles } from '../../../theme/typography';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { 
    id: '1', 
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', 
    title: 'Wishlist: Where Fashion\nDreams Begin', 
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' 
  },
  { 
    id: '2', 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop', 
    title: 'Seamless Shopping\nExperience', 
    subtitle: 'Browse, filter, and checkout in seconds with a seamless experience tailored to you.' 
  },
  { 
    id: '3', 
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop', 
    title: 'Swift & Secure\nDelivery', 
    subtitle: 'Get your favorite fashion items delivered straight to your door quickly and securely.' 
  },
];

const OnboardingScreen = () => {
  const navigation  = useNavigation();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setOnboardingSeen();
      navigation.replace('Welcome');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleSkip = async () => {
    await setOnboardingSeen();
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) =>
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            {/* The Image */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.phoneMockupPlaceholder} />
            </View>

            {/* The Bottom Card */}
            <View style={styles.bottomCard}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              
              {/* Controls Row */}
              <View style={styles.controlsRow}>
                {/* Back button (hidden on first slide) */}
                <TouchableOpacity 
                  style={[styles.circleBtn, styles.circleBtnOutline, index === 0 && { opacity: 0 }]}
                  onPress={handleBack}
                  disabled={index === 0}
                >
                  <Text style={[styles.arrowText, { color: '#000000' }]}>←</Text>
                </TouchableOpacity>

                {/* Pagination Dots */}
                <View style={styles.dots}>
                  {SLIDES.map((_, i) => (
                    <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                  ))}
                </View>

                {/* Next button */}
                <TouchableOpacity style={styles.circleBtn} onPress={handleNext}>
                  <Text style={styles.arrowText}>→</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F8F8F8' }, // Light gray background
  skip: {
    position: 'absolute', top: spacing[14], right: spacing[6], zIndex: 10,
  },
  skipText:   { ...textStyles.body2, color: colors.textMuted, fontWeight: '600' },
  slide: {
    width,
    height,
    alignItems:  'center',
    justifyContent: 'flex-end', // push card to bottom
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing[16],
  },
  phoneMockupPlaceholder: {
    width: 260,
    height: 500,
    backgroundColor: '#D1D1D1',
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#222',
    overflow: 'hidden',
  },
  bottomCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: spacing[10],
    paddingBottom: spacing[12],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  title: { 
    ...textStyles.h2, 
    color: colors.text, 
    textAlign: 'center', 
    marginBottom: spacing[4], 
    lineHeight: 32,
    fontWeight: '800',
  },
  subtitle: { 
    ...textStyles.body2, 
    color: colors.textMuted, 
    textAlign: 'center', 
    lineHeight: 22, 
    paddingHorizontal: spacing[4],
    marginBottom: spacing[10],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  dots: {
    flexDirection:  'row',
    gap:            8,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: { backgroundColor: colors.primary },
  circleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  arrowText: {
    color: colors.white,
    fontSize: 22,
  }
});

export default OnboardingScreen;
