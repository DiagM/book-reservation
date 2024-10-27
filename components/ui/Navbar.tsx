// components/Navbar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from localStorage or context
        const token = localStorage.getItem("token");
        if (token) {
            const userData = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            setUser(userData);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/books">Livres</Link>
            {user ? (
                <>
                    <button onClick={handleLogout}>Se déconnecter</button>
                    <Link href="/profil">Profil</Link>
                </>
            ) : (
                <>
                    <Link href="/register">S'inscrire</Link>
                    <Link href="/login">Se connecter</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
