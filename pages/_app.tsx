// pages/_app.tsx
import { AppProps } from "next/app";
import Navbar from "../components/ui/Navbar";
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Navbar />
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </>
    );
}

export default MyApp;
