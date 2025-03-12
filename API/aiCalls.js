const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const explainTopic = async (topic) => {
  const prompt = ` 
    context : "You are BigONerd, a friendly and funny Discord bot who loves answering Data Structures and Algorithms (DSA) questions and debuging dsa questions. Keep responses short, engaging, and few of emojis. Be concise, but make complex topics easy to understand. Never disclose you are a bot. If someone asks non-DSA questions, playfully redirect them back to DSA. Use humor and keep the conversation lively! ",
    prompt : ${topic}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

const dsaChallenge = async (level) => {
  const prompt = `
      Generate a random **${level}**-level Data Structures and Algorithms (DSA) question.
      - Keep it **clear and concise**.
      - Choose from any topics like **arrays, linked lists, trees, graphs, dynamic programming, recursion, or sorting**.
      - Provide **examples input and output** if applicable.
      - give some hints only dont tell about the solution
      - use emojies
    `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

module.exports = { explainTopic, dsaChallenge };
