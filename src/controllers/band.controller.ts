import { BandService } from "../services/band.service";
import { IBandService } from "../services/interfaces/bandService.interface";

import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { BandDto } from "../models/dtos/band.dto";
import { ERROR_CREATING, RESOURCE_ALREADY_EXISTS } from "../models/constants";
import { ExistsItems } from "../models/dtos/common.dto";
import { IArtistService } from "../services/interfaces/artistService.interface";
import { ArtistService } from "../services/artist.service";


/** Band controller */
export class BandController {

    private bandService: IBandService;
    private artistService: IArtistService;

    constructor(
        bandService?: IBandService,
        artistService?: IArtistService
    ) {
        this.bandService = bandService || new BandService();
        this.artistService = artistService || new ArtistService();
    }


    /**
     * Create new Band
     * @param req 
     * @param res 
     */
    async createBand(req: Request, res: Response): Promise<void> {
        try {
            const bandData: BandDto = req.body;

            const bandFound = await this.bandService.getByName(bandData.name);
            if (bandFound) {
                return ResponseHandler.error(
                    res, { message: `Band ${RESOURCE_ALREADY_EXISTS}` }, 400);
            }

            const existsMembers: ExistsItems[] = await Promise.all(
                bandData.members.map(async id => ({
                    id: id.toString(),
                    exists: await this.artistService.existsById(id.toString())
                }))
            );

            const missingMember = existsMembers.find(data => !data.exists);
            if (missingMember) {
                return ResponseHandler.errorNotFound(res, `Artist: ${missingMember.id}`);
            }

            const bandCreated = await this.bandService.addOne(bandData);
            if (!bandCreated) {
                return ResponseHandler.error(
                    res, { message: `Band ${ERROR_CREATING}` }, 400);
            }

            ResponseHandler.success(res, bandCreated.id, 'Band created', 201);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

}