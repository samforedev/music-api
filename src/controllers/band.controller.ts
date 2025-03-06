import { BandService } from "../services/band.service";
import { IBandService } from "../services/interfaces/bandService.interface";

import { Request, Response } from "express";
import { ResponseHandler } from "../utils/responseHandler";
import { AddManyArtistsRequestDto, AddManyArtistsResponseDto, BandDto, MinimalBandDto } from "../models/dtos/band.dto";
import {
    ADDMANY_MEMBERS_ERROR_ARRAY,
    ARTIST_ALREADY_IN_BAND,
    ERROR_CHANGESTATUS, ERROR_CREATING,
    ERROR_UPDATING,
    RESOURCE_ALREADY_EXISTS,
    RESOURCE_NOT_FOUND
} from "../models/constants";

import { ExistsItems } from "../models/dtos/common.dto";
import { IArtistService } from "../services/interfaces/artistService.interface";
import { ArtistService } from "../services/artist.service";
import { StatusEntity } from "../models/enums/common.enum";
import { FilterRequestDto } from "../models/commons/paginateResponse.model";


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

            if (bandData.members) {
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

    /**
     * Get all bands
     * @param req 
     * @param res 
     */
    async getAllBands(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;

            const pagingBands = await this.bandService.getAll(page, limit);

            res.set({
                'page-count': pagingBands.total,
                'total-pages': pagingBands.totalPages,
                'page-number': pagingBands.page,
                'page-limit': pagingBands.limit
            });

            const bandsResponse: MinimalBandDto[] = pagingBands.data.map(band => ({
                id: band.id,
                name: band.name,
                formationYear: band.formationYear
            }));

            ResponseHandler.success(res, bandsResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get by Id
     * @param req 
     * @param res 
     */
    async getBandById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) return ResponseHandler.error(res, { message: 'Band Id is required' });

            const band = await this.bandService.getById(id);
            if (!band) return ResponseHandler.errorNotFound(res, 'Band');

            const bandResponse: BandDto = {
                id: band.id,
                name: band.name,
                alias: band.alias || '',
                formationYear: band.formationYear,
                disbandYear: band.disbandYear || null,
                genre: band.genre,
                members: band.members || [],
                nationality: band.nationality || '',
                status: band.status || StatusEntity.DEACTIVATED
            };

            ResponseHandler.success(res, bandResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Change status for Band
     * @param req 
     * @param res 
     */
    async changeBandStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) return ResponseHandler.error(res, { message: 'Band Id is required' });

            const bandFound = await this.bandService.getById(id);
            if (!bandFound) {
                return ResponseHandler.errorNotFound(
                    res, 'Band');
            }

            const status = req.path.includes(StatusEntity.ACTIVATED) ? StatusEntity.ACTIVATED : StatusEntity.DEACTIVATED;
            if (bandFound.status == status) {
                return ResponseHandler.error(
                    res, { message: `Band status already ${status}` });
            }

            const bandUpdated = await this.bandService.changeStatus(id, status);
            if (!bandUpdated) {
                return ResponseHandler.error(res, { message: ERROR_CHANGESTATUS });
            }

            ResponseHandler.success(res, {
                id: bandUpdated.id,
                currentStatus: bandUpdated.status
            });
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get Band by Id
     * @param req 
     * @param res 
     */
    async getByArtistId(req: Request, res: Response): Promise<void> {
        try {
            const { artistId } = req.body;
            if (!artistId) {
                return ResponseHandler.errorRequestData(res, [{
                    message: 'Artist Id is required'
                }]);
            }

            const artistFound = await this.artistService.existsById(artistId);
            if (!artistFound) {
                return ResponseHandler.errorNotFound(res, `Artist id: ${artistId}`);
            }

            const bandFound = await this.bandService.getByArtistId(artistId);
            if (!bandFound) {
                return ResponseHandler.errorNotFound(res, 'Band');
            }

            const bandResponse: BandDto = {
                id: bandFound.id,
                name: bandFound.name,
                alias: bandFound.alias || '',
                formationYear: bandFound.formationYear,
                disbandYear: bandFound.disbandYear || null,
                genre: bandFound.genre,
                members: bandFound.members || [],
                nationality: bandFound.nationality || '',
                status: bandFound.status || StatusEntity.DEACTIVATED
            };

            ResponseHandler.success(res, bandResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get all Bands by Filters
     * @param req 
     * @param res 
     */
    async getBandByFilters(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;
            const filterData: FilterRequestDto = req.body;

            const pagingBands = await this.bandService.getByFilters(page, limit, filterData.filter!);

            const bands: MinimalBandDto[] = pagingBands.data.map(band => ({
                id: band.id,
                name: band.name,
                formationYear: band.formationYear
            }));

            res.set({
                'page-count': pagingBands.total,
                'total-pages': pagingBands.totalPages,
                'page-number': pagingBands.page,
                'page-limit': pagingBands.limit
            });

            ResponseHandler.success(res, bands);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

    /**
     * Add members (Artists) to band
     * @param req 
     * @param res 
     */
    async addMembersToBand(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { artistIds }: AddManyArtistsRequestDto = req.body;

            if (artistIds.length === 0) {
                return ResponseHandler.errorRequestData(res, [{
                    message: ADDMANY_MEMBERS_ERROR_ARRAY
                }]);
            }

            const bandFound = await this.bandService.getById(id);
            if (!bandFound) {
                return ResponseHandler.errorNotFound(res, 'Band');
            }

            var resultsValidation: AddManyArtistsResponseDto = {
                bandId: id,
                success: [],
                failed: []
            };

            const tempMembers: any = bandFound.members?.filter(m => m.toString());
            for (const artistId of artistIds) {
                const resultValidation = await this.validateMember(artistId, tempMembers);
                if (resultValidation.isValid) {
                    resultsValidation.success.push(artistId);
                } else {
                    resultsValidation.failed.push({ id: artistId, reason: resultValidation.reason });
                }
            }


            if (resultsValidation.success.length === 0) {
                return ResponseHandler.success(res, resultsValidation);
            }

            const bandUpdated = await this.bandService.addMembers(id, resultsValidation.success);
            if (!bandUpdated) {
                return ResponseHandler.error(res, ERROR_UPDATING);
            }


            ResponseHandler.success(res, {
                message: 'Members processed',
                ...resultsValidation
            });
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    private async validateMember(artistId: string, currentMembers?: string[])
        : Promise<{ isValid: boolean, reason?: string }> {

        const artistFound = await this.artistService.getById(artistId);
        if (!artistFound) {
            return { isValid: false, reason: RESOURCE_NOT_FOUND }
        }

        if (currentMembers?.includes(artistId)) {
            return { isValid: false, reason: ARTIST_ALREADY_IN_BAND };
        }

        return { isValid: true }

    }

}