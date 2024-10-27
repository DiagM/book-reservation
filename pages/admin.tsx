import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import { toast } from 'react-toastify';

const BookManagementCard = ({ book, onDelete }: { book: any; onDelete: (id: string) => void }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
            <p className="text-gray-600">ID: {book.id}</p>
        </div>
        <Button
            onClick={() => onDelete(book.id)}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
            Supprimer
        </Button>
    </div>
);

export default function Admin() {
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [newBookTitle, setNewBookTitle] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (token && storedUser && !JSON.parse(storedUser).isAdmin) {
            router.push('/');
        } else if (!storedUser) {
            router.push('/');
        }

        const fetchBooks = async () => {
            try {
                const response = await fetch('/api/books', { method: 'GET' });
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                setBooks(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
                toast.error('Failed to fetch books. Please try again later.');
            }
        };

        fetchBooks();
    }, [router]);

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        const newBook = { title: newBookTitle };
        // Check if the title is empty before proceeding
        if (!newBookTitle.trim()) {
            toast.error('Title is required.');
            return; // Exit the function early if title is empty
        }
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newBook),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add book');
            }

            const addedBook = await response.json();
            setBooks([...books, addedBook]);
            setNewBookTitle('');
            toast.success('Book added successfully!');
        } catch (error) {
            console.error('Error adding book:', error);
            alert(error.message || 'Failed to add the book. Please try again.');
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`/api/books/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.text();

                if (!response.ok) {
                    throw new Error(data || 'Failed to delete book');
                }

                setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
                toast.success('Book deleted successfully!');
            } catch (error) {
                console.error('Error deleting book:', error);
                toast.error(error.message || 'Failed to delete the book. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Administration des Livres</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un nouveau livre</h2>
                    <form onSubmit={handleAddBook} className="flex items-center">
                        <Input
                            type="text"
                            value={newBookTitle}
                            onChange={(e) => setNewBookTitle(e.target.value)}
                            placeholder="Titre du livre"
                            className="flex-grow mr-4"
                            required
                        />
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                            Ajouter
                        </Button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des livres</h2>
                    {books.map((book) => (
                        <BookManagementCard key={book.id} book={book} onDelete={handleDeleteBook} />
                    ))}
                </div>
            </div>
        </div>
    );
}
