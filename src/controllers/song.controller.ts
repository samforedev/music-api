import { Request, Response } from "express";

import { ISongService } from "../services/interfaces/song.service.interface";
import { SongService } from "../services/song.service";
import { ResponseHandler } from "../utils/responseHandler";
import { MinimalSongDto, SongDto } from "../models/dtos/song.dto";
import { ALBUM_NOT_ASSING, BAND_NOT_ASSIGN, ERROR_CREATING, RESOURCE_ALREADY_EXISTS } from "../models/constants";
import { IAlbumService } from "../services/interfaces/albumService.interface";
import { AlbumService } from "../services/album.service";
import { IBandService } from "../services/interfaces/bandService.interface";
import { BandService } from "../services/band.service";

/** Song controller */
export class SongController {

    private songService: ISongService;
    private albumService: IAlbumService;
    private bandService: IBandService;

    constructor(
        songService?: ISongService,
        albumService?: IAlbumService,
        bandService?: IBandService,
    ) {
        this.songService = songService || new SongService();
        this.albumService = albumService || new AlbumService();
        this.bandService = bandService || new BandService();
    }

    async createSong(req: Request, res: Response): Promise<void> {
        try {
            const songData: SongDto = req.body;

            const songFound = await this.songService.getByTitle(songData.title);
            if (songFound) {
                return ResponseHandler.error(res, { message: `Song ${RESOURCE_ALREADY_EXISTS}` }, 400);
            }

            if (songData.album) {
                const albumFound = await this.albumService.getById(songData.album.toString());
                if (!albumFound) {
                    return ResponseHandler.errorNotFound(res, `Album, ${songData.album}`);
                }
            }

            if (songData.band) {
                const bandFound = await this.bandService.getById(songData.band.toString());
                if (!bandFound) {
                    return ResponseHandler.errorNotFound(res, `Band, ${songData.band}`);
                }
            }

            const songCreated = await this.songService.addOne(songData);
            if (!songCreated) {
                return ResponseHandler.error(res, { message: ERROR_CREATING });
            }

            ResponseHandler.success(res, songCreated.id, 'Song Created');
        } catch (err) {
            ResponseHandler.error(res, err);
        }

    }

    async getAllSongs(req: Request, res: Response): Promise<void> {
        try {
            const page = Number(req.headers['page-number']) || 1;
            const limit = Number(req.headers['page-limit']) || 10;

            const pagingSongs = await this.songService.getAll(page, limit);

            res.set({
                'page-count': pagingSongs.total,
                'total-pages': pagingSongs.totalPages,
                'page-number': pagingSongs.page,
                'page-limit': pagingSongs.limit
            });

            const songsResponse: MinimalSongDto[] = pagingSongs.data.map(song => ({
                id: song.id.toString(),
                title: song.title,
                band: song.bandDetail?.name || BAND_NOT_ASSIGN,
                album: song.albumDetail?.title || ALBUM_NOT_ASSING
            }));

            ResponseHandler.success(res, songsResponse);
        } catch (err) {
            ResponseHandler.error(res, err);
        }
    }

}