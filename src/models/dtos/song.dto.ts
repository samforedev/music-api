import { Types } from "mongoose";
import { IAlbum } from "../entities/album.model";
import { StatusEntity } from "../enums/common.enum";
import { IBand } from "../entities/band.model";

/** Dto to Song */
export interface SongDto {
    id?: string | null;
    title: string;
    band?: Types.ObjectId | string;
    bandDetail?: IBand | null;
    album?: Types.ObjectId | string;
    albumDetail?: IAlbum | null;
    status: StatusEntity | StatusEntity.DEACTIVATED;
};

export interface MinimalSongDto {
    id: string;
    title: string;
    band?: string;
    album?: string;
};