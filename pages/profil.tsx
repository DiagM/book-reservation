import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import Link from 'next/link';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [reservations, setReservations] = useState([]);

    // Utiliser useEffect pour charger les données de l'utilisateur
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setName(user.name);
            setEmail(user.email);
            fetchReservations(user.id); // Récupérer les réservations de l'utilisateur
        }
    }, []);

    const fetchReservations = async (userId) => {
        try {
            const response = await fetch(`/api/reservations/getReservations?userId=${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReservations(data);
            } else {
                setMessage('Erreur lors de la récupération des réservations.');
            }
        } catch (error) {
            setMessage('Erreur lors de la récupération des réservations.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const storedUser = localStorage.getItem('user');
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user) {
            setMessage('Utilisateur non trouvé.');
            return;
        }

        try {
            const response = await fetch('/api/auth/profil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Profil mis à jour avec succès !');
                // Mettre à jour les données dans localStorage si nécessaire
                localStorage.setItem('user', JSON.stringify({ ...user, name, email }));
            } else {
                setMessage(data.message || 'Erreur lors de la mise à jour du profil.');
            }
        } catch (error) {
            setMessage('Erreur lors de la mise à jour du profil.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Modifier le profil
                </h2>
                {message && <p className="text-center text-green-600">{message}</p>}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nom complet
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Adresse e-mail
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <Link href="/" legacyBehavior>
                            <a className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50">
                                Retour à l'accueil
                            </a>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Affichage des réservations */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h3 className="text-lg font-medium text-gray-900">Mes Réservations</h3>
                    {reservations.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {reservations.map((reservation) => (
                                <li key={reservation.id} className="border-b border-gray-300 pb-2">
                                    <p><strong>Livre :</strong> {reservation.book.title}</p>
                                    <p><strong>Date de début :</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
                                    <p><strong>Date de fin :</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucune réservation trouvée.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
