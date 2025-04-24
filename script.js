let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let btn = document.querySelector("#btn");
let ChatContainer = document.querySelector(".chat-container");
let userMessage = null;
let messageHistory = [];
let Api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCD4j6Jt1Fqbb59UhTvWhiKh6CkGah0Hek';

function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatBox) {
    try {
        let fixedResponses = {
            "hi": "Hi there! 🌾 How can I help you with crop planning?",
            "hello": "Hello! 👋 I'm here to assist with your farm-related questions. How can I support you today?"
        };

        if (fixedResponses[userMessage.toLowerCase()]) {
            aiChatBox.querySelector(".text").innerText = fixedResponses[userMessage.toLowerCase()];
            aiChatBox.querySelector(".loading").remove();
            return;
        }

        let response = await fetch(Api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userMessage }]
                    },
                    {
                        role: "model",
                        parts: [{
                            text: `
Hello! 🌾 I’m your Crop Planner Assistant. I can help you with:

1. 📅 Crop Planning – Choose the right crops for your region and season.
2. 🌱 Growth Stages – Track and understand crop development stages.
3. 📈 Yield Optimization – Tips on soil health, irrigation, and fertilizers.
4. 🌦️ Weather Insights – Real-time forecasts and alerts for your farm.
5. 🧑‍🌾 Daily Task Guidance – What to do today on the field.
6. 🤖 Smart Suggestions – Based on your land, history, and climate.
7.use proper emogis and remove all the asterisks in the reply.
8. 🌍 Sustainable Practices – Eco-friendly farming tips.


Just ask me anything related to farming or crop management!

For example:
- “What crops should I plant this season?”
- “How can I improve my soil health?”
- “What’s the weather forecast for my area?”

Let’s get started! 🌱🌞

NOTE: Please only ask crop planning and farming related questions. I am strictly a crop planning assistant and cannot answer unrelated queries.
                            `.trim()
                        }]
                    },
                    ...(messageHistory.length > 20 ? messageHistory.slice(-20) : messageHistory)
                ]
            })
        });
        let data = await response.json();
        console.log(data);
        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response, please tell me your query more clearly.";
        aiChatBox.querySelector(".text").innerText = textResponse;
        aiChatBox.querySelector(".loading").remove();

        messageHistory.push({
            role: "model",
            parts: [{ text: textResponse }]
        });
    } catch (error) {
        console.log(error);
        aiChatBox.querySelector(".text").innerText = "Something went wrong.";
        aiChatBox.querySelector(".loading").remove();
    }
}

function showLoading() {
    let html = `
        <div class="img2">
            <img src="doctor.png" alt="" width="26">
        </div>
        <p class="text"></p>
        <img class="loading" src="tractor-1972_256.gif" alt="loading" width="70px" height="70px" style="border-radius:50%">
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    ChatContainer.appendChild(aiChatBox);
    getApiResponse(aiChatBox);
}

btn.addEventListener("click", () => {
    userMessage = prompt.value;
    if (userMessage == "") {
        container.style.display = "flex";
    } else {
        container.style.display = "none";

        messageHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        let html = `
            <div class="img">
                <img src="user.png" alt="" width="40" height="40">
            </div>
            <p class="text"></p>
        `;
        let userChatBox = createChatBox(html, "user-chat-box");
        userChatBox.querySelector(".text").innerText = userMessage;
        ChatContainer.appendChild(userChatBox);
        prompt.value = "";
        setTimeout(showLoading, 500);
    }
});

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        btn.click();
    }
});
