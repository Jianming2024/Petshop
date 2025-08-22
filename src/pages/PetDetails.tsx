// src/pages/PetDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import Navbar from "../components/Navbar";
import { allPetsAtom } from "../atoms";
import type { PetDto } from "../../Api";
import { getPetById } from "../services/PetService";

export default function PetDetails() {
    const { id } = useParams<{ id: string }>();
    const allPets = useAtomValue(allPetsAtom);

    const [pet, setPet] = useState<PetDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        (async () => {
            try {
                // try cache first
                const cached = allPets?.find((p) => p.id === id);
                if (cached) {
                    if (!cancelled) setPet(cached);
                } else {
                    // fetch by id
                    const data = await getPetById(id);
                    if (!cancelled) setPet(data);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, allPets]);

    if (!id) {
        return (
            <>
                <Navbar title="JM Amazing Petshop" />
                <div className="p-4 text-error">Invalid pet id.</div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Navbar title="JM Amazing Petshop" />
                <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            </>
        );
    }

    if (!pet) {
        return (
            <>
                <Navbar title="JM Amazing Petshop" />
                <div className="p-4 text-error">Pet not found.</div>
            </>
        );
    }

    return (
        <>
            <Navbar title="JM Amazing Petshop" />
            <section className="container mx-auto px-4 py-6">
                {/* max width so the detail isn't huge on wide screens */}
                <div className="max-w-2xl mx-auto">
                    <div className="card bg-base-100 shadow-md">
                        {/* fixed-height, centered image that FITS (no cropping) */}
                        <figure className="bg-base-200 flex items-center justify-center h-64 sm:h-72 md:h-80">
                            {pet.imgurl ? (
                                <img
                                    src={pet.imgurl}
                                    alt={pet.name || "Pet image"}
                                    className="max-h-full max-w-full object-contain rounded-md"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-base-content/60">
                                    No image
                                </div>
                            )}
                        </figure>

                        <div className="card-body">
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="card-title">
                                    {pet.name || "Unnamed"}
                                    {pet.sold ? <div className="badge badge-success ml-2">Sold</div> : null}
                                </h2>
                                {pet.breed ? <div className="badge badge-outline">{pet.breed}</div> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
