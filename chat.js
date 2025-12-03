export default async function handler(req, res) {
    const { scenario, history, agent } = req.body;

    const systemPrompt = `
You are simulating a real human user talking to an empathy support agent.
Your emotional state depends on the scenario:

LOSS:
- You're grieving.
- You’re overwhelmed, vulnerable, and easily flooded by robotic answers.
- You respond well to warmth, validation, gentle pacing.

LEAVE:
- You're confused and nervous about taking leave.
- You need clarity and reassurance.
- Too much info at once overwhelms you.

RETURN:
- You're anxious about coming back from leave.
- You need emotional acknowledgment before any practical details.

General Rules:
- Respond like a real person.
- 1–3 sentences max.
- React directly to what the agent says.
- Show emotion: hesitation, relief, gratitude, frustration, confusion.
- Ask follow-up questions naturally.
- Do NOT sound like HR or an AI.
- Your job is to be the *human user*, not the helper.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4.1-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...history.map(m => ({
                    role: m.role === "agent" ? "assistant" : "user",
                    content: m.content
                })),
                { role: "assistant", content: agent }
            ],
            temperature: 0.85
        })
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I’m having trouble responding right now.";

    res.status(200).json({ reply });
}
