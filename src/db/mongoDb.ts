import mongoose, { ConnectionOptions } from "mongoose";

class Database {
    protected URI:string = "mongodb+srv://garik1319:Ga$1319759@cluster0.cm8bk.mongodb.net/<dbname>?retryWrites=true&w=majority";
    protected URI2: string = "mongodb://127.0.0.1:27017" 

    public async connect() {
        try {
            await mongoose.connect(this.URI2, 
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