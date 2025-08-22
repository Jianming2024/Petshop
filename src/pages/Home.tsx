import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import type { PetDto } from "../../Api";
import { allPetsAtom } from "../atoms";

export default function Home() {
    const [pets] = useAtom(allPetsAtom);          // null until your init hook fills it
    const [q, setQ] = useState("");

    const filtered = useMemo(() => {
        const list: PetDto[] = pets ?? [];
        const needle = q.trim().toLowerCase();
        if (!needle) return list;
        return list.filter(
            (p) =>
                (p.name && p.name.toLowerCase().includes(needle)) ||
                (p.breed && p.breed.toLowerCase().includes(needle))
        );
    }, [pets, q]);

    const isLoading = pets === null;

    return (
        <>
            <Navbar title="JM's Amazing Petshop" />

            <section className="container mx-auto px-4 py-8">
                {/* Hero with headline + search */}
                <div className="hero bg-base-200 rounded-2xl mb-8">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-4xl font-extrabold">Find your perfect companion</h1>
                            <p className="py-4 text-base-content/70">
                                Browse our lovely pets. Click to see details.
                            </p>
                            <div className="join w-full max-w-xl mx-auto">
                                <input
                                    className="input input-bordered join-item w-full"
                                    placeholder="Search by name or breed…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                                <button
                                    className="btn btn-primary join-item"
                                    onClick={() => setQ(q)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {isLoading ? (
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
