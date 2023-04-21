import express from "express";
import {
    getProducts,
    getProductById,
    saveProduct,
    updateProduct,
    deleteProduct
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:uuid", getProductById);
router.post("/", saveProduct);
router.patch("/:uuid", updateProduct);
router.delete("/:uuid", deleteProduct);

export default router;