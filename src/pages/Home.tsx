import { useMemo, useState } from "react";
import { useAtom } from "jotai";
import Navbar from "../components/Navbar";
import PetCard from "../components/PetCard";
import type { PetDto, CreatePetDto} from "../../Api";
import { allPetsAtom } from "../atoms";
import { usePetsActions } from "../services/PetService.tsx";

export default function Home() {
    const [pets] = useAtom(allPetsAtom);
    const [q, setQ] = useState("");
    const { create } = usePetsActions();

    // Create form state
    const [form, setForm] = useState<CreatePetDto>({ name: "", breed: "", imgurl: "" });
    const [busy, setBusy] = useState(false);
    const [formErr, setFormErr] = useState<string | null>(null);

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

    // Open/close modal helpers
    const openCreateModal = () => {
        (document.getElementById("create_pet_modal") as HTMLDialogElement | null)?.showModal();
    };
    const closeCreateModal = () => {
        (document.getElementById("create_pet_modal") as HTMLDialogElement | null)?.close();
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setFormErr(null);
        if (!form.name || !form.name.trim()) {
            setFormErr("Name is required.");
            return;
        }
        try {
            setBusy(true);
            await create({
                name: form.name?.trim(),
                breed: form.breed?.trim() || undefined,
                imgurl: form.imgurl?.trim() || undefined,
            });
            // Reset and close
            setForm({ name: "", breed: "", imgurl: "" });
            closeCreateModal();
        } catch {
            setFormErr("Could not create pet. Try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="container mx-auto px-4 py-8">
                {/* Hero */}
                <div className="hero bg-base-200 rounded-2xl mb-8">
                    <div className="hero-content text-center">
                        <div className="max-w-2xl mx-auto">
                            <h1 className="text-4xl font-extrabold">Find your perfect companion</h1>
                            <p className="py-4 text-base-content/70">
                                Browse our lovely pets. Click button "details" to see details.
                            </p>

                            <div className="join w-full max-w-xl mx-auto">
                                <input
                                    className="input input-bordered join-item w-full"
                                    placeholder="Search by name or breed…"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                />
                                <button className="btn btn-primary join-item" onClick={() => setQ(q)}>
                                    Search
                                </button>
                            </div>

                            <div className="mt-4">
                                <button className="btn btn-secondary" onClick={openCreateModal}>
                                    + New Pet
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

            {/* Create Pet Modal */}
            <dialog id="create_pet_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog" className="absolute right-3 top-3">
                        <button className="btn btn-sm btn-circle" onClick={closeCreateModal}>✕</button>
                    </form>

                    <h3 className="font-bold text-lg mb-3">Create a new pet</h3>

                    {formErr && (
                        <div className="alert alert-error mb-3">
                            <span>{formErr}</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="grid gap-3">
                        <label className="form-control">
                            <div className="label"><span className="label-text">Name *</span></div>
                            <input
                                className="input input-bordered"
                                value={form.name || ""}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </label>

                        <label className="form-control">
                            <div className="label"><span className="label-text">Breed</span></div>
                            <input
                                className="input input-bordered"
                                value={form.breed || ""}
                                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                            />
                        </label>

                        <label className="form-control">
                            <div className="label"><span className="label-text">Image URL</span></div>
                            <input
                                className="input input-bordered"
                                value={form.imgurl || ""}
                                onChange={(e) => setForm({ ...form, imgurl: e.target.value })}
                                placeholder="https://…"
                            />
                        </label>

                        <div className="mt-2 flex justify-end gap-2">
                            <button type="button" className="btn btn-ghost" onClick={closeCreateModal}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={busy}>
                                {busy ? "Creating…" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
