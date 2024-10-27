import React, { useState, useEffect } from 'react'
import { Book } from '@prisma/client'

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        fetch('/api/books')
            .then(response => response.json())
            .then(data => setBooks(data))
    }, [])

    return (
        <div>
            <h2>Available Books</h2>
            <ul>
                {books.map(book => (
                    <li key={book.id}>{book.title}</li>
                ))}
            </ul>
        </div>
    )
}