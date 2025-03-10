import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { SongDto } from "../models/dtos/song.dto";
import { ISong, Song } from "../models/entities/song.model";
import { StatusEntity } from "../models/enums/common.enum";
import { Paginate } from "../utils/paginateHandler";
import { ISongService } from "./interfaces/song.service.interface";

export class SongService implements ISongService {

    async addOne(songData: SongDto): Promise<ISong | null> {
        const song = new Song(songData);
        return await song.save();
    }

    async getAll(page: number, limit: number): Promise<PaginateResponse<ISong>> {
        const songs = await Paginate(Song, page, limit);
        await Promise.all(songs.data.map(song => song.populate("bandDetail")));
        await Promise.all(songs.data.map(song => song.populate("albumDetail")));
        return songs;
    }

    async getById(id: string): Promise<ISong | null> {
        return Song.findById(id)
            .populate("bandDetail")
            .populate("albumDetail").exec();
    }


    async getByFilters(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<ISong>> {
        return Paginate(Song, page, limit, filter);
    }

    async changeStatus(id: string, status: StatusEntity): Promise<ISong | null> {
        const song = await Song.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        return song;
    }

    async getByTitle(title: string): Promise<ISong | null> {
        return Song.findOne({ title: { $regex: title, $options: "i" } });
    }

    async getAllByBandId(bandId: string, page: number, limit: number): Promise<PaginateResponse<ISong>> {
        var filter: Record<string, any> = { "band": bandId };
        const songs = await Paginate(Song, page, limit, filter);

        await Promise.all(songs.data.map(song => {
            song.populate("bandDetail");
            song.populate("albumDetail");
        }));

        return songs;
    }

    async getAllByAlbumId(albumId: string, page: number, limit: number): Promise<PaginateResponse<ISong>> {
        var filter: Record<string, any> = { "album": albumId };
        const songs = await Paginate(Song, page, limit, filter);

        await Promise.all(songs.data.map(song => {
            song.populate("bandDetail");
            song.populate("albumDetail");
        }));

        return songs;
    }

}