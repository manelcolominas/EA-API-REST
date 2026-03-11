import { Schema, model, Types } from 'mongoose';

// 1️⃣ Interface
export interface IStatistics {
    _id?: string;
    restaurant_id: Types.ObjectId;          // reference to Restaurant
    totalPointsGiven?: number;               // total points awarded to all clients
    loyalCustomers?: number;                 // number of repeat/frequent customers
    mostRequestedRewards?: Types.ObjectId[]; // references to most redeemed Rewards
    averagePointsPerVisit?: number;          // optional: for analytics
}

// 2️⃣ Schema
const statisticsSchema = new Schema<IStatistics>({
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, unique: true },
    totalPointsGiven: { type: Number, default: 0 },
    loyalCustomers: { type: Number, default: 0 },
    mostRequestedRewards: [{ type: Schema.Types.ObjectId, ref: 'Reward' }],
    averagePointsPerVisit: { type: Number, default: 0 }
}, { timestamps: true });

// 3️⃣ Model
export const StatisticsModel = model<IStatistics>('Statistics', statisticsSchema);