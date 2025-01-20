const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/lotteryDB", { useNewUrlParser: true, useUnifiedTopology: true });

const entrySchema = new mongoose.Schema({
    name: String,
    email: String,
    lotteryNumber: Number
});

const Entry = mongoose.model("Entry", entrySchema);

async function generateUniqueNumber() {
    let isUnique = false;
    let lotteryNumber;

    while (!isUnique) {
        lotteryNumber = Math.floor(100000 + Math.random() * 900000);
        const exists = await Entry.exists({ lotteryNumber });
        isUnique = !exists;
    }
    return lotteryNumber;
}

app.post("/submit", async (req, res) => {
    const { name, email } = req.body;
    const lotteryNumber = await generateUniqueNumber();

    const newEntry = new Entry({ name, email, lotteryNumber });
    await newEntry.save();

    res.json({ message: "Success!", lotteryNumber });
});

app.listen(5000, () => console.log("Server running on port 5000"));
