import { Router } from "express";
import {
  registro,
  login,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  authMiddleware,
} from "../controllers/userController";

const router = Router();

// Rutas públicas
router.post("/register", registro);
router.post("/login", login);

// Rutas protegidas
router.get("/", authMiddleware, getUsuarios);
router.get("/:id", authMiddleware, getUsuarioById);
router.put("/:id", authMiddleware, updateUsuario);
router.delete("/:id", authMiddleware, deleteUsuario);

export default router;
