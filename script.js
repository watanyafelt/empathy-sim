const chatBox = document.getElementById("chat");
const inputBox = document.getElementById("agent-input");
const sendBtn = document.getElementById("send-btn");
const scenarioDropdown = document.getElementById("scenario");
const startBtn = document.getElementById("start-btn");

let scenario = "";
let history = [];

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("msg", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendToAI(agentMessage) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            scenario,
            history,
            agent: agentMessage
        })
    });
    return await response.json();
}

sendBtn.addEventListener("click", async () => {
    const text = inputBox.value.trim();
    if (!text) return;

    addMessage(text, "agent");
    history.push({ role: "agent", content: text });

    inputBox.value = "";

    const ai = await sendToAI(text);

    addMessage(ai.reply, "user");
    history.push({ role: "user", content: ai.reply });
});

startBtn.addEventListener("click", () => {
    scenario = scenarioDropdown.value;
    history = [];

    document.getElementById("scenario-select").classList.add("hidden");
    chatBox.classList.remove("hidden");
    document.getElementById("input-area").classList.remove("hidden");

    let intro = "";

    if (scenario === "loss") intro = "Hi… I'm dealing with a recent loss, and I'm just trying to hold things together right now.";
    if (scenario === "leave") intro = "Hi, I'm planning to take leave soon… and honestly, I feel a bit overwhelmed by everything I need to figure out.";
    if (scenario === "return") intro = "Hi, I'm coming back from leave soon, and I'm pretty anxious about how it's all going to go.";

    addMessage(intro, "user");
    history.push({ role: "user", content: intro });
});
