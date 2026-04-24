// USED to start the server

import app from "./src/app.js";
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});     