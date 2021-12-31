const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        try {
            mongoose.connect(DB_HOST, 
                {
                    useNewUrlParser: true, 
                } 
            );
            mongoose.connection.on('error', error => {
                console.log(`MongoDB connection error: ${error}`);
                process.exit();
            });
        }
        catch (error) {
            console.log(error.message);
            process.exit();
        }
    },
    close: () => {
        mongoose.connection.close();
    }
};