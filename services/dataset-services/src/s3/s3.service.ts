import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { readFile } from 'fs/promises';
import { basename } from 'path';

@Injectable()
export class S3Service {
    private s3: AWS.S3;

    constructor()
    {
        this.s3 = new AWS.S3();
    }
    // keyPrefix can be workspaceId or userId or datasetId
    async uploadFileToS3(bucketName: string, filePath: string, userId: string, workspaceId: string): Promise<AWS.S3.ManagedUpload.SendData>
    {
        try {
            const fileData = await readFile(filePath);
            const baseFileName = basename(filePath);
            const s3Key = `${userId}/${workspaceId}/${baseFileName}`;
      
            const params = {
              Bucket: bucketName,
              Key: s3Key,
              Body: fileData,
              ContentType: 'application/pdf',
            };
      
            return await this.s3.upload(params).promise();
          } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
          }
    }
    async getFileFromS3(bucketName: string, filePath: string, userId: string, workspaceId: string): Promise<AWS.S3.GetObjectOutput>
    {
        try{
            const baseFileName = basename(filePath);
            const s3Key = `${userId}/${workspaceId}/${baseFileName}`;
            
            const params = {
              Bucket: bucketName,
              Key: s3Key,
            };
            return await this.s3.getObject(params).promise();
        }
        catch (error) {
            console.error('Error getting file from S3:', error);
            throw error;
          }
      }
        
}
  
