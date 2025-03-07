import { Request, Response } from "express";
import { ArtistService } from "../services/artist.service";
import { IArtistService } from "../services/interfaces/artistService.interface";
import { AddManyArtistsDto, AddManyResponseDto, ArtistDto, MinimalArtistDto } from "../models/dtos/artist.dto";
import { ResponseHandler } from "../utils/responseHandler";
import { ERROR_CHANGESTATUS, ERROR_CREATING, RESOURCE_ALREADY_EXISTS } from "../models/constants";
import { FilterRequestDto } from "../models/commons/paginateResponse.model";
import { StatusEntity } from "../models/enums/common.enum";

/**
 * Artist controller
 */
export class ArtistController {

    private artistService: IArtistService;

    constructor(artistService?: IArtistService) {
        this.artistService = artistService || new ArtistService();
    }

    /**
     * Create a new Artist
     * @param req 
     * @param res 
     */
    async createArtist(req: Request, res: Response): Promise<void> {
        try {
            const artistData: ArtistDto = req.body;

            const artistFound = await this.artistService.getByName(artistData.name);
            if (artistFound) {
                return ResponseHandler.error(
                    res, { message: `Artist ${RESOURCE_ALREADY_EXISTS}` }, 400);
            }

            const artistCreated = await this.artistService.addOne(artistData);
            if (!artistCreated) {
                return ResponseHandler.error(
                    res, { message: `Artist ${ERROR_CREATING}` });
            }

            ResponseHandler.success(res, artistCreated.id, 'Artist created', 201);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Create multiple artists
     * @param req 
     * @param res 
     */
    async createManyArtist(req: Request, res: Response): Promise<void> {
        try {

            const artistsData: ArtistDto[] = req.body;

            var addMayDto: AddManyArtistsDto = {
                success: [],
                failed: []
            };

            for (const artistData of artistsData) {
                const resultValidation = await this.artistForCreateValidation(artistData);
                if (!resultValidation.isValid) {
                    addMayDto.failed.push({ name: artistData.name, reason: resultValidation.reason })
                    continue;
                }

                addMayDto.success.push(artistData);
            }

            if (addMayDto.success.length === 0) {
                return ResponseHandler.success(res, addMayDto, ERROR_CREATING);
            }

            const artists = await this.artistService.addMany(addMayDto.success);
            if (!artists) {
                return ResponseHandler.error(res, ERROR_CREATING);
            }

            const artistsDto: any[] = artists.map(artist => ({
                id: artist._id,
                name: artist.name,
                role: artist.role
            }));

            const artistsResponse: AddManyResponseDto = {
                success: artistsDto.map(artist => artist.id),
                failed: addMayDto.failed
            };
            ResponseHandler.success(res, artistsResponse, 'Artists Created');
        } catch (err) {
            ResponseHandler.error(res, err);
        }

    }

    /**
     * Get All Artists
     * @param req 
     * @param res 
     */
    async getAllArtists(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;

            const pagingArtists = await this.artistService.getAll(page, limit);

            const artists: MinimalArtistDto[] = pagingArtists.data.map(artist => ({
                id: artist.id,
                name: artist.name,
                role: artist.role
            }));

            res.set({
                'page-count': pagingArtists.total,
                'total-pages': pagingArtists.totalPages,
                'page-number': pagingArtists.page,
                'page-limit': pagingArtists.limit
            });

            ResponseHandler.success(res, artists);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

    /**
     * Get Artist by Id
     * @param req 
     * @param res 
     */
    async getArtistById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) return ResponseHandler.error(res, { message: 'Artist Id is required' });

            const artist = await this.artistService.getById(id);
            if (!artist) return ResponseHandler.errorNotFound(res, 'Artist');

            const artistResponse: ArtistDto = {
                id: artist.id,
                name: artist.name,
                alias: artist.alias || '',
                birthDate: artist.birthDate,
                deathDate: artist.deathDate || null,
                instruments: artist.instruments || [],
                role: artist.role,
                isAlive: artist.isAlive ?? true,
                nationality: artist.nationality,
                artistKey: artist.artistKey || '',
                status: artist.status || ''
            };

            ResponseHandler.success(res, artistResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

    /**
     * Get all artists by Filters
     * @param req 
     * @param res 
     */
    async getArtistsByFilter(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;
            const filterData: FilterRequestDto = req.body;

            const pagingArtists = await this.artistService.getByFilter(page, limit, filterData.filter!);

            const artists: MinimalArtistDto[] = pagingArtists.data.map(artist => ({
                id: artist.id,
                name: artist.name,
                role: artist.role
            }));

            res.set({
                'page-count': pagingArtists.total,
                'total-pages': pagingArtists.totalPages,
                'page-number': pagingArtists.page,
                'page-limit': pagingArtists.limit
            });

            ResponseHandler.success(res, artists);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

    /**
     * Change status for Artists
     * @param req 
     * @param res 
     */
    async changeArtistStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) return ResponseHandler.error(res, { message: 'Artist Id is required' });

            const artistFound = await this.artistService.getById(id);
            if (!artistFound) return ResponseHandler.errorNotFound(res, 'Artist');

            const status = req.path.includes(StatusEntity.ACTIVATED) ? StatusEntity.ACTIVATED : StatusEntity.DEACTIVATED;
            if (artistFound.status == status) {
                return ResponseHandler.error(
                    res, { message: `Artist status already ${status}` });
            }

            const artistUpdated = await this.artistService.changeStatus(id, status);
            if (!artistUpdated) {
                return ResponseHandler.error(res, { message: ERROR_CHANGESTATUS });
            }

            ResponseHandler.success(res, { id: artistUpdated.id, currentStatus: artistUpdated.status });
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Method o validate artistData
     * @param artist 
     */
    private async artistForCreateValidation(artist: ArtistDto): Promise<{ isValid: boolean, reason?: string }> {
        const artistFound = await this.artistService.getByName(artist.name);
        if (artistFound) {
            return { isValid: false, reason: RESOURCE_ALREADY_EXISTS }
        };

        return { isValid: true };
    }

}