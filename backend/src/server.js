require("dotenv").config();

const app = require("backend/src/app.js");
const connectDB = require("backend/src/config/db.js");

const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
