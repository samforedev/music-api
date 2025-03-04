import { ArtistDto } from "../models/dtos/artist.dto";
import { Artist, IArtist } from "../models/entities/artist.model";
import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { Paginate } from "../utils/paginateHandler";
import { StatusEntity } from "../models/enums/common.enum";

export class ArtistService {

    /**
     * Add new Artist to Database
     * @param artistData
     * @return IArtist
     */
    async addOne(artistData: ArtistDto): Promise<IArtist> {
        const artist = new Artist(artistData);
        return await artist.save();
    }

    /**
     * Get all Artist
     * @param page
     * @param limit
     * @returns PaginateResponse<IArtist>
     */
    async getAll(page: number, limit: number): Promise<PaginateResponse<IArtist>> {
        return Paginate(Artist, page, limit);
    }

    /**
     * Obtain Artist by id
     * @param id ID
     * @returns IArtist or null
     */
    async getById(id: string): Promise<IArtist | null> {
        return Artist.findById(id);
    }

    /**
     * Obtains artist by Filter
     * @param page
     * @param limit
     * @param filter
     * @returns PaginateResponse<IArtist>
     */
    async getByFilter(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<IArtist>> {
        return Paginate(Artist, page, limit, filter);
    }

    /**
     * Check if a Artist exists by ID
     * @param id Id
     * @returns `true` or `false`
     */
    async existsById(id: string): Promise<boolean> {
        return await Artist.exists({ _id: id }) !== null;
    }

    /**
     * ChangeStatus
     * @param id Id
     * @param StatusEntity
     * @returns IArtist
     */
    async changeStatus(id: string, status: StatusEntity): Promise<IArtist | null> {
        const artist = await Artist.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        return artist;
    }

    /**
     * Get a Artist by Name (partial search)
     * @param name Name of the artist
     * @returns Artist found or null
     */
    async getByName(name: string): Promise<IArtist | null> {
        return Artist.findOne({ name: { $regex: name, $options: "i" } });
    }

}
