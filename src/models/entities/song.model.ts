import mongoose, { Schema, Document, Types } from "mongoose";
import { IAlbum } from "./album.model";
import { IBand } from "./band.model";
import { StatusEntity } from "../enums/common.enum";

/**
 * Interface to define the structure of Song
 */
export interface ISong extends Document {
    title: string;
    band?: Types.ObjectId | string;
    bandDetail?: IBand | null;
    album?: Types.ObjectId | string;
    albumDetail?: IAlbum | null;
    status: StatusEntity;
}

/**
 * Mongoose schema for the song model
 */
const SongSchema: Schema<ISong> = new Schema(
    {
        title: { type: String, required: true },
        band: { type: Schema.Types.ObjectId, ref: "Band" },
        album: { type: Schema.Types.ObjectId, ref: "Album" },
        status: { type: String, enum: Object.values(StatusEntity), default: StatusEntity.ACTIVATED }
    },
    { timestamps: true }
);

SongSchema.set("toObject", { virtuals: true });
SongSchema.set("toJSON", { virtuals: true });

SongSchema.virtual("bandDetail", {
    ref: "Band",
    localField: "band",
    foreignField: "_id",
    justOne: true,
    options: { select: "name" }
});

SongSchema.virtual("albumDetail", {
    ref: "Album",
    localField: "album",
    foreignField: "_id",
    justOne: true,
    options: { select: "title" }
});

export const Song = mongoose.model<ISong>("Song", SongSchema);