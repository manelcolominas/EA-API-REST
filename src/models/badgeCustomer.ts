import { Schema, model, Types } from 'mongoose';

// 1️⃣ Interface
export interface IBadgeCustomer {
    _id?: Types.ObjectId;
    title: string;
    description: string;
}

// 2️⃣ Schema
const badgeCustomerSchema = new Schema<IBadgeCustomer>({
    title: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

// 3️⃣ Model
export const BadgeModel = model<IBadgeCustomer>('BadgeCustomer', badgeCustomerSchema);