import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { AlbumDto } from "../models/dtos/album.dto";
import { Album, IAlbum } from "../models/entities/album.model";
import { StatusEntity } from "../models/enums/common.enum";
import { Paginate } from "../utils/paginateHandler";
import { IAlbumService } from "./interfaces/albumService.interface";

export class AlbumService implements IAlbumService {


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
        return Paginate(Album, page, limit);
    }


    /**
     * Get album by Id
     * @param id 
     * @returns 
     */
    async getById(id: string): Promise<IAlbum | null> {
        return Album.findById(id);
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