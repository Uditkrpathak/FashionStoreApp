import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export const JacketSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Jacket collar and outline */}
    <Path
      d="M4 6L8 3H16L20 6V21H4V6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Lapels V-neck */}
    <Path
      d="M8 3L12 9L16 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Center zip / button line */}
    <Path
      d="M12 9V21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
    {/* Pockets */}
    <Rect x="6" y="14" width="3.5" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
    <Rect x="14.5" y="14" width="3.5" height="3" rx="0.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const ShirtSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Collared shirt outline */}
    <Path
      d="M6 6L9 3H15L18 6L21 9L18 11V21H6V11L3 9L6 6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Collar points */}
    <Path
      d="M9 3L12 7L15 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Button placket */}
    <Path d="M12 7V21" stroke={color} strokeWidth="1.8" />
    {/* Buttons */}
    <Circle cx="12" cy="10" r="0.8" fill={color} />
    <Circle cx="12" cy="14" r="0.8" fill={color} />
    <Circle cx="12" cy="18" r="0.8" fill={color} />
  </Svg>
);

export const TShirtSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 7L9 4C10.5 5.5 13.5 5.5 15 4L18 7L21 9L18.5 12.5L16.5 11V21H7.5V11L5.5 12.5L3 9L6 7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const DressSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Fashion dress silhouette */}
    <Path
      d="M9 3C9 3 10.5 4.5 12 4.5C13.5 4.5 15 3 15 3L17 7L14.5 10H9.5L7 7L9 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Dress flare skirt */}
    <Path
      d="M9.5 10L4 21H20L14.5 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Waistline belt */}
    <Path
      d="M9.5 10H14.5"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

export const JeansSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Jeans pants outline */}
    <Path
      d="M5 4H19V8L17.5 21H12.5L12 12L11.5 21H6.5L5 8V4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Waistband & fly seam */}
    <Path d="M5 7H19" stroke={color} strokeWidth="1.5" />
    <Path d="M12 7V12" stroke={color} strokeWidth="1.8" />
    {/* Curved front pockets */}
    <Path d="M5 9C7.5 9 9 7.5 9 7" stroke={color} strokeWidth="1.5" />
    <Path d="M19 9C16.5 9 15 7.5 15 7" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const ShoesSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17L4 12L7 11L11 13L16 11C19 11 21 13 21 16V18H3V17Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M3 18H21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const AccessoriesSvgIcon = ({ size = 26, color = '#704F38' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Handbag */}
    <Rect x="4" y="9" width="16" height="12" rx="3" stroke={color} strokeWidth="2" />
    <Path d="M8 9V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V9" stroke={color} strokeWidth="2" />
  </Svg>
);
