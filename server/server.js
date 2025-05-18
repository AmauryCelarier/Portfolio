import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

process.env.DATABASE_URL = `file:${path.join('/var/data', 'dev.db')}`;

const allowedOrigins = ['https://amaurycelarier.netlify.app/', 'http://localhost:5173'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Route pour récupérer les projets
app.get("/projects", async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des projets" });
  }
});

app.post("/projects/reset", async (req, res) => {
    try {
        await prisma.project.deleteMany();

        res.json({ message: "Projets réinitialisés avec succès." });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation", error);
        res.status(500).json({ error: "Erreur lors de la réinitialisation" });
    }
});

// API pour récupérer un projet par son ID
app.get("/api/project/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
      const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
              images: true,
              paragraphs: true,
              skills: {
                  include: { skill: true }
              }
          }
      });

      if (!project) {
          return res.status(404).json({ error: "Projet non trouvé" });
      }

      res.json(project);
  } catch (error) {
      console.error("Erreur API :", error);
      res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Lancer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

