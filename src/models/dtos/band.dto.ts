import { Types } from "mongoose";
import { StatusEntity } from "../enums/common.enum";
import { IArtist } from "../entities/artist.model";

/**
 * Dto to Band
 */
export interface BandDto {
    id?: string | null;
    name: string;
    alias?: string | null;
    formationYear: number;
    disbandYear?: number | null;
    genre: string[];
    members?: Types.ObjectId[] | string[];
    membersDetails?: IArtist[] | string[];
    nationality?: string;
    status?: StatusEntity | null;
}

export interface MinimalBandDto {
    id: string;
    name: string;
    formationYear: number;
}

export interface AddManyArtistsResponseDto {
    bandId?: string | null;
    success: string[];
    failed: Array<{ id: string; reason?: string }>
}

export interface AddManyArtistsRequestDto {
    artistIds: string[];
}