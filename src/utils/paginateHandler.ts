import { Document, FilterQuery, Model } from "mongoose";
import { PaginateResponse } from "../models/commons/paginateResponse.model";

function applyRegexFilter<T>(filter: FilterQuery<T>): FilterQuery<T> {
    const newFilter: FilterQuery<T> = {};

    for (const key in filter) {
        const value = (filter as Record<string, any>)[key];
        if (typeof value === "string") {
            (newFilter as Record<string, any>)[key] = { $regex: value, $options: "i" };
        } else {
            (newFilter as Record<string, any>)[key] = value;
        }
    }
    return newFilter;
}


export async function Paginate<T extends Document>(
    model: Model<T>,
    page: number = 1,
    limit: number = 10,
    filter: FilterQuery<T> = {}
): Promise<PaginateResponse<T>> {
    const skip = (page - 1) * limit;
    const formattedFilter = applyRegexFilter(filter);

    const [data, total] = await Promise.all([
        model.find(formattedFilter).skip(skip).limit(limit),
        model.countDocuments(formattedFilter)
    ]);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data
    };
}