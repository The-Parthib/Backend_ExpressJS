// USED to start the server

import app from "./src/app.js";
import connectDB from "./src/db/MongoDb.js";
const PORT = 8000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});