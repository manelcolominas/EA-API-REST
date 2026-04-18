import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Logging from '../library/logging';

// Import all models
import { OrganizationModel } from '../models/organization';
import { UserModel } from '../models/user';
import { RecordModel} from '../models/record';


const modelMap: { [key: string]: mongoose.Model<any> } = {
    'organizations.json': OrganizationModel,
    'users.json': UserModel,
    RecordModel
};

export const insertData = async () => {
    try {
        // Try multiple locations for the data directory
        const possiblePaths = [
            path.join(__dirname, '../data'),           // build/data
            path.join(process.cwd(), 'src/data'),      // src/data (from root)
            path.join(__dirname, '../../src/data')     // src/data (relative to build/utils)
        ];

        let dataDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                dataDir = p;
                break;
            }
        }

        if (!dataDir) {
            Logging.error('Data directory not found. Searched in: ' + possiblePaths.join(', '));
            return;
        }

        Logging.info(`Using data directory: ${dataDir}`);

        const files = fs.readdirSync(dataDir);
        // Delete all data from collections
        for (const file of files) {
            if (file.endsWith('.json')) {
                const model = modelMap[file];
                if (model) {
                    Logging.info(`Deleting all data from ${model.collection.name} collection...`);
                    await model.deleteMany({});
                    Logging.info(`All data deleted from ${model.collection.name} collection.`);
                }
            }
        }
        for (const file of files) {
            if (file.endsWith('.json')) {
                const model = modelMap[file];
                if (model) {
                    const filePath = path.join(dataDir, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const data = JSON.parse(fileContent);
                    Logging.info(`Inserting data into ${model.collection.name} collection...`);
                    await model.insertMany(data);
                    Logging.info(`Data inserted into ${model.collection.name} collection.`);
                }
            }
        }
        Logging.info('Database data check completed.');
    } catch (error) {
        Logging.error('Error inserting data:');
        Logging.error(error);
    }
};
