import {  FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const GetDocumentFunctionSchema: FunctionDeclaration = {
  name: "GetUserDocumentsForPersonalizedSupport",
  description: `
  You have to call this whenever you need to retrieve the user's documents to provide personalized support. This function will return the user's documents that were saved in the past.
`,
};


export const CreateDocumentFunctionSchema: FunctionDeclaration = {
  name: "SaveUserDocumentForFutureInteractions",
  description: `
  You have to call this whenever critical details about their mental health, emotions, or experiences are shared. This context should help you provide better, more personalized support in future interactions.

Whenever the user shares significant information, such as:

his name, his personality traits, his emotional state, his symptoms, his coping mechanisms, or his past events
  `,
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      content: {
        type: SchemaType.STRING,
        description: "this is the content of the document to be saved which will be used to provide better support in future interactions",
      },
    }
  }
}
