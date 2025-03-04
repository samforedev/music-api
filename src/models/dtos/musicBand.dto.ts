import { Types } from "mongoose";
import { IArtist } from "../entities/artist.model";
import { StatusEntity } from "../enums/common.enum";

/**
 * Dto to Music Band
 */
export interface MusicBandDto {
    id?: string | null;
    name: string;
    alias?: string | null;
    formationYear: number;
    disbandYear?: number | null;
    isAlive: boolean;
    genre: string[];
    members: Types.ObjectId[] | IArtist[];
    nationality?: string;
    status?: StatusEntity | null;
}

export interface MinimalMusicBandDto {
    id: string;
    name: string;
    formationYear: number;
}