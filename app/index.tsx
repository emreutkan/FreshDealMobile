import {useEffect} from 'react';
import {useRouter} from 'expo-router';

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
