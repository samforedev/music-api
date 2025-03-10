import { Types } from "mongoose";
import { IBand } from "../entities/band.model";
import { StatusEntity } from "../enums/common.enum";
import { ISong } from "../entities/song.model";

/** Dto to album */
export interface AlbumDto {
    id?: string | null;
    title: string;
    releaseYear: Date;
    band?: Types.ObjectId | string;
    bandDetail?: IBand | null;
    genre?: string | null;
    description?: string;
    duration?: number | null;
    songs?: Types.ObjectId[] | string[];
    songsDetails?: ISong[] | null;
    recordLabel?: string | null;
    recordedAt?: string | null;
    status?: StatusEntity | StatusEntity.DEACTIVATED;
}

export interface MinimalALbumDto {
    id: string;
    title: string;
    releaseYear: Date;
    band?: {
        id?: string;
        name?: string;
    };
}
