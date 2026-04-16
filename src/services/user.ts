import mongoose from 'mongoose';
import { UserModel, IUser } from '../models/user';
import { OrganizationModel } from '../models/organization';
import RecordService from './record';

const createUser = async (data: Partial<IUser>): Promise<IUser> => {
    const user = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    const savedUser = await user.save();

    // Add the user to the organization
    await OrganizationModel.findByIdAndUpdate(
        savedUser.organization,
        { $addToSet: { users: savedUser._id } }
    );

    // Create a record for user creation
    await RecordService.createRecord({
        relatedEntityType: 'User',
        relatedEntityId: savedUser._id,
        action: 'CREATE',
        changes: [{ field: 'all', previous: null, current: savedUser.toObject() }]
    });

    return savedUser;
};

const getUser = async (userId: string): Promise<IUser | null> => {
    const user = await UserModel.findById(userId).populate('organization', 'name');
    return user;
};

const getAllUsers = async (): Promise<IUser[]> => {
    const users = await UserModel.find().populate('organization', 'name');
    return users;
};

const updateUser = async (userId: string, data: Partial<IUser>): Promise<IUser | null> => {
    const user = await UserModel.findById(userId);
    if (user) {
        const oldUser = user.toObject(); // Get a plain object of the user before update

        // If the organization changes, update the user lists in the organizations
        if (data.organization && data.organization.toString() !== user.organization.toString()) {
            // Remove from the old organization
            await OrganizationModel.findByIdAndUpdate(user.organization, {
                $pull: { users: user._id }
            });

            // Add to the new organization
            await OrganizationModel.findByIdAndUpdate(data.organization, {
                $addToSet: { users: user._id }
            });
        }

        user.set(data);
        const updatedUser = await user.save();

        // Create a record for user update
        const changes: { field: string; previous: any; current: any }[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Ensure we compare string representations for ObjectIds
                const oldValue = oldUser[key as keyof IUser] instanceof mongoose.Types.ObjectId ? oldUser[key as keyof IUser].toString() : oldUser[key as keyof IUser];
                const newValue = updatedUser[key as keyof IUser] instanceof mongoose.Types.ObjectId ? updatedUser[key as keyof IUser].toString() : updatedUser[key as keyof IUser];

                if (oldValue !== newValue) {
                    changes.push({
                        field: key,
                        previous: oldValue,
                        current: newValue
                    });
                }
            }
        }

        if (changes.length > 0) {
            await RecordService.createRecord({
                relatedEntityType: 'User',
                relatedEntityId: updatedUser._id,
                action: 'UPDATE',
                changes: changes
            });
        }

        return updatedUser;
    }
    return null;
};

const deleteUser = async (userId: string): Promise<IUser | null> => {
    const userToDelete = await UserModel.findById(userId);
    if (!userToDelete) {
        return null;
    }

    // Remove the user from their organization
    await OrganizationModel.findByIdAndUpdate(userToDelete.organization, {
        $pull: { users: userToDelete._id }
    });

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    // Create a record for user deletion
    if (deletedUser) {
        await RecordService.createRecord({
            relatedEntityType: 'User',
            relatedEntityId: deletedUser._id,
            action: 'DELETE',
            changes: [{ field: 'all', previous: deletedUser.toObject(), current: null }]
        });
    }

    return deletedUser;
};

export default { createUser, getUser, getAllUsers, updateUser, deleteUser };
