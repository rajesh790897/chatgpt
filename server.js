const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt: userMessage,
                max_tokens: 50,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const botMessage = response.data.choices[0].text.trim();
        res.json({ reply: botMessage });
    } catch (error) {
        console.error("Error communicating with OpenAI API:", error);
        res.status(500).json({ reply: "Sorry, something went wrong." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
