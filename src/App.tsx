import {useEffect, useState} from "react";
import {MyApi} from "./MyApi.ts";
import type {PetDto} from "../Api.ts";

function App() {
    const [pets, setPets] = useState<PetDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void fetchPets();
    }, []);

    async function fetchPets() {
        setLoading(true);
        try {
            const res = await MyApi.getPets.petGetPets(); // ✅ correct method
            setPets(res.data); // payload lives in .data
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading…</p>;

    return (
        <>
            <h1>My Amazing Petshop</h1>
            {pets.length === 0 ? (
                <p>No pets.</p>
            ) : (
                <ul>
                    {pets.map((p) => (
                        <li key={p.id}>
                            <strong>{p.name}</strong>{" "}
                            {p.breed ? <em>({p.breed})</em> : null}{" "}
                            {p.sold ? "✅ Sold" : "Available"}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default App
