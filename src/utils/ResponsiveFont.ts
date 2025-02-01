import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const guidelineBaseWidth = 375;

export const scaleFont = (size: number) => (width / guidelineBaseWidth) * size;
