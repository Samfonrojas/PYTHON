
import { GoogleGenAI, Type } from "@google/genai";
import { Lesson, Difficulty, CodeEvaluation, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// FIX: Removed deprecated `model` variable. API calls will use `ai.models` directly.

const getLessonPrompt = (topic: string, difficulty: Difficulty, lang: 'es' | 'en'): string => {
  if (lang === 'es') {
    return `
      Crea una mini-lección de proyecto de Python sobre "${topic}" para un estudiante de nivel ${difficulty}.
      La lección debe tener un título claro, una explicación detallada del concepto, código de inicio para que el usuario lo complete y un objetivo específico y verificable para el ejercicio de codificación.
      La explicación debe estar en formato Markdown.

      **MUY IMPORTANTE**: Dentro de la explicación en Markdown, incluye una sección clara llamada '### Cómo ejecutar este código'.
      En esa sección, proporciona instrucciones sencillas sobre cómo ejecutar el script en un terminal real.
      - Si el script requiere alguna biblioteca externa (como 'requests' o 'numpy'), incluye el comando 'pip install' necesario.
      - Muestra el comando exacto para ejecutar el script, por ejemplo: \`python main.py\`.
      - Si el script es interactivo o acepta entradas del usuario, explica cómo interactuar con él en la terminal.

      El objetivo debe ser una instrucción clara, por ejemplo: "Completa la función para que devuelva la suma de dos números."
      Devuelve la respuesta como un objeto JSON con la siguiente estructura: { "title": "...", "explanation": "...", "starter_code": "...", "objective": "..." }.
    `;
  }
  return `
    Create a mini Python project lesson about "${topic}" for a ${difficulty} level learner.
    The lesson should have a clear title, a detailed explanation of the concept, some starter code for the user to complete, and a specific, verifiable objective for the coding exercise.
    The explanation should be in Markdown format.

    **VERY IMPORTANT**: Within the Markdown explanation, include a clear section called '### How to Run This Code'.
    In that section, provide simple instructions on how to run the script in a real terminal.
    - If the script requires any external libraries (like 'requests' or 'numpy'), include the necessary 'pip install' command.
    - Show the exact command to run the script, for example: \`python main.py\`.
    - If the script is interactive or takes user input, explain how to interact with it in the terminal.

    The objective should be a clear instruction, for example: "Complete the function so that it returns the sum of two numbers."
    Return the response as a JSON object with the following structure: { "title": "...", "explanation": "...", "starter_code": "...", "objective": "..." }.
  `;
};

export const generateLesson = async (topic: string, difficulty: Difficulty, lang: 'es' | 'en'): Promise<Lesson | null> => {
  const prompt = getLessonPrompt(topic, difficulty, lang);

  try {
    // FIX: Updated to use ai.models.generateContent and simplified the 'contents' property as per API guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    starter_code: { type: Type.STRING },
                    objective: { type: Type.STRING },
                },
                required: ["title", "explanation", "starter_code", "objective"]
            },
        },
    });
    
    const lessonText = response.text.trim();
    return JSON.parse(lessonText) as Lesson;
  } catch (error) {
    console.error("Error generating lesson:", error);
    return null;
  }
};

const getEvaluationPrompt = (objective: string, userCode: string, lang: 'es' | 'en'): string => {
  if (lang === 'es') {
    return `
      Como instructor de Python, evalúa el siguiente código enviado por el usuario.

      Objetivo: ${objective}
      Código del usuario:
      \`\`\`python
      ${userCode}
      \`\`\`

      Analiza el código basándote en el objetivo. Determina si logra correctamente el objetivo.
      Simula la ejecución del código y captura su salida. Si hay un error, captura el mensaje de error.
      Proporciona retroalimentación concisa y útil para el estudiante. Si el código es incorrecto, da una pista sobre cómo solucionarlo sin dar la solución directa.

      Devuelve la respuesta como un objeto JSON con la siguiente estructura: { "is_correct": boolean, "output": "...", "feedback": "..." }.
      El campo 'output' debe contener el stdout del código o un mensaje de error.
    `;
  }
  return `
    As a Python instructor, evaluate the following user-submitted Python code.

    Objective: ${objective}
    User's Code:
    \`\`\`python
    ${userCode}
    \`\`\`

    Analyze the code based on the objective. Determine if it correctly achieves the objective.
    Simulate the code execution and capture its output. If there's an error, capture the error message.
    Provide concise, helpful feedback for the learner. If the code is incorrect, give a hint on how to fix it without giving away the solution.

    Return the response as a JSON object with the following structure: { "is_correct": boolean, "output": "...", "feedback": "..." }.
    The 'output' field should contain the stdout of the code or an error message.
  `;
};


export const evaluateCode = async (objective: string, userCode: string, lang: 'es' | 'en'): Promise<CodeEvaluation | null> => {
  const prompt = getEvaluationPrompt(objective, userCode, lang);
  try {
    // FIX: Updated to use ai.models.generateContent and simplified the 'contents' property as per API guidelines.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    is_correct: { type: Type.BOOLEAN },
                    output: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                },
                required: ["is_correct", "output", "feedback"]
            },
        },
    });

    const evaluationText = response.text.trim();
    return JSON.parse(evaluationText) as CodeEvaluation;
  } catch (error) {
    console.error("Error evaluating code:", error);
    return null;
  }
};

const getChatSystemInstruction = (lang: 'es' | 'en') => {
    if (lang === 'es') {
        return "Eres un tutor de Python amigable y alentador. Ayuda a los usuarios con sus preguntas sobre Python, pero no des las respuestas directas a los ejercicios de codificación. Guíalos para que piensen por sí mismos.";
    }
    return "You are a friendly and encouraging Python tutor. Help users with their questions about Python, but don't give away the direct answers to the coding exercises. Guide them to think for themselves.";
}


export const getChatbotResponse = async (history: ChatMessage[], newMessage: string, lang: 'es' | 'en'): Promise<string> => {
    // FIX: Included chat history to maintain conversation context.
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
        config: {
            systemInstruction: getChatSystemInstruction(lang),
        },
    });

    try {
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        if (lang === 'es') {
            return "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde.";
        }
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
};
