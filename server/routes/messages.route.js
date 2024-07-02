import { Router } from "express";
import {
addMessage,
getAllMessage
} from "../controllers/messages.controller.js";

export const messageRoute =Router();
messageRoute.post("/addMessage", addMessage);
messageRoute.post("/getAllMessage", getAllMessage);
