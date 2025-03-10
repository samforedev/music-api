import { Request, Response } from "express";

import { AlbumService } from "../services/album.service";
import { BandService } from "../services/band.service";
import { IAlbumService } from "../services/interfaces/albumService.interface";
import { IBandService } from "../services/interfaces/bandService.interface";
import { ResponseHandler } from "../utils/responseHandler";
import { AlbumDto, MinimalALbumDto } from "../models/dtos/album.dto";
import { ALBUM_ERROR_ASSIGN_BAND, ERROR_CHANGESTATUS, ERROR_CREATING, ERROR_UPDATING, RESOURCE_ALREADY_EXISTS } from "../models/constants";
import { FilterRequestDto } from "../models/commons/paginateResponse.model";
import { StatusEntity } from "../models/enums/common.enum";
import { ISongService } from "../services/interfaces/song.service.interface";
import { SongService } from "../services/song.service";

/** Album controller */
export class AlbumController {

    private albumService: IAlbumService;
    private bandService: IBandService;
    private songService: ISongService;

    constructor(
        albumService?: IAlbumService,
        bandService?: IBandService,
        songServoce?: ISongService
    ) {
        this.albumService = albumService || new AlbumService();
        this.bandService = bandService || new BandService();
        this.songService = songServoce || new SongService();
    }

