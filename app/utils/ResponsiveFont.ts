import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375; // iPhone 11 width for baseline scaling

export const scaleFont = (size: number) => (width / guidelineBaseWidth) * size;
