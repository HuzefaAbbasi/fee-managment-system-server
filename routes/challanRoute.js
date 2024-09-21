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

challanRouter.get("/challan/data", getChallanData);
challanRouter.get("/challan/sum", getFieldsSum);
challanRouter.put("/challan/data", hasToken, adminAccess, updateChallanData);
challanRouter.post("/challan", validateChallan, createChallan);
challanRouter.put("/challan/:id", updateChallan);
challanRouter.get("/challan/:id", hasToken, getChallan);
// it takes perimeters, search, date, page and limit
challanRouter.get("/challan", getAllChallan);
challanRouter.delete("/challan/:id", hasToken, deleteChallan);
challanRouter.patch("/challan/:id", updatePaymentStatus);

export default challanRouter;
