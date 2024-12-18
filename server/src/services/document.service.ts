import { Types } from "mongoose";
import {Document} from "../models/document.model"

export const getDocuments = async (userId: string) => {
    return await Document.find({ user: userId });
}

export const createDocument = async (userId: string, content: string) => {
    return await Document.create({
        content,
        user: userId,
    });
}

export const deleteDocument = async (userId: Types.ObjectId, documentId: Types.ObjectId) => {
    return await Document.deleteOne({ user: userId, _id: documentId });
}