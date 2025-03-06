import mongoose, { Schema, Document, Types } from "mongoose";
import { StatusEntity } from "../enums/common.enum";
import { IArtist } from "./artist.model";

/**
 * Interface to define the structure of Band
 */
export interface IBand extends Document {
    name: string;
    alias?: string;
    formationYear: number;
    disbandYear?: number | null;
    isActive: boolean;
    genre: string[];
    members?: Types.ObjectId[] | string[];
    membersDetails: IArtist[];
    nationality?: string;
    status: StatusEntity;
}

/**
 * Mongoose schema for the Band model
 */
const BandSchema: Schema<IBand> = new Schema(
    {
        name: { type: String, required: true },
        alias: { type: String },
        formationYear: { type: Number, required: true },
        disbandYear: { type: Number, default: null },
        isActive: { type: Boolean, default: true },
        genre: [{ type: String, required: true }],
        members: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
        nationality: { type: String },
        status: { type: String, enum: Object.values(StatusEntity), default: StatusEntity.ACTIVATED }
    },
    { timestamps: true }
);

BandSchema.set("toObject", { virtuals: true });
BandSchema.set("toJSON", { virtuals: true });
BandSchema.virtual("membersDetails", {
    ref: "Artist",
    localField: "members",
    foreignField: "_id",
    justOne: false,
    options: { select: "name alias role" }
});

export const Band = mongoose.model<IBand>("Band", BandSchema);