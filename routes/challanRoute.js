import express from "express";
import {
  getChallan,
  createChallan,
  updateChallan,
  getAllChallan,
  deleteChallan,
  updatePaymentStatus,
  updateChallanData,
  getChallanData,
  getFieldsSum,
} from "../controllers/challanController.js";
import { adminAccess } from "../middlewares/isAuthorized.js";
import { validateChallan } from "../middlewares/validateChallan.js";
import { hasToken } from "../middlewares/hasToken.js";

const challanRouter = express.Router();

challanRouter.get("/challan/data", hasToken, getChallanData);
challanRouter.get("/challan/sum", hasToken, adminAccess, getFieldsSum);
challanRouter.put("/challan/data", hasToken, adminAccess, updateChallanData);
challanRouter.post("/challan", hasToken, validateChallan, createChallan);
challanRouter.put("/challan/:id", hasToken, updateChallan);
challanRouter.get("/challan/:id", hasToken, getChallan);
// it takes perimeters, search, date, page and limit
challanRouter.get("/challan", hasToken, getAllChallan);
challanRouter.delete("/challan/:id", hasToken, deleteChallan);
challanRouter.patch("/challan/:id", hasToken, updatePaymentStatus);

export default challanRouter;
