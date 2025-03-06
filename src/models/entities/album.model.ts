import mongoose, { Schema, Document, Types } from "mongoose";
import { IBand } from "./band.model";
import { StatusEntity } from "../enums/common.enum";

/**
 * Interface to define the estructu of Album
 */
export interface IAlbum extends Document {
    title: string;
    releaseYear: Date;
    band?: Types.ObjectId | string;
    bandDetail?: IBand | null;
    genre?: string | null;
    description?: string;
    duration?: number | null;
    recordLabel?: string | null;
    recordedAt?: string | null;
    status: StatusEntity;
}

/**
 * Mongoose schema for the album model
 */
const AlbumSchema: Schema<IAlbum> = new Schema(
    {
        title: { type: String, required: true },
        releaseYear: { type: Date, required: true },
        band: { type: Schema.Types.ObjectId, ref: "Band" },
        genre: { type: String, default: null },
        description: { type: String, default: null },
        duration: { type: Number, default: null },
        recordLabel: { type: String, default: null },
        recordedAt: { type: String, default: null },
        status: { type: String, enum: Object.values(StatusEntity), default: StatusEntity.ACTIVATED }
    },
    { timestamps: true }
);

AlbumSchema.set("toObject", { virtuals: true });
AlbumSchema.set("toJSON", { virtuals: true });

AlbumSchema.virtual("bandDetail", {
    ref: "Band",
    localField: "band",
    foreignField: "_id",
    justOne: true,
    options: { select: "name formationYear status" }
});

export const Album = mongoose.model<IAlbum>("Album", AlbumSchema);