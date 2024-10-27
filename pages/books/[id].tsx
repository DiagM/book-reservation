import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify'; // Import toast for notifications

export default function BookDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [book, setBook] = useState(null); // State to hold book details
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(''); // State to hold error messages
    const [hasBooked, setHasBooked] = useState(false); // State to track if the user has booked the book
    const [startDate, setStartDate] = useState(''); // State for start date input
    const [endDate, setEndDate] = useState(''); // State for end date input

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (id) {
                try {
                    const response = await fetch(`/api/books/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch book details');
                    }

                    const data = await response.json();
                    setBook(data); // Set book details to state

                    // Get user ID from local storage
                    const storedUser = localStorage.getItem('user');
                    const user = storedUser ? JSON.parse(storedUser) : null;

                    if (user) {
                        const bookingResponse = await fetch(`/api/reservations?userId=${user.id}&bookId=${data.id}`);
                        const bookingData = await bookingResponse.json();

                        // Check if the user has already booked the book
                        if (bookingData.length > 0) {
                            setHasBooked(true); // User has booked the book
                        }
                    }
                } catch (error) {
                    console.error('Error fetching book:', error);
                    setError(error.message); // Set error message
                    toast.error(error.message); // Show toast error
                } finally {
                    setLoading(false); // Set loading to false
                }
            }
        };

        fetchBookDetails();
    }, [id]); // Run the effect when id changes

    const handleReservation = async () => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            alert("You need to be logged in to make a reservation.");
            return;
        }

        // Check if end date is after start date
        if (new Date(endDate) <= new Date(startDate)) {
            console.error("End date must be after the start date.");
            alert("Please select an end date that is after the start date.");
            return;
        }

        const newReservation = {
            userId: user.id,
            bookId: book.id,
            startDate,
            endDate,
        };

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newReservation),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse the error response from the backend
                throw new Error(errorData.message || 'Failed to create reservation'); // Use the specific error message if available
            }

            toast.success("Reservation created successfully!");
            setHasBooked(true); // Update state to reflect booking
        } catch (error) {
            console.error('Error creating reservation:', error);
            alert(error.message); // Show specific error message
        }
    };


    const handleReturn = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        try {
            const response = await fetch(`/api/reservations?userId=${storedUser.id}&bookId=${book.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to confirm return');
            }
            setHasBooked(false);
            toast.success("Book return confirmed!");
            // Optionally update the UI or fetch the latest reservation data here
        } catch (error) {
            console.error("Error confirming book return:", error);
            toast.error(error.message);
        }
    };


    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }

    if (!book) {
        return <div>Book not found.</div>; // If book is not found
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
                        {hasBooked ? (
                            <Button
                                onClick={handleReturn}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                Confirmer le rendu du livre
                            </Button>
                        ) : (
                            <>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border rounded p-2 mr-4"
                                    required
                                />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border rounded p-2 mr-4"
                                    required
                                />
                                <Button
                                    onClick={handleReservation}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                                >
                                    Réserver ce Livre
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
