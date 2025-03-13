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

const dsaQuiz = async (level) => {
  const prompt = `Generate a multiple-choice DSA quiz question with four options. except LIFO, include any random topic (Basic Topics:
Arrays
Strings
Linked Lists
Stacks
Queues
Hashing
Recursion
Sorting Algorithms
Searching Algorithms
Intermediate Topics:
Binary Search
Two Pointers Technique
Sliding Window Technique
Bit Manipulation
Greedy Algorithms
Divide and Conquer
Backtracking
Dynamic Programming (DP Basics)
Graph Traversal (DFS & BFS)
Tree Traversal (Preorder, Inorder, Postorder)
Advanced Topics:
Graph Algorithms (Dijkstra, Floyd-Warshall, Bellman-Ford)
Topological Sorting
Spanning Trees (Prim’s & Kruskal’s Algorithm)
Disjoint Set (Union-Find)
Trie (Prefix Tree)
Segment Tree
Fenwick Tree (Binary Indexed Tree - BIT)
KMP Algorithm (Pattern Matching)
Rabin-Karp Algorithm (Pattern Matching)
String Hashing (Rolling Hash, Z-Algorithm)
Competitive Programming Topics:
Mo’s Algorithm
Heavy-Light Decomposition
Sqrt Decomposition
Centroid Decomposition
Game Theory
Matrix Exponentiation
Persistent Data Structures
Suffix Array & LCP
Number Theory (GCD, LCM, Modular Arithmetic)
Fast Exponentiation
Combinatorics (nCr, Permutations, Catalan Number))be unpridictiable and Ensure the question is clear and precise. The correct answer should be included explicitly cover all topics of DSA.
  
  return strictly a json like following

{
  "question": "Which sorting algorithm has the best average-case time complexity?",
  "options": ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"],
  "correctAnswer": "Merge Sort"
}

    `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

const memeAPI = async () => {
  const prompt = `Generate a short and funny joke or meme related to Data Structures and Algorithms (DSA). Keep it simple and easy to understand. Add emojis to make it more humorous. The joke should be programmer-friendly and relevant to DSA topics like recursion, sorting, stacks, queues, linked lists, graphs, or dynamic programming. Keep it under 2 sentences and dont use tags.`;
  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

const topicExplainAPI = async (topic) => {
  const prompt = `context - you are a dsa topic explainer who makes any topic easy by your funny teaching style and examples dont reveal about yourself, Prompt - explain ${topic} in as short as possible and simple use emojies as well, dont answer topics which are not related to dsa`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
};

module.exports = { explainTopic, dsaChallenge, dsaQuiz, memeAPI, topicExplainAPI };
