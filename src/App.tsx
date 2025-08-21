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
            const res = await MyApi.getPets.petGetPets();
            setPets(res.data);
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
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {pets.map((p) => (
                        <li key={p.id} style={{ marginBottom: "20px" }}>
                            {p.imgurl && (
                                <img
                                    src={p.imgurl}
                                    alt={p.name}
                                    style={{ width: "150px", borderRadius: "8px" }}
                                />
                            )}
                            <div>
                                <strong>{p.name}</strong>{" "}
                                {p.breed ? <em>({p.breed})</em> : null}{" "}
                                {p.sold ? "✅ Sold" : "Available"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default App
