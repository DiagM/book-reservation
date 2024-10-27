import React, { useState } from 'react'

interface ReservationFormProps {
    bookId: string
}

export default function ReservationForm({ bookId }: ReservationFormProps) {
    const [startDate, setStartDate] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookId, startDate }),
        })
        if (response.ok) {
            alert('Reservation created successfully')
        } else {
            alert('Failed to create reservation')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <button type="submit">Reserve</button>
        </form>
    )
}