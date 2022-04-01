var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/test").then(
  () => {
    console.log("Database is connected");
  },
  (err) => {
    console.log("Can not connect to the database" + err);
  }
);
