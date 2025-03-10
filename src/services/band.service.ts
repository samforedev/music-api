import { Types } from "mongoose";
import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { BandDto } from "../models/dtos/band.dto";
import { IBand, Band } from "../models/entities/band.model";
import { StatusEntity } from "../models/enums/common.enum";
import { Paginate } from "../utils/paginateHandler";
import { IBandService } from "./interfaces/bandService.interface";

export class BandService implements IBandService {

    /**
     * Add new Album
     * @param id 
     * @param albumId 
     * @returns 
     */
    async addOneAlbum(id: string, albumId: string): Promise<IBand | null> {
        const musicBand = await Band.findByIdAndUpdate(
            id,
            { $addToSet: { albums: albumId } },
            { new: true }
        );
        return musicBand;
    }

    /**
     * Add many Albums
     * @param id 
     * @param albumIds 
     * @returns 
     */
    async addAlbums(id: string, albumIds: string[]): Promise<IBand | null> {
        const musicBand = await Band.findByIdAndUpdate(
            id,
            { $addToSet: { albums: { $each: albumIds } } },
            { new: true }
        );
        return musicBand;
    }

    /**
     * Add new Memeber
     * @param id 
     * @param artistId 
     */
    async addMember(id: string, artistId: string): Promise<IBand | null> {
        const musicBand = await Band.findByIdAndUpdate(
            id,
            { $addToSet: { members: artistId } },
            { new: true }
        ).populate("membersDetails");

        return musicBand;
    }

    /**
     * Add Many members (artists) to band
     * @param artistsIds 
     */
    async addMembers(id: string, artistsIds: string[]): Promise<IBand | null> {
        const musicBand = await Band.findByIdAndUpdate(
            id,
            { $addToSet: { members: { $each: artistsIds } } },
            { new: true }
        );
        return musicBand;
    }

    /**
     * Add new Music band to Database
     * @param musicBandData 
     * @returns IBand
     */
    async addOne(bandData: BandDto): Promise<IBand> {
        const musicBand = new Band(bandData);
        return await musicBand.save();
    }

    /**
     * Get All Bands
     * @param page 
     * @param limit
     * @returns PaginateResponse<IBand>
     */
    async getAll(page: number, limit: number): Promise<PaginateResponse<IBand>> {
        return Paginate(Band, page, limit);
    }

    /**
     * Obtain Music band by Id
     * @param id 
     * @returns IBand or null
     */
    async getById(id: string): Promise<IBand | null> {
        return Band.findById(id)
            .populate("membersDetails")
            .populate("albumsDetails")
            .exec();
    }

    /**
     * ChangeStatus
     * @param id 
     * @param status
     * @returns IBand 
     */
    async changeStatus(id: string, status: StatusEntity): Promise<IBand | null> {
        const musicBand = await Band.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        return musicBand;
    }

    /**
     * Get a Music band by Name (partial search)
     * @param name 
     * @returns IBand found or null
     */
    async getByName(name: string): Promise<IBand | null> {
        return Band.findOne({ name: { $regex: name, $options: "i" } });
    }

    /**
     * Get band by artist Id
     * @param artistId 
     * @returns band found or null
     */
    async getByArtistId(artistId: string): Promise<IBand | null> {
        const band = Band.findOne({ members: new Types.ObjectId(artistId) });
        return band;
    }

    /**
     * Get Bands by Filters
     * @param page 
     * @param limit 
     * @param filter 
     */
    async getByFilters(page: number, limit: number, filter: Record<string, any>): Promise<PaginateResponse<IBand>> {
        return Paginate(Band, page, limit, filter);
    }

}