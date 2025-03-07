import { PaginateResponse } from "../../models/commons/paginateResponse.model";
import { BandDto } from "../../models/dtos/band.dto";
import { IBand } from "../../models/entities/band.model";
import { StatusEntity } from "../../models/enums/common.enum";

/**
 * Interface for Band Service
 */
export interface IBandService {

    addOne(bandData: BandDto): Promise<IBand>;

    getAll(page: number, limit: number): Promise<PaginateResponse<IBand>>;

    getById(id: string): Promise<IBand | null>;

    changeStatus(id: string, status: StatusEntity): Promise<IBand | null>;

    getByName(name: string): Promise<IBand | null>;

    getByArtistId(artistId: string): Promise<IBand | null>;

    getByFilters(page: number, limit: number, filter: Record<string, any>)
        : Promise<PaginateResponse<IBand>>;

    addMembers(id: string, artistsIds: string[]): Promise<IBand | null>;

    addMember(id: string, artistId: string): Promise<IBand | null>;

}