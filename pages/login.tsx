import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Import the Auth context

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth(); // Get the login function from Auth context

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.isAdmin) window.location.href = '/admin';
                else window.location.href = '/books';
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative bg-fixed bg-[url('/images/background.jpg')]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-80" />

            <div className="relative z-10 sm:max-w-md w-full p-6 bg-white rounded-lg shadow-xl shadow-blue-800/50 transform transition duration-500 ease-in-out hover:scale-105 hover:shadow-2xl">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                    Connectez-vous à votre compte
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse e-mail
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                    </div>

                    {errorMessage && (
                        <div className="text-center text-red-600 text-sm font-semibold bg-red-100 p-3 rounded-md mb-3">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-3 px-6 rounded-lg shadow-lg text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition duration-300"
                        >
                            Se connecter
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-500">Ou</span>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/register" legacyBehavior>
                        <a className="inline-block py-3 px-5 mt-3 w-full text-blue-600 font-semibold bg-white border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300 shadow-sm">
                            Créer un nouveau compte
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    );
}
