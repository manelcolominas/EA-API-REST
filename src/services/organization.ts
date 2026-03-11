import mongoose from 'mongoose';
import Organization, { IOrganizationModel, IOrganization } from '../models/restaurant';

const createOrganization = async (data: Partial<IOrganization>): Promise<IOrganizationModel> => {
    const organization = new Organization({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return await organization.save();
};

const getOrganization = async (organizationId: string): Promise<IOrganizationModel | null> => {
    return await Organization.findById(organizationId);
};

const getAllOrganizations = async (): Promise<IOrganizationModel[]> => {
    return await Organization.find();
};

const updateOrganization = async (organizationId: string, data: Partial<IOrganization>): Promise<IOrganizationModel | null> => {
    const organization = await Organization.findById(organizationId);
    if (organization) {
        organization.set(data);
        return await organization.save();
    }
    return null;
};

const deleteOrganization = async (organizationId: string): Promise<IOrganizationModel | null> => {
    return await Organization.findByIdAndDelete(organizationId);
};

const getOrganizationWithUsers = async (organizationId: string): Promise<IOrganizationModel | null> => {
    return await Organization.findById(organizationId).populate('users', '-organization').lean();
};

export default { createOrganization, getOrganization, getAllOrganizations, updateOrganization, deleteOrganization, getOrganizationWithUsers };
