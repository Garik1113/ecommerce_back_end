import mongoose from "mongoose";
const config = require('config');

class Database {
    protected URI: string = `mongodb://127.0.0.1:27017/${config.get("mongoDb").dbName}`

    public async connect() {
        try {
            await mongoose.connect(this.URI, 
                {   
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useFindAndModify: false
                },
                (error) => {
                    if(error) {
                        console.error(error.message);
                    } else {
                        console.log('Connected to database');
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    }

}

export = new Database()