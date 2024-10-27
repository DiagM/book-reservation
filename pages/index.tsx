import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl md:text-6xl font-bold text-center text-blue-800 mb-8">
                    Bienvenue sur notre Système de Réservation de Livres
                </h1>
                <p className="text-xl text-center text-gray-600 mb-12">
                    Découvrez, réservez et lisez vos livres préférés en toute simplicité.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                    <Link href="/books">
                        <Button className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                            Voir les Livres
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    )
}