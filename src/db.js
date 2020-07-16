const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/admin?authSource=admin";
const options = {
    user: "root",
    pass: "admin",
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true
};
mongoose.connect(mongoURI, options);