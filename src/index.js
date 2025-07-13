import app from "./app.js";
import connectionDb from "./config/db.js";

connectionDb()
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});