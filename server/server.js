import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `file:${path.join(__dirname, 'prisma/dev.db')}`;
}

const allowedOrigins = ['https://amaurycelarier.netlify.app', 'http://localhost:5173'];

const app = express();
const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("✅ Connexion Prisma réussie"))
  .catch((error) => console.error("❌ Erreur connexion Prisma:", error));

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url} - Origin: ${req.headers.origin || 'Aucune'}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());


app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});

// Route pour récupérer les projets
app.get("/projects", async (req, res) => {
    console.log("Route /projects appelée");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Définie" : "Non définie");
  try {
    console.log("Tentative de connexion Prisma...");
    const projects = await prisma.project.findMany();
    console.log("✅ Projets récupérés:", projects.length, "projets");
    console.log("Projets:", JSON.stringify(projects, null, 2));
    res.json(projects);
  } catch (error) {
     console.error("❌ ERREUR dans /projects:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Stack complet:", error.stack);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des projets",
      message: error.message 
    });
  }
  console.log("=== FIN route /projects ===");
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

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Lancer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
});

