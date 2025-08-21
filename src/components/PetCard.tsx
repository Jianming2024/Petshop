import type {PetDto} from "../../Api";

type PetCardProps = {
    pet: PetDto;
};

export default function PetCard({ pet }: PetCardProps) {
    return (
        <div className="card bg-base-100 shadow-sm hover:shadow-md transition">
            <figure className="aspect-video bg-base-200">
                {pet.imgurl ? (
                    <img src={pet.imgurl} alt={pet.name} className="object-cover w-full h-full" />
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
                <div className="card-actions justify-end">
                    {pet.id && (
                        <a href={`/pet/${pet.id}`} className="btn btn-sm btn-primary">Details</a>
                    )}
                </div>
            </div>
        </div>
    );
}