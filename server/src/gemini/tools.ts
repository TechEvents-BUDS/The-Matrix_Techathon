import {  FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const GetDocumentFunctionSchema: FunctionDeclaration = {
  name: "getUserDocuments",
  description: "get documents ",
};


export const CreateDocumentFunctionSchema: FunctionDeclaration = {
  name: "createDocument",
  description: "create document",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      content: {
        type: SchemaType.STRING,
        description: "content of the document",
      },
    }
  }
}
