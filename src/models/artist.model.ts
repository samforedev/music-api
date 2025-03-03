import mongoose, { Schema, Document } from "mongoose";
import { ArtistRole } from "./enums/artists.enum";
import { StatusEntity } from "./enums/common.enum";

/**
 * Interface to define the structure of Artist
 */
export interface IArtist extends Document {
    name: string;
    alias?: string;
    birthDate?: Date;
    isAlive?: boolean;
    deathDate?: Date;
    role: ArtistRole;
    nationality?: string;
    instruments?: string[];
    artistKey: string;
    status: StatusEntity;
}

/**
 * Mongoose schematic for the artist model
 */
const ArtistSchema: Schema<IArtist> = new Schema(
    {
        name: { type: String, required: true },
        alias: { type: String },
        birthDate: { type: Date },
        deathDate: { type: Date, default: null },
        instruments: [{ type: String }],
        role: { type: String, enum: Object.values(ArtistRole), default: ArtistRole.NONE },
        isAlive: { type: Boolean, default: true },
        nationality: { type: String },
        artistKey: { type: String, required: true },
        status: { type: String, enum: Object.values(StatusEntity), default: StatusEntity.ACTIVATED }
    },
    { timestamps: true },
);

export const Artist = mongoose.model<IArtist>("Artist", ArtistSchema);