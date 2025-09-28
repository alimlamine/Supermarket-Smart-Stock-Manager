import { GoogleGenAI, Type } from "@google/genai";
import type { Visualization } from '../types';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    explanation: {
      type: Type.STRING,
      description: "A friendly, text-based explanation answering the user's question based on the data. Be concise and insightful."
    },
    visualization: {
      type: Type.OBJECT,
      description: "Data structured for visualization if the user's query is suitable for it. Should be null if a visualization is not applicable (e.g., for a greeting).",
      nullable: true,
      properties: {
        type: {
          type: Type.STRING,
          enum: ['bar', 'pie', 'line', 'table'],
          description: "The suggested type of visualization."
        },
        title: {
          type: Type.STRING,
          description: "A descriptive title for the visualization."
        },
        data: {
          type: Type.STRING,
          description: "A valid JSON string representing an array of data objects. Example: '[{\"category\":\"Dairy\",\"stock\":140},{\"category\":\"Produce\",\"stock\":150}]'. The keys inside the objects must match the 'key' values defined in the 'columns' property.",
        },
        columns: {
          type: Type.ARRAY,
          description: "Defines keys and labels for the data. For charts, the first column is typically the label (x-axis) and the second is the value (y-axis). For tables, these are the table headers.",
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING, description: "The key in the data objects." },
              label: { type: Type.STRING, description: "The display name for the column/key." }
            },
            required: ['key', 'label']
          }
        }
      }
    }
  },
  required: ['explanation']
};


export const analyzeProductData = async (
  csvData: string, 
  query: string, 
  language: string,
  apiKey: string
): Promise<{ explanation: string; visualization: Visualization | null }> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');
    const header = lines[0];
    const dataRows = lines.slice(1, 51); // Header + 50 rows of data
    const csvSample = [header, ...dataRows].join('\n');
    
    const prompt = `
      You are a world-class supermarket data analyst AI. Your task is to analyze the provided supermarket data in CSV format and answer the user's question.

      IMPORTANT: You MUST provide your entire response in the following language code: "${language}". This includes the 'explanation' and any text in the 'visualization' object (like 'title' and 'columns.label').

      RULES:
      1. Analyze the user's query and the provided CSV data sample. The column names are defined in the first line of the sample.
      2. Always provide a text-based 'explanation' that directly answers the user's question in the requested language.
      3. If the query can be represented visually (e.g., "show sales by category", "top 5 products by stock"), generate a 'visualization' object.
      4. If the query is a greeting, a question not related to the data, or doesn't make sense for a chart, the 'visualization' field MUST be null.
      5. For the 'visualization.data' field, you MUST provide a valid JSON string that represents an array of objects. The keys in these objects MUST match the 'key' values in your 'columns' definition.
      6. Base all your analysis SOLELY on the provided data sample. Do not make up information.
      7. Keep explanations concise and to the point.

      Here is a sample of the user's CSV data:
      ---
      ${csvSample}
      ---

      User's Question: "${query}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result.visualization && typeof result.visualization.data === 'string') {
        try {
            result.visualization.data = JSON.parse(result.visualization.data);
        } catch (e) {
            console.error("Failed to parse visualization data string:", e);
            result.visualization = null;
        }
    }

    return {
      explanation: result.explanation,
      visualization: result.visualization || null
    };

  } catch (error) {
    console.error("Error analyzing data with Gemini:", error);
    
    if (error instanceof Error) {
      const lowerCaseErrorMessage = error.message.toLowerCase();
      if (lowerCaseErrorMessage.includes('api key') || lowerCaseErrorMessage.includes('permission denied') || lowerCaseErrorMessage.includes('authentication')) {
          const displayMessage = `Authentication failed. The API key you provided appears to be invalid.

Please refer to the setup checklist for help. Common issues include:
• An incorrect or incomplete API Key.
• Billing not enabled for the associated Google Cloud project.
• The "Generative Language API" has not been enabled for the project.`;
          throw new AuthenticationError(displayMessage);
      }
    }
    
    throw error;
  }
};