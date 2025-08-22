import {atom} from "jotai";
import type { PetDto } from ".././Api";

export const allPetsAtom = atom<PetDto[]>([]);
