import mongoose from 'mongoose';
import { OrganizationModel, IOrganization } from '../models/organization';
import RecordService from './record';

const createOrganization = async (data: Partial<IOrganization>): Promise<IOrganization> => {
    const organization = new OrganizationModel({
        _id: new mongoose.Types.ObjectId(),
        users: [],
        ...data
    });
    const savedOrg = await organization.save();

    // Create a record for organization creation
    await RecordService.createRecord({
        relatedEntityType: 'Organization',
        relatedEntityId: savedOrg._id,
        action: 'CREATE',
        changes: [{ field: 'all', previous: null, current: savedOrg.toObject() }]
    });

    return savedOrg;
};

const getOrganization = async (organizationId: string): Promise<IOrganization | null> => {
    return await OrganizationModel.findById(organizationId);
};

const getAllOrganizations = async (): Promise<IOrganization[]> => {
    return await OrganizationModel.find();
};

const updateOrganization = async (organizationId: string, data: Partial<IOrganization>): Promise<IOrganization | null> => {
    const organization = await OrganizationModel.findById(organizationId);
    if (organization) {
        const oldOrg = organization.toObject();
        organization.set(data);
        const updatedOrg = await organization.save();

        // Create a record for organization update
        const changes: { field: string; previous: any; current: any }[] = [];
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                // Compare values
                const oldValue = oldOrg[key as keyof IOrganization];
                const newValue = updatedOrg[key as keyof IOrganization];

                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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
                relatedEntityType: 'Organization',
                relatedEntityId: updatedOrg._id,
                action: 'UPDATE',
                changes: changes
            });
        }

        return updatedOrg;
    }
    return null;
};

const deleteOrganization = async (organizationId: string): Promise<IOrganization | null> => {
    const orgToDelete = await OrganizationModel.findById(organizationId);
    if (!orgToDelete) {
        return null;
    }

    const deletedOrg = await OrganizationModel.findByIdAndDelete(organizationId);

    // Create a record for organization deletion
    if (deletedOrg) {
        await RecordService.createRecord({
            relatedEntityType: 'Organization',
            relatedEntityId: deletedOrg._id,
            action: 'DELETE',
            changes: [{ field: 'all', previous: deletedOrg.toObject(), current: null }]
        });
    }

    return deletedOrg;
};

const getOrganizationWithUsers = async (organizationId: string): Promise<IOrganization | null> => {
    return await OrganizationModel.findById(organizationId).populate('users', '-organization -password -createdAt -updatedAt').lean();
};

const removeUserFromOrganization = async (organizationId: string, userId: string): Promise<IOrganization | null> => {
    const org = await OrganizationModel.findById(organizationId);
    if (!org) return null;
    const oldOrg = org.toObject();

    const updatedOrg = await OrganizationModel.findByIdAndUpdate(
        organizationId,
        { $pull: { users: userId } },
        { new: true }
    );

    if (updatedOrg) {
        // Log the change in users array
        await RecordService.createRecord({
            relatedEntityType: 'Organization',
            relatedEntityId: updatedOrg._id,
            action: 'UPDATE',
            changes: [{ field: 'users', previous: oldOrg.users, current: updatedOrg.users }]
        });
    }

    return updatedOrg;
};

export default { createOrganization, getOrganization, getAllOrganizations, updateOrganization, deleteOrganization, getOrganizationWithUsers, removeUserFromOrganization };
