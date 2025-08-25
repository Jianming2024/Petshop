import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { allPetsAtom } from "../atoms";
import { MyApi } from "../MyApi";
import type { PetDto, CreatePetDto, UpdatePetDto } from "../../Api";

export function useInitializeDataForMyApp() {
    const [, setAllPets] = useAtom(allPetsAtom);

    useEffect(() => {
        let cancelled = false;

        MyApi.getPets.petGetPets()
            .then((res) => {
                if (!cancelled) setAllPets(res.data); // put array into atom
            })
            .catch((err) => {
                // per your request we assume success, but keep a console for debugging
                console.error("[useInitializePets] fetch failed", err);
            });

        return () => {
            cancelled = true;
        };
    }, [setAllPets]);
}

export async function getPetById(id: string): Promise<PetDto> {
    const res = await MyApi.getPetById.petGetPetById({ id });
    return res.data;
}

export function usePetsActions() {
    const [pets, setPets] = useAtom(allPetsAtom);

    const refresh = useCallback(async () => {
        const res = await MyApi.getPets.petGetPets();
        setPets(res.data);
    }, [setPets]);

    const create = useCallback(async (body: CreatePetDto): Promise<PetDto> => {
        const res = await MyApi.createPet.petCreatePet(body);
        setPets([...(pets ?? []), res.data]);
        return res.data;
    }, [pets, setPets]);

    const update = useCallback(async (body: UpdatePetDto): Promise<PetDto> => {
        const res = await MyApi.updatePet.petUpdatePet(body);
        const updated = res.data;
        setPets((pets ?? []).map((p) => (p.id === updated.id ? updated : p)));
        return updated;
    }, [pets, setPets]);

    const remove = useCallback(async (id: string): Promise<void> => {
        await MyApi.deletePet.petDeletePet({ id });
        setPets((pets ?? []).filter((p) => p.id !== id));
    }, [pets, setPets]);

    return { refresh, create, update, remove };
}