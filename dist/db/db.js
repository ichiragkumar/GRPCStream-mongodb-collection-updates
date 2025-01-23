"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error("Please set the MONGODB_URI environment variable");
        }
        await mongoose_1.default.connect(MONGODB_URI, {});
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Failed to connect to MongoDB", error);
    }
};
exports.connectDB = connectDB;
