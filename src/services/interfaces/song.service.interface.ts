import { PaginateResponse } from "../../models/commons/paginateResponse.model";
import { SongDto } from "../../models/dtos/song.dto";
import { ISong } from "../../models/entities/song.model";
import { StatusEntity } from "../../models/enums/common.enum";

/** Interface for Song Service */
export interface ISongService {

    addOne(songData: SongDto): Promise<ISong | null>;

    getAll(page: number, limit: number): Promise<PaginateResponse<ISong>>;

    getById(id: string): Promise<ISong | null>;

    getByFilters(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<ISong>>;

    changeStatus(id: string, status: StatusEntity): Promise<ISong | null>;

    getByTitle(title: string): Promise<ISong | null>;

    getAllByBandId(bandId: string, page: number, limit: number): Promise<PaginateResponse<ISong>>;

    getAllByAlbumId(albumId: string, page: number, limit: number): Promise<PaginateResponse<ISong>>;

}