    async addSongToAlbum(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { songId } = req.body;

            console.log(songId);

            const albumFound = await this.albumService.getById(id);
            if (!albumFound) {
                return ResponseHandler.errorNotFound(res, 'Album');
            }

            const songFound = await this.songService.getById(songId);
            if (!songFound) {
                return ResponseHandler.errorNotFound(res, 'Song');
            }

            const albumUpdated = await this.albumService.addSong(id, songId);
            if (!albumUpdated) {
                return ResponseHandler.error(res, { message: ERROR_UPDATING });
            }

            ResponseHandler.success(res, albumUpdated._id, 'Song add Successfully');
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

    /**
     * Create a new Album
     * @param req 
     * @param res 
     * @returns 
     */
    async createAlbum(req: Request, res: Response): Promise<void> {
        try {
            const albumData: AlbumDto = req.body;
            var flag = false;

            const albumFound = await this.albumService.getByTitle(albumData.title);
            if (albumFound) {
                return ResponseHandler.error(
                    res, { message: `Album ${RESOURCE_ALREADY_EXISTS}` }, 400);
            }

            if (albumData.band) {
                const bandFound = await this.bandService.getById(albumData.band.toString());
                if (!bandFound) {
                    return ResponseHandler.errorNotFound(
                        res, `Album ${albumData.band}`);
                }
                flag = true;
            }

            const albumCreated = await this.albumService.addOne(albumData);
            if (!albumCreated) {
                return ResponseHandler.error(res, { message: ERROR_CREATING });
            }

            if (flag) {
                const bandUpdated = await this.bandService.addOneAlbum(albumData.band!.toString(), albumCreated._id!.toString());
                if (!bandUpdated) {
                    return ResponseHandler.error(res, { message: ALBUM_ERROR_ASSIGN_BAND });
                }
            }

            ResponseHandler.success(res, albumCreated.id, 'Album created');
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get all albums
     * @param req 
     * @param res 
     */
    async getAllAlbums(req: Request, res: Response): Promise<void> {
        try {

            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;

            const pagingAlbums = await this.albumService.getAll(page, limit);

            res.set({
                'page-count': pagingAlbums.total,
                'total-pages': pagingAlbums.totalPages,
                'page-number': pagingAlbums.page,
                'page-limit': pagingAlbums.limit
            });

            const albumsResponse: MinimalALbumDto[] = pagingAlbums.data.map(album => ({
                id: album.id.toString(),
                title: album.title,
                releaseYear: album.releaseYear,
                band: album.bandDetail
                    ? {
                        id: album.bandDetail._id!.toString() || undefined,
                        name: album.bandDetail.name || undefined
                    }
                    : undefined
            }));


            ResponseHandler.success(res, albumsResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get ALbum by Id
     * @param req 
     * @param res 
     * @returns 
     */
    async getAlbumById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, { message: 'Album Id is required' });
            }

            const album = await this.albumService.getById(id);
            if (!album) {
                return ResponseHandler.errorNotFound(res, 'Album');
            }

            const albumResponse: AlbumDto = {
                id: album.id,
                title: album.title,
                releaseYear: album.releaseYear,
                bandDetail: album.bandDetail || null,
                genre: album.genre,
                description: album.description,
                duration: album.duration,
                songsDetails: album.songsDetails || [],
                recordLabel: album.recordLabel,
                recordedAt: album.recordedAt,
                status: album.status
            };

            ResponseHandler.success(res, albumResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get Album by Filter
     * @param req 
     * @param res 
     */
    async getAlbumByFilter(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;
            const filterData: FilterRequestDto = req.body;

            const pagingAlbums = await this.albumService.getByFilter(page, limit, filterData.filter!);

            const albums: MinimalALbumDto[] = pagingAlbums.data.map(album => ({
                id: album.id,
                title: album.title,
                releaseYear: album.releaseYear
            }));

            res.set({
                'page-count': pagingAlbums.total,
                'total-pages': pagingAlbums.totalPages,
                'page-number': pagingAlbums.page,
                'page-limit': pagingAlbums.limit
            });

            ResponseHandler.success(res, albums);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Change Album status
     * @param req 
     * @param res 
     * @returns 
     */
    async changeAlbumStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                return ResponseHandler.error(res, { message: 'Album Id is required' });
            }

            const albumFound = await this.albumService.getById(id);
            if (!albumFound) {
                return ResponseHandler.errorNotFound(res, 'Album');
            }

            const status = req.path.includes(StatusEntity.ACTIVATED) ? StatusEntity.ACTIVATED : StatusEntity.DEACTIVATED;
            if (albumFound.status == status) {
                return ResponseHandler.error(
                    res, { message: `Album status already ${status}` });
            }

            const albumUpdated = await this.albumService.changeStatus(id, status);
            if (!albumUpdated) {
                return ResponseHandler.error(res, { message: ERROR_CHANGESTATUS });
            }

            ResponseHandler.success(res, {
                id: albumUpdated.id,
                currentStatus: albumUpdated.status
            });
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get ALbum by Title
     * @param req 
     * @param res 
     * @returns 
     */
    async getAlbumByTitle(req: Request, res: Response): Promise<void> {
        try {
            const title = req.query;

            const albumFound = await this.albumService.getByTitle(title.toString());
            if (!albumFound) {
                return ResponseHandler.errorNotFound(res, 'Album');
            }

            const albumResponse: AlbumDto = {
                id: albumFound.id,
                title: albumFound.title,
                releaseYear: albumFound.releaseYear,
                band: albumFound.band,
                genre: albumFound.genre,
                description: albumFound.description,
                duration: albumFound.duration,
                recordLabel: albumFound.recordLabel,
                recordedAt: albumFound.recordedAt,
                status: albumFound.status
            };

            ResponseHandler.success(res, albumResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }


    /**
     * Get albums by Band Id
     * @param req 
     * @param res 
     * @returns 
     */
    async getAllAlbumsByBandId(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;
            const { id } = req.params;

            const bandFound = await this.bandService.getById(id);
            if (!bandFound) {
                return ResponseHandler.errorNotFound(res, 'band');
            }

            const pagingResponse = await this.albumService.getAllByBandId(id, page, limit);
            const albums: MinimalALbumDto[] = pagingResponse.data.map(album => ({
                id: album.id,
                title: album.title,
                releaseYear: album.releaseYear
            }));

            res.set({
                'page-count': pagingResponse.total,
                'total-pages': pagingResponse.totalPages,
                'page-number': pagingResponse.page,
                'page-limit': pagingResponse.limit
            });

            ResponseHandler.success(res, albums);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

}