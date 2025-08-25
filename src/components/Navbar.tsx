import { Link } from "react-router";

type Props = { title?: string };

export default function Navbar({ title = "JM's Amazing Petshop" }: Props) {
    return (
        <div className="bg-base-100 border-b">
            <div className="container mx-auto px-4">
                <div className="navbar justify-center">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl">🐾</span>
                        <span className="text-xl font-semibold">{title}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
