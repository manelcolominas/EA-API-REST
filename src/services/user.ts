import mongoose from 'mongoose';
import User, { IUserModel, IUser } from '../models/customer';
import Organization from '../models/restaurant';

const createUser = async (data: Partial<IUser>): Promise<IUserModel> => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    const savedUser = await user.save();

    // Afegir l'usuari a l'organització
    await Organization.findByIdAndUpdate(
        savedUser.organization,
        { $addToSet: { users: savedUser._id } }
    );

    return savedUser;
};

const getUser = async (userId: string): Promise<IUserModel | null> => {
    return await User.findById(userId).populate('organization', 'name');
};

const getAllUsers = async (): Promise<IUserModel[]> => {
    return await User.find().populate('organization', 'name');
};

const updateUser = async (userId: string, data: Partial<IUser>): Promise<IUserModel | null> => {
    const user = await User.findById(userId);
    if (user) {
        // Si l'organització canvia, actualitzar les llistes d'usuaris a les organitzacions
        if (data.organization && data.organization.toString() !== user.organization.toString()) {
            // Eliminar de l'antiga organització
            await Organization.findByIdAndUpdate(user.organization, {
                $pull: { users: user._id }
            });

            // Afegir a la nova organització
            await Organization.findByIdAndUpdate(data.organization, {
                $addToSet: { users: user._id }
            });
        }

        user.set(data);
        return await user.save();
    }
    return null;
};

const deleteUser = async (userId: string): Promise<IUserModel | null> => {
    return await User.findByIdAndDelete(userId);
};

export default { createUser, getUser, getAllUsers, updateUser, deleteUser };
