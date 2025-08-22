// src/pages/PetDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import Navbar from "../components/Navbar";
import { allPetsAtom } from "../atoms";
import { getPetById, usePetsActions } from "../services/PetService";
import type { PetDto, UpdatePetDto } from "../../Api";

export default function PetDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const allPets = useAtomValue(allPetsAtom);
    const { update, remove } = usePetsActions();

    const [pet, setPet] = useState<PetDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // Load pet (cache first, then API)
    useEffect(() => {
        if (!id) return;
        let cancelled = false;

        (async () => {
            try {
                const cached = allPets?.find((p) => p.id === id);
                if (cached) {
                    if (!cancelled) setPet(cached);
                } else {
                    const data = await getPetById(id);
                    if (!cancelled) setPet(data);
                }
            } catch {
                setErr("Failed to load pet.");
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

    const toggleSold = async () => {
        if (!pet.id) return;
        setBusy(true);
        setErr(null);
        try {
            const body: UpdatePetDto = {
                id: pet.id,
                name: pet.name,
                breed: pet.breed,
                imgurl: pet.imgurl,
                sold: !pet.sold,
            };
            const updated = await update(body); // updates global atom too
            setPet(updated);
        } catch {
            setErr("Could not update pet (public pets cannot be changed).");
        } finally {
            setBusy(false);
        }
    };

    const onDelete = async () => {
        if (!pet.id) return;
        const ok = window.confirm("Delete this pet?");
        if (!ok) return;

        setBusy(true);
        setErr(null);
        try {
            await remove(pet.id); // updates global atom
            navigate("/");
        } catch {
            setErr("Could not delete pet (public pets cannot be deleted).");
            setBusy(false);
        }
    };

    return (
        <>
            <Navbar title="JM Amazing Petshop" />

            <section className="container mx-auto px-4 py-6">
                {err && (
                    <div className="alert alert-error mb-4">
                        <span>{err}</span>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    <div className="card bg-base-100 shadow-md">
                        {/* Image area (fit) */}
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

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={toggleSold}
                                    disabled={busy}
                                >
                                    {pet.sold ? "Mark as Not Sold" : "Mark as Sold"}
                                </button>
                                <button
                                    className="btn btn-error"
                                    onClick={onDelete}
                                    disabled={busy}
                                >
                                    Delete
                                </button>
                                <Link to="/" className="btn" aria-disabled={busy}>
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
