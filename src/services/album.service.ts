import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { AlbumDto } from "../models/dtos/album.dto";
import { Album, IAlbum } from "../models/entities/album.model";
import { StatusEntity } from "../models/enums/common.enum";
import { Paginate } from "../utils/paginateHandler";
import { IAlbumService } from "./interfaces/albumService.interface";

export class AlbumService implements IAlbumService {

    async addSong(id: string, songId: string): Promise<IAlbum | null> {
        const album = await Album.findByIdAndUpdate(
            id,
            { $addToSet: { songs: songId } },
            { new: true }
        ).populate("songsDetails");

        return album;
    }

    /**
     * Get all albums by band
     * @param id 
     * @param page 
     * @param limit 
     */
    async getAllByBandId(id: string, page: number, limit: number): Promise<PaginateResponse<IAlbum>> {
        const filter: Record<string, any> = { "band": id };
        return Paginate(Album, page, limit, filter);
    }


    /**
     * Get album by title
     * @param name 
     */
    async getByTitle(title: string): Promise<IAlbum | null> {
        return Album.findOne({ title: { $regex: title, $options: "i" } });
    }


    /**
     * Create a new album in db
     * @param albumData 
     * @returns 
     */
    async addOne(albumData: AlbumDto): Promise<IAlbum | null> {
        const album = new Album(albumData);
        return await album.save();
    }


    /**
     * get all albums
     * @param page 
     * @param limit 
     * @returns 
     */
    async getAll(page: number, limit: number): Promise<PaginateResponse<IAlbum>> {
        const results = await Paginate(Album, page, limit);
        await Promise.all(results.data.map(album => album.populate("bandDetail")));
        return results;
    }


    /**
     * Get album by Id
     * @param id 
     * @returns 
     */
    async getById(id: string): Promise<IAlbum | null> {
        return Album.findById(id)
            .populate("bandDetail")
            .populate("songsDetails")
            .exec();
    }


    /**
     * Get all albums by filter
     * @param page 
     * @param limit 
     * @param filter 
     * @returns 
     */
    async getByFilter(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<IAlbum>> {
        return Paginate(Album, page, limit, filter);
    }


    /**
     * Change status
     * @param id 
     * @param status 
     * @returns 
     */
    async changeStatus(id: string, status: StatusEntity): Promise<IAlbum | null> {
        const album = await Album.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        return album;
    }


}