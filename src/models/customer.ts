import { Schema, model, Types } from 'mongoose';

// Interface
export interface ICustomer {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
    profilePictures?: string[];
    pointsWallet?: { restaurant_id: Types.ObjectId; points: number }[];
    visitHistory?: Types.ObjectId[];
    favoriteRestaurants?: Types.ObjectId[];
    badges?: Types.ObjectId[];
    reviews?: Types.ObjectId[];
}

// Schema
const customerSchema = new Schema<ICustomer>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    passwordHash: { type: String },
    profilePictures: [{ type: String }],
    pointsWallet: [{
        restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        points: { type: Number, default: 0, required: true },
    }],
    visitHistory: [{ type: Schema.Types.ObjectId, ref: 'Visit' }],
    badges: [{ type: Schema.Types.ObjectId, ref: 'BadgeCustomer' }],
    favoriteRestaurants: [{ type: Schema.Types.ObjectId, ref: 'Restaurant' }],
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

// Model
export const CustomerModel = model<ICustomer>('Customer', customerSchema);