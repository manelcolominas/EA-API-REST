import mongoose from 'mongoose';
import { RecordModel, IRecord } from '../models/record';

const createRecord = async (data: Partial<IRecord>): Promise<IRecord> => {
    const record = new RecordModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await record.save();
};

const getRecord = async (recordId: string): Promise<IRecord | null> => {
    return await RecordModel.findById(recordId);
};

const getAllRecords = async (): Promise<IRecord[]> => {
    return await RecordModel.find().sort({ createdAt: -1 });
};

const getRecordsByEntity = async ( entityType: string, entityId: string ): Promise<IRecord[]> => {
    return await RecordModel.find({
        relatedEntityType: entityType,
        relatedEntityId: entityId }).sort({ createdAt: -1 });
};

const deleteRecord = async (recordId: string): Promise<IRecord | null> => {
    return await RecordModel.findByIdAndDelete(recordId);
};

export default {
    createRecord,
    getRecord,
    getAllRecords,
    getRecordsByEntity,
    deleteRecord
};