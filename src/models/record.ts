import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IRecord {
    _id: Types.ObjectId;
    relatedEntityType: string ;
    relatedEntityId: Types.ObjectId;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: {
        field: string;
        previous: any;
        current: any;
    }[];
}

const RecordSchema: Schema = new Schema(
    {
        relatedEntityType: { type: String, required: true },
        relatedEntityId: { type: Schema.Types.ObjectId, required: true },
        action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
        changes: [
            {
                field: { type: String, required: true },
                previous: { type: Schema.Types.Mixed },
                current: { type: Schema.Types.Mixed },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export const RecordModel = model<IRecord>('Record', RecordSchema);
