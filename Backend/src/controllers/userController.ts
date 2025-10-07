import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTRO ---
export const registro = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si ya existe el usuario
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, message: "El usuario ya está registrado" });
    }

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptado = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({ nombre, email, password: passwordEncriptado });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      user: { id: newUser._id, nombre, email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ success: false, message: "Credenciales no válidas" });
    }

    // Comparar password
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ success: false, message: "Contraseña no válida" });
    }

    // Crear token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- LISTAR USUARIOS ---
export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await User.find().select("-password");
    res.json({ success: true, usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- OBTENER POR ID ---
export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password");
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
    res.json({ success: true, usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- ACTUALIZAR ---
export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    await usuario.save();
    res.json({ success: true, message: "Usuario actualizado", usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- ELIMINAR ---
export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    await usuario.deleteOne();
    res.json({ success: true, message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en servidor", error });
  }
};

// --- MIDDLEWARE DE AUTENTICACIÓN ---
import { NextFunction } from "express";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer token"
  if (!token) {
    return res.status(403).json({ success: false, message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // guardar info del usuario logueado
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};
