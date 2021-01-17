import mongoose, { ConnectionOptions } from "mongoose";

class Database {
    protected URI:string = "mongodb+srv://garik1319:Ga$1319759@cluster0.cm8bk.mongodb.net/<dbname>?retryWrites=true&w=majority";

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