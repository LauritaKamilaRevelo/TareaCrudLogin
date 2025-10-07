import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes"; // Rutas de usuarios

// Cargar variables de entorno
dotenv.config();

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.connectDB();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  // Conexión a MongoDB
  private async connectDB(): Promise<void> {
    try {
      const mongoUri = process.env.MONGO_URI || "";
      if (!mongoUri) {
        throw new Error("MONGO_URI no está definido en el archivo .env");
      }
      await mongoose.connect(mongoUri);
      console.log("✅ Conectado a MongoDB");
    } catch (error) {
      console.error("❌ Error al conectar a MongoDB:", error);
      process.exit(1);
    }
  }

  // Middlewares
  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  // Rutas
  private setupRoutes(): void {
    // Health check
    this.app.get("/health", (req: Request, res: Response) => {
      res.json({
        success: true,
        message: "Backend funcionando correctamente",
        timestamp: new Date().toISOString(),
      });
    });

    // Rutas de usuarios (login, registro, etc.)
    this.app.use("/api/users", userRoutes);

    // 404 para rutas no encontradas
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: "Ruta no encontrada",
        path: req.path,
      });
    });
  }

  // Iniciar servidor
  public start(): void {
    const PORT = process.env.PORT || 5000;
    this.app.listen(PORT, () => {
      console.log("===========================================");
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log("===========================================");
    });
  }
}

// Crear e iniciar server
const server = new Server();
server.start();
