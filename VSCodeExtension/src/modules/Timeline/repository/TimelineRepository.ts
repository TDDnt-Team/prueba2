import * as fs from 'fs';
import * as path from 'path';
import { Timeline } from '../domain/Timeline';

export class TimelineRepository {
    private filePath: string;

    constructor(extensionPath: string) {
        this.filePath = path.join(extensionPath, 'src', 'data.json');
    }

    async getTimelines(): Promise<Timeline[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                try {
                    const jsonData = JSON.parse(data);
                    const timelines = jsonData.map((item: any) => new Timeline(
                        item.numPassedTests, 
                        item.numTotalTests, 
                        new Date(item.timestamp)
                    ));
                    resolve(timelines);
                } catch (error) {
                    reject(new Error('Error al parsear el archivo JSON'));
                }
            });
        });
    }
}
