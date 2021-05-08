import { Request, Router, Response, NextFunction } from "express";
import * as countries from '../../data/countries.json'
import * as states from '../../data/states.json'
import * as cities from '../../data/cities.json'

class Location {
    private _router: Router = Router();
    get router () {
        return this._router;
    }
    constructor() {
        this._configure();
    }
    _configure() {
        this._router.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.json({ 
                countries: countries.country,
                states: states.country.states,
                cities: cities.country.cities
            })
        });
    }
}

export = new Location().router;