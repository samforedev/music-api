import { PaginateResponse } from "../../models/commons/paginateResponse.model";
import { AlbumDto } from "../../models/dtos/album.dto";
import { IAlbum } from "../../models/entities/album.model";
import { StatusEntity } from "../../models/enums/common.enum";

/** Interface for Album service */
export interface IAlbumService {

    addOne(albumData: AlbumDto): Promise<IAlbum | null>;

    getAll(page: number, limit: number): Promise<PaginateResponse<IAlbum>>;

    getById(id: string): Promise<IAlbum | null>;

    getByFilter(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<IAlbum>>;

    changeStatus(id: string, status: StatusEntity): Promise<IAlbum | null>;

    getByTitle(title: string): Promise<IAlbum | null>;

    getAllByBandId(id: string, page: number, limit: number): Promise<PaginateResponse<IAlbum>>;

}
