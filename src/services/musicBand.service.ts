import { Types } from "mongoose";
import { PaginateResponse } from "../models/commons/paginateResponse.model";
import { MusicBandDto } from "../models/dtos/musicBand.dto";
import { IMusicBand, MusicBand } from "../models/entities/musicBand.model";
import { StatusEntity } from "../models/enums/common.enum";
import { Paginate } from "../utils/paginateHandler";

export class MusicBandService {

    /**
     * Add new Music band to Database
     * @param musicBandData 
     * @returns IMusicBand
     */
    async addOne(musicBandData: MusicBandDto): Promise<IMusicBand> {
        const musicBand = new MusicBand(musicBandData);
        return await musicBand.save();
    }

    /**
     * Get All Bands
     * @param page 
     * @param limit
     * @returns PaginateResponse<IMusicBand>
     */
    async getAll(page: number, limit: number): Promise<PaginateResponse<IMusicBand>> {
        return Paginate(MusicBand, page, limit);
    }

    /**
     * Obtain Music band by Id
     * @param id 
     * @returns IMusicBand or null
     */
    async getById(id: string): Promise<IMusicBand | null> {
        return MusicBand.findById(id);
    }

    /**
     * ChangeStatus
     * @param id 
     * @param status
     * @returns IMusicBand 
     */
    async changeStatus(id: string, status: StatusEntity): Promise<IMusicBand | null> {
        const musicBand = await MusicBand.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        return musicBand;
    }

    /**
     * Get a Music band by Name (partial search)
     * @param name 
     * @returns Music Band found or null
     */
    async getByName(name: string): Promise<IMusicBand | null> {
        return MusicBand.findOne({ name: { $regex: name, $options: "i" } });
    }

    /**
     * Get Music band by artist Id
     * @param artistId 
     * @returns Music band found or null
     */
    async getByArtistId(artistId: string): Promise<IMusicBand | null> {
        const band = MusicBand.findOne({ members: new Types.ObjectId(artistId) });
        return band;
    }

}