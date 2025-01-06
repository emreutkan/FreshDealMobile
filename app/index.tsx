import {useEffect} from 'react';
import {useRouter} from 'expo-router';
import 'react-native-get-random-values'; // this is needed for the uuid package to work

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            router.push('/features/LoginRegister/screens/loginPage');
        });

        return () => cancelAnimationFrame(handle);
    }, [router]);

    return null;
};

export default Index;
