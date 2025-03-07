/**
 * Dto to artist
 */
import { ArtistRole } from "../enums/artists.enum";

export interface ArtistDto {
    id?: string | null;
    name: string;
    alias?: string;
    birthDate?: Date;
    deathDate?: Date | null;
    instruments: string[];
    role: ArtistRole;
    isAlive: boolean;
    nationality?: string;
    artistKey?: string | null;
    status?: string | null;
}

export interface MinimalArtistDto {
    id: string;
    name: string;
    role: string;
}


export interface AddManyArtistsDto {
    success: ArtistDto[];
    failed: Array<{ name: string; reason?: string }>
}

export interface AddManyResponseDto {
    success: string[];
    failed: Array<{ name: string; reason?: string }>;
}