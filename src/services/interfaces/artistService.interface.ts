import { PaginateResponse } from "../../models/commons/paginateResponse.model";
import { ArtistDto } from "../../models/dtos/artist.dto";
import { IArtist } from "../../models/entities/artist.model";
import { StatusEntity } from "../../models/enums/common.enum";

/**
 * Interface for Artist Service
 */
export interface IArtistService {

    addOne(artistData: ArtistDto): Promise<IArtist>;

    getAll(page: number, limit: number): Promise<PaginateResponse<IArtist>>;

    getById(id: string): Promise<IArtist | null>;

    getByFilter(page: number, limit: number, filter: Record<string, any>)
        : Promise<PaginateResponse<IArtist>>;

    existsById(id: string): Promise<boolean>;

    changeStatus(id: string, status: StatusEntity): Promise<IArtist | null>;

    getByName(name: string): Promise<IArtist | null>;

}