import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import {MyApi} from "../MyApi.ts";
import type {PetDto} from "/Users/janeyfan/Desktop/Exercises/Petshop/Api.ts";

export default function Home() {
    const [pets, setPets] = useState<PetDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");

    useEffect(() => {
        void (async () => {
            setLoading(true);
            try {
                const res = await MyApi.getPets.petGetPets();
                setPets(res.data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        if (!q) return pets;
        const needle = q.toLowerCase();
        return pets.filter(
            (p) =>
                (p.name && p.name.toLowerCase().includes(needle)) ||
                (p.breed && p.breed.toLowerCase().includes(needle))
        );
    }, [pets, q]);

    return (
        <>
            <Navbar onSearch={setQ} title="🐾 Petshop" />

            <section className="container mx-auto px-4 py-6">
                {/* Optional hero */}
                <div className="hero bg-base-200 rounded-xl mb-6">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-bold">Find your perfect companion</h1>
                            <p className="py-4 text-base-content/70">
                                Browse our lovely pets. Click a card to see details.
                            </p>
                            <div className="join">
                                <input
                                    className="input input-bordered join-item"
                                    placeholder="Search by name or breed…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                                <button className="btn btn-primary join-item" onClick={() => setQ(q)}>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-base-content/70">No pets found.</div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((p) => (
                            <PetCard key={p.id} pet={p} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
