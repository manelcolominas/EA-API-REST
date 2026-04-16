import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import recordService from '../services/record';

const createRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const savedRecord = await recordService.createRecord(req.body);
        return res.status(201).json(savedRecord);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readRecord = async (req: Request, res: Response, next: NextFunction) => {
    const recordId = req.params.recordId;
    try {
        const record = await recordService.getRecord(recordId);
        return record ? res.status(200).json(record) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const records = await recordService.getAllRecords();
        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteRecord = async (req: Request, res: Response, next: NextFunction) => {
    const recordId = req.params.recordId;
    try {
        const record = await recordService.deleteRecord(recordId);
        return record ? res.status(201).json(record) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createRecord, readRecord, readAll, deleteRecord };
