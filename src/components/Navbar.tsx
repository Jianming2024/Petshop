import { useRef } from "react";

type NavbarProps = {
    onSearch?: (q: string) => void;
    title?: string;
};

export default function Navbar({ onSearch, title = "🐾 Petshop" }: NavbarProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const openSearch = () => {
        const dlg = document.getElementById("search_modal") as HTMLDialogElement | null;
        dlg?.showModal();
        // focus after next paint
        requestAnimationFrame(() => searchInputRef.current?.focus());
    };

    const doSearch: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const q = searchInputRef.current?.value ?? "";
        onSearch?.(q.trim());
        (document.getElementById("search_modal") as HTMLDialogElement | null)?.close();
    };

    return (
        <>
            <div className="navbar bg-base-100 border-b">
                {/* Left: burger */}
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden" aria-label="Open menu">
                            {/* burger icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-56">
                            <li><a href="/">Home</a></li>
                            <li><a href="/new">Create Pet</a></li>
                            <li><a href="https://api-divine-grass-2111.fly.dev/swagger/index.html" target="_blank" rel="noreferrer">API Docs</a></li>
                        </ul>
                    </div>
                </div>

                {/* Center: shop name */}
                <div className="navbar-center">
                    <a className="btn btn-ghost text-xl normal-case">{title}</a>
                </div>

                {/* Right: search button (opens modal) */}
                <div className="navbar-end">
                    <button className="btn btn-ghost" onClick={openSearch} aria-label="Search">
                        {/* magnifier icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search modal */}
            <dialog id="search_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog" className="absolute right-3 top-3">
                        <button className="btn btn-sm btn-circle">✕</button>
                    </form>

                    <h3 className="font-bold text-lg mb-4">Search pets</h3>
                    <form onSubmit={doSearch} className="flex gap-2">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by name or breed…"
                            className="input input-bordered w-full"
                        />
                        <button className="btn btn-primary" type="submit">Search</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
