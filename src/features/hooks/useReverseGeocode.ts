// // hooks/useReverseGeocode.ts
// import {useState} from 'react';
// import * as Location from 'expo-location';
// import {Alert} from 'react-native';
// import {Address} from "@/store/slices/addressSlice";
//
// export const useReverseGeocode = () => {
//     const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
//
//     const reverseGeocode = async (latitude: number, longitude: number): Promise<Address | null> => {
//         try {
//             setIsReverseGeocoding(true);
//             const [addressData] = await Location.reverseGeocodeAsync({latitude, longitude});
//             if (addressData) {
//                 const formattedAddress: Address = {
//                     id: '',
//                     title: '',
//                     street: addressData.street || '',
//                     neighborhood: addressData.subregion || '',
//                     district: addressData.city || '',
//                     province: addressData.region || '',
//                     country: addressData.country || '',
//                     postalCode: addressData.postalCode || '',
//                     apartmentNo: '',
//                     doorNo: '',
//                     latitude,
//                     longitude,
//                     is_primary: false,
//                 };
//                 console.log('Formatted address:', formattedAddress);
//                 return formattedAddress;
//             } else {
//                 Alert.alert('No Address Found', 'Unable to retrieve address for the selected location.');
//                 return null;
//             }
//         } catch (error) {
//             console.error('Error fetching address:', error);
//             Alert.alert('Error', 'An error occurred while fetching the address.');
//             return null;
//         } finally {
//             setIsReverseGeocoding(false);
//         }
//     };
//
//     return {reverseGeocode, isReverseGeocoding};
// };
