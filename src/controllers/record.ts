import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import UserService from '../services/user';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
   

    try {
       const savedUser = await UserService.createUser(req.body);
        return res.status(201).json(savedUser);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const user = await UserService.getUser(userId);
        return user ? res.status(200).json(user) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    try {
        const updatedUser = await UserService.updateUser(userId, req.body);
        return updatedUser ? res.status(201).json(updatedUser) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const user = await UserService.deleteUser(userId);
        return user ? res.status(201).json(user) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createUser, readUser, readAll, updateUser, deleteUser };
