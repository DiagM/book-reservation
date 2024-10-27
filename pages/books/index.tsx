import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Book } from '@prisma/client';

const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl">
        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{book.title}</h3>
            <Link href={`/books/${book.id}`} legacyBehavior>
                <a className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
                    Voir les détails
                </a>
            </Link>
        </div>
    </div>
);

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books'); // Fetch from the API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data: Book[] = await response.json();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) return <p>Loading books...</p>;
    if (error) return <p>Error loading books: {error}</p>;

    // Filtrer les livres en fonction du terme de recherche
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                    Nos Livres Disponibles
                </h1>
                {/* Champ de recherche */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Rechercher par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 mx-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))
                    ) : (
                        <p>Aucun livre trouvé avec ce titre.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
