import Aws from 'aws-sdk';
import config from 'config';
import { UploadedFile } from 'express-fileupload';
import ErrorHandler from '../models/errorHandler';
import { createWriteStream } from 'fs'
import path from 'path'
Aws.config.update({
    accessKeyId: config.get("ACCESS_KEY_ID"),
    secretAccessKey: config.get("SECRET_ACCES_KEY"),
    region: config.get("REGION")
});

const s3Bucket = new Aws.S3({
    params: {
        Bucket: config.get("BUCKET_NAME")
    }
})

export const uploadFile = async (folder: string,  file: UploadedFile): Promise<string> => {
    const { mv } = await file;
    await mv(path.resolve("./src/media/product"), (err: any) => {
        console.log("EEEEEEEEEEEEEEEEEEEEEEEE", err)
    });
    return ""
    const randomNumber: number = Math.floor(Math.random() * 100 + Date.now());
    const fileName = randomNumber + file.name ; 
    const data: any = {
        Key: `${folder}/${fileName}`,
        Body: file.data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    }

    // s3Bucket.putObject(data, err => {
    //     if(err) {
    //         throw new ErrorHandler(403, "Somenting went wrong when uploading file")
    //     }
        
    // })
    return fileName;
};