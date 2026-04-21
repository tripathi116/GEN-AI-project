const { GoogleGenAI } = require("@google/genai")
const { JsonWebTokenError } = require("jsonwebtoken")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({

    matchScore: z.number().describe("A number between 0 and 100 that indicates how well the candidate's resume and self-describe match the job describe."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking the technical question"),
        answer: z.string().describe("How to answer this question,what points to cover , what approach to take ,etc, ")
    })).describe("A list of technical questions that can be asked in the interview along with the intention behind asking those questions and how to answer them"),
    
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking the behavioral question"),
        answer: z.string().describe("How to answer this question,what points to cover , what approach to take ,etc, ")
    })).describe("A list of behavioral questions that can be asked in the interview along with the intention behind asking those questions and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking based on the resume and job describe analysis"),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity of the skill gap, whether it's a minor gap or a major gap that needs to be addressed")
    })).describe("A list of skill gaps that the candidate has based on the analysis of the resume and job describe, along with the severity of each skill gap"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of the preparation for that day, such as a specific topic or skill to work on"),
        tasks: z.array(z.string()).describe("A list of tasks to be completed on that day to prepare for the interview, such as studying a specific concept, practicing coding problems, etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively, based on the analysis of the resume and job describe"),
    title: z.string().describe("The title for the job for which the interview report is generated")
}) 


async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    
    const prompt = `Generate an interview preparation report for a candidate based on the following information:
    Resume:${resume}
    Self Description: ${selfDescription}
    Job Description:${jobDescription}`

    
    const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
                matchScore: { type: "number" },
                technicalQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: { type: "string" },
                            intention: { type: "string" },
                            answer: { type: "string" }
                        },
                        required: ["question", "intention", "answer"]
                    }
                },
                behavioralQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question: { type: "string" },
                            intention: { type: "string" },
                            answer: { type: "string" }
                        },
                        required: ["question", "intention", "answer"]
                    }
                },
                skillGaps: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            skill: { type: "string" },
                            severity: {
                                type: "string",
                                enum: ["low", "medium", "high"]
                            }
                        },
                        required: ["skill", "severity"]
                    }
                },
                preparationPlan: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            day: { type: "number" },
                            focus: { type: "string" },
                            tasks: {
                                type: "array",
                                items: { type: "string" }
                            }
                        },
                        required: ["day", "focus", "tasks"]
                    }
                }
            },
            required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
        }
    }
})

    const parsed = JSON.parse(response.text)
    return parsed
}

module.exports = { generateInterviewReport }