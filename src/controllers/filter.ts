import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import FilterDb from '../collections/filter';
import { IFilterInput } from "../interfaces/filters";
import { convertDbFilterNormal, convertFilterObjectToDb } from '../common/filter';

class FilterController {
    protected _db: typeof FilterDb = FilterDb;
    get db () {
        return this._db
    };

    public createFilter = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const filterInput:any = req.body;
            const filter: IFilterInput = convertFilterObjectToDb(filterInput);
            await this.db.createFilter(filter);
            res.status(200).json({status: true})
        } catch (error) {
            next(error);
        }    
    }
    public getFilters = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getFilters();
            const filters = documents.map(convertDbFilterNormal)
            res.status(200).json({ filters })
        } catch (error) {
            next(error);
        }    
    }
    public customerGetFilters = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.customerGetFilters();
            const filters = documents.map(convertDbFilterNormal)
            res.status(200).json({ filters })
        } catch (error) {
            next(error);
        }    
    }
    public getFilter = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { filter_id } = req.params;
        try {
            const document: Document = await this.db.getFilterById(filter_id);
            const filter = convertDbFilterNormal(document)
            res.status(200).json({ filter })
        } catch (error) {
            next(error);
        }    
    }
    public deleteFilter = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { filter_id } = req.params;
        try {
            await this.db.deleteFilter(filter_id);
            res.status(200).json({ status: true })
        } catch (error) {
            next(error);
        }    
    }
    public updateFilter = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { filter_id } = req.params;
        try {
            const filter:IFilterInput = convertFilterObjectToDb(req.body)
            await this.db.updateFilter(filter_id, filter);
            res.status(200).json({ status: true })
        } catch (error) {
            next(error);
        }    
    }
}

export default new FilterController();