import { UploadedFile } from "express-fileupload";
import fs from 'fs';
import path from 'path';
import ErrorHandler from "../models/errorHandler";
const sharp = require('sharp');

export const uploadImage = async(folder: string,  file: UploadedFile, width: number, height: number): Promise<string> => {
    const { mv, name } = await file;
    const randomNumber: number = Math.floor(Math.random() * 100 + Date.now());
    const fileName = randomNumber + name;
    const imageFolder = path.resolve(__dirname, `../../images/${folder}`);
    const folderExists = fs.existsSync(imageFolder)
    if (!folderExists) {
        fs.mkdirSync(imageFolder);
    }
    
    await mv(`${imageFolder}/${fileName}`, (err :any) => {
        if(err) {
            fs.unlink(`${imageFolder}/${fileName}`, (err: any) => {
                if(err) {
                    console.log(err)
                    throw new ErrorHandler(203, "Error when trying to add image")
                }
            })
        }
    });
    await sharp(file.data)
        .resize(width, height)
        .toFile(`${imageFolder}/${fileName}`, (err:any, info: any) => {
            if(err) {
                throw new ErrorHandler(203, "Error while uploading image")
            }
    });
    return fileName
}