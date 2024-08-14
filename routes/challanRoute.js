import express from "express";
import {
  getChallan,
  createChallan,
  updateChallan,
  getAllChallan,
  deleteChallan,
  updatePaymentStatus,
} from "../controllers/challanController.js";
import { validateChallan } from "../middlewares/validateChallan.js";
import { hasToken } from "../middlewares/hasToken.js";

const challanRouter = express.Router();

challanRouter.post("/challan", hasToken, validateChallan, createChallan);
challanRouter.put("/challan/:id", hasToken, validateChallan, updateChallan);
challanRouter.get("/challan/:id", hasToken, getChallan);
// it takes perimeters, search, date, page and limit
challanRouter.get("/challan", hasToken, getAllChallan);
challanRouter.delete("/challan/:id", hasToken, deleteChallan);
challanRouter.patch("/challan/:id", hasToken, updatePaymentStatus);

export default challanRouter;
