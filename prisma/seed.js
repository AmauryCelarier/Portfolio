import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Début du seeding...");
    console.log("Réinitialisation des projets...");

   // Supprime toutes les entrées
   await prisma.image.deleteMany();
   await prisma.paragraph.deleteMany();
   await prisma.projectSkill.deleteMany();
   await prisma.skill.deleteMany();
   await prisma.project.deleteMany();

    // Création des compétences
    const skills = await prisma.$transaction([
        prisma.skill.create({ data: { name: "Créativité", type: "SOFT" } }),                            // Créativité [0]               { skill: { connect: { id: skills[0].id } } }, // Créativité         
        prisma.skill.create({ data: { name: "Autonomie", type: "SOFT" } }),                             // Autonomie [1]                { skill: { connect: { id: skills[1].id } } }, // Autonomie
        prisma.skill.create({ data: { name: "Minutie", type: "SOFT" } }),                               // Minutie [2]                  { skill: { connect: { id: skills[2].id } } }, // Minutie
        prisma.skill.create({ data: { name: "Modélisation 3D", type: "TECHNICAL" } }),                  // Modélisation 3D [3]          { skill: { connect: { id: skills[3].id } } }, // Modélisation 3D
        prisma.skill.create({ data: { name: "Texturing", type: "TECHNICAL" } }),                        // Texturing [4]                { skill: { connect: { id: skills[4].id } } }, // Texturing
        prisma.skill.create({ data: { name: "Eclairage", type: "TECHNICAL" } }),                        // Eclairage [5]                { skill: { connect: { id: skills[5].id } } }, // Eclairage
        prisma.skill.create({ data: { name: "Composition visuelle", type: "TECHNICAL" } }),             // Composition visuelle [6]     { skill: { connect: { id: skills[6].id } } }, // Composition visuelle
        prisma.skill.create({ data: { name: "Optimisation 3D", type: "TECHNICAL" } }),                  // Optimisation 3D [7]          { skill: { connect: { id: skills[7].id } } }, // Optimisation 3D
        prisma.skill.create({ data: { name: "Travail en équipe", type: "SOFT" } }),                     // Travail en équipe [8]        { skill: { connect: { id: skills[8].id } } }, // Travail en équipe
        prisma.skill.create({ data: { name: "Communication", type: "SOFT" } }),                         // Communication [9]            { skill: { connect: { id: skills[9].id } } }, // Communication
        prisma.skill.create({ data: { name: "Résolution de problème", type: "SOFT" } }),                // Résolution de problème [10]  { skill: { connect: { id: skills[10].id } } }, // Résolution de problème
        prisma.skill.create({ data: { name: "Animation 3D", type: "TECHNICAL" } }),                     // Animation 3D [11]            { skill: { connect: { id: skills[11].id } } }, // Animation 3D
        prisma.skill.create({ data: { name: "Motion Capture", type: "TECHNICAL" } }),                   // Motion Capture [12]          { skill: { connect: { id: skills[12].id } } }, // Motion Capture
        prisma.skill.create({ data: { name: "Unreal Engine 5", type: "TECHNICAL" } }),                  // Unreal Engine 5 [13]         { skill: { connect: { id: skills[13].id } } }, // Unreal Engine 5
        prisma.skill.create({ data: { name: "Design de gameplay", type: "TECHNICAL" } }),               // Design de gameplay [14]      { skill: { connect: { id: skills[14].id } } }, // Design de gameplay
        prisma.skill.create({ data: { name: "Accessibilité", type: "TECHNICAL" } }),                    // Accessibilité [15]           { skill: { connect: { id: skills[15].id } } }, // Accessibilité
        prisma.skill.create({ data: { name: "Unwrap Editing", type: "TECHNICAL" } }),                   // Unwrap Editing [16]          { skill: { connect: { id: skills[16].id } } }, // Unwrap Editing
        prisma.skill.create({ data: { name: "Rigueur", type: "SOFT" } }),                               // Rigueur [17]                 { skill: { connect: { id: skills[17].id } } }, // Rigueur
        prisma.skill.create({ data: { name: "Développement web", type: "TECHNICAL" } }),                // Développement web [18]       { skill: { connect: { id: skills[18].id } } }, // Développement web
        prisma.skill.create({ data: { name: "Templating", type: "TECHNICAL" } }),                       // Templating [19]              { skill: { connect: { id: skills[19].id } } }, // Templating
        prisma.skill.create({ data: { name: "ORM", type: "TECHNICAL" } }),                              // ORM [20]                     { skill: { connect: { id: skills[20].id } } }, // ORM
        prisma.skill.create({ data: { name: "Base de donnée", type: "TECHNICAL" } }),                   // Base de donnée [21]          { skill: { connect: { id: skills[21].id } } }, // Base de donnée
        prisma.skill.create({ data: { name: "CRUD", type: "TECHNICAL" } }),                             // CRUD [22]                    { skill: { connect: { id: skills[22].id } } }, // CRUD
        prisma.skill.create({ data: { name: "Leadership", type: "SOFT" } }),                            // Leadership [23]              { skill: { connect: { id: skills[23].id } } }, // Leadership
        prisma.skill.create({ data: { name: "Gestion d'équipe", type: "SOFT" } }),                      // Gestion d'équipe [24]        { skill: { connect: { id: skills[24].id } } }, // Gestion d'équipe
        prisma.skill.create({ data: { name: "Esprit critique", type: "SOFT" } }),                       // Esprit critique [25]         { skill: { connect: { id: skills[25].id } } }, // Esprit critique
        prisma.skill.create({ data: { name: "Planification de projet", type: "SOFT" } }),               // Planification de projet [26] { skill: { connect: { id: skills[26].id } } }, // Planification de projet
        prisma.skill.create({ data: { name: "Eco-conception", type: "TECHNICAL" } }),                   // Eco-conception [27]          { skill: { connect: { id: skills[27].id } } }, // Eco-conception

    ]);

    console.log("Compétences créées avec succès !");

    // Création d'un projet avec plusieurs images, paragraphes et compétences

    // Création CyberPunk City Wallpaper
    const project_01 = await prisma.project.create({
        data: {
            title: "CyberPunk City Wallpaper",
            description: "Un wallpaper 3D en style cyberpunk réalisé sur Blender. Ce projet personnel m’a permis d’explorer la composition, l’éclairage, le texturing et la modélisation 3D tout en créant une scène immersive et détaillée.",
            link: "https://github.com/AmauryCelarier",
            createdAt: new Date("2024-10-01"),
            duration: 14, 
            images: {
                create: [
                    { path: "images/CyberPunkCityWallPaper/CyberPunkCityWallPaper_01.png" },
                    { path: "images/CyberPunkCityWallPaper/CyberPunkCityWallPaper_02.png" },
                ],
            },
            paragraphs: {
                create: [
                    { content: "J’ai toujours été attiré par l’esthétique cyberpunk : ses jeux de lumière, ses ambiances futuristes et ses environnements urbains denses. En créant ce fond d’écran, mon objectif était de me donner un défi technique et artistique. Ce projet a aussi été l’occasion de me faire un fond d’écran personnalisé qui me correspond. De plus, ce travail m’a servi d’entraînement pour une map développée sur PLSA, où j’ai appliqué les mêmes principes d’environnement design." },
                    { content: "J’ai réalisé toute la modélisation sur Blender, en construisant les bâtiments et les structures en jouant sur les formes et les hauteurs pour donner de la profondeur à la scène. Pour le texturing, j’ai utilisé Adobe Substance 3D Painter, ce qui m’a permis d’ajouter des détails réalistes comme des surfaces usées et des reflets sur les matériaux métalliques, ou encore rendre la route humide. L’éclairage était un élément essentiel pour créer une ambiance cyberpunk futuriste. J’ai utilisé des spots d’éclairages ou des points lumineux pour représenter des néons artificiels ou tout simplement des lumières d’immeuble. J’ai également ajouté une légère brume pour donner un effet de profondeur et rendre l’atmosphère plus immersive." },
                    { content: "L’un des plus grands défis a été d’optimiser la scène pour qu’elle reste fluide tout en ayant un rendu détaillé. J’ai dû ajuster les lumières et les textures, mais également, fait en sorte que la plupart des objets soient en low poly, afin d’éviter de surcharger les calcul de rendu. Un autre point important a été l’équilibre visuel : trop d’éléments pouvaient rendre la scène illisible, j’ai donc travaillé la composition pour que l’œil du spectateur soit guidé naturellement à travers l’image." },
                    { content: "Ce projet m’a permis d’améliorer ma modélisation 3D, mon texturing et ma gestion de l’éclairage. Il m’a aussi aidé à développer mon sens du détail et à mieux organiser une scène complexe. Enfin, les compétences acquises ici m’ont été utiles pour d’autres projets, notamment dans la création d’environnements pour des map sur PLSA." },
                ],
            },
            skills: {
                create: [
                    { skill: { connect: { id: skills[0].id } } }, // Créativité
                    { skill: { connect: { id: skills[1].id } } }, // Autonomie
                    { skill: { connect: { id: skills[2].id } } }, // Minutie
                    { skill: { connect: { id: skills[3].id } } }, // Modélisation 3D
                    { skill: { connect: { id: skills[16].id } } }, // Unwrap Editing
                    { skill: { connect: { id: skills[4].id } } }, // Texturing
                    { skill: { connect: { id: skills[5].id } } }, // Eclairage
                    { skill: { connect: { id: skills[6].id } } }, // Composition visuelle
                    { skill: { connect: { id: skills[7].id } } }, // Optimisation 3D
                ],
            },
        },
    });

    console.log(`Projet "${project_01.title}" créé avec succès !`);

    // Création PLSA - Project Legion : Story of Amalthéis
    const project_02 = await prisma.project.create({
        data: {
            title: "PLSA - Project Legion : Story of Amalthéis",
            description: "PLSA est un jeu de combat de plateforme stratégique où réflexes et réflexion sont vos meilleures armes. Affrontez des adversaires redoutables dans des arènes dynamiques, amassez des ressources pour acheter des objets qui amélioreront vos statistiques, et adaptez votre style de jeu en fonction de vos opposants et des objets disponibles.",
            link: "https://github.com/AmauryCelarier",
            createdAt: new Date("2024-11-01"),
            duration: 120, 
            model3D: "model_3D/PLSA.glb",
            images: {
                create: [
                    { path: "images/PLSA/PLSA_01.png" },
                    { path: "images/PLSA/PLSA_02.png" },
                    { path: "images/PLSA/PLSA_03.png" },
                    { path: "images/PLSA/PLSA_04.png" },
                    { path: "images/PLSA/PLSA_05.png" },
                    { path: "images/PLSA/PLSA_06.png" },
                    { path: "images/PLSA/PLSA_07.png" },
                ],
            },
            paragraphs: {
                create: [
                    { content: "Les jeux de type Brawler, bien que populaires et ancrés dans l’histoire du jeu vidéo, peinent aujourd’hui à se renouveler. Le gameplay se limite souvent à des affrontements répétitifs, sans réelle profondeur stratégique ni engagement sur des thématiques modernes. L’idée de PL:SA est née de cette constatation : créer un Brawler qui ne soit pas qu’un jeu d’action, mais une expérience hybride, croisant les codes du Brawler et ceux du MOBA, tout en intégrant des valeurs d’innovation, d’écoresponsabilité et d’accessibilité." },
                    { content: "Mon implication dans PL:SA a couvert un large éventail de domaines techniques et artistiques. J’ai pris en charge une grande partie de la modélisation 3D des personnages et environnements, en m’assurant que chaque asset soit optimisé, afin de réduire la charge GPU sans nuire à l’esthétique globale du jeu. Le design des arènes et des combattants a été pensé pour être à la fois stylisé, lisible et fonctionnel dans un contexte compétitif. En parallèle, j’ai travaillé sur le texturing via Substance 3D Painter, ce qui m’a permis d’ajouter des détails visuels subtils, des matériaux cohérents, et des effets de surface adaptés à notre direction artistique. J’ai également géré l’éclairage dans Unreal Engine, en jouant sur les contrastes, les sources lumineuses dynamiques et les ambiances colorées pour donner du cachet aux différentes maps. Sur le plan du gameplay, j’ai programmé des mécaniques en C++ et en Blueprints, en particulier les interactions entre les joueurs, les effets visuels liés aux attaques, ou encore les interactions des joueurs avec l’environnement. J’ai aussi contribué à l’intégration de la motion capture pour rendre les animations plus fluides et naturelles, ce qui a grandement amélioré l’immersion du jeu." },
                    { content: "Un des principaux défis a été l’optimisation des ressources : malgré une scène complexe, nous avons réussi à obtenir un jeu fluide en optimisant les modèles et textures, réduisant leur taille sans perdre en qualité visuelle. Un autre enjeu majeur fut l’accessibilité : nous avons intégré des contrastes visuels, des contrôles adaptables et une interface claire dès la conception, pour que le jeu soit accessible à tous types de joueurs." },
                    { content: "Ce projet m’a permis de consolider mes compétences en modélisation 3D, programmation de gameplay, optimisation, mais aussi en travail d’équipe et en gestion de projet agile. Il représente un tournant dans ma manière d’aborder le game design en tenant compte d’enjeux actuels comme l’éco-conception et l’inclusivité. Il m’a également préparé à des projets plus complexes dans le domaine du jeu vidéo." },
                ],
            },
            skills: {
                create: [
                    { skill: { connect: { id: skills[0].id } } }, // Créativité
                    { skill: { connect: { id: skills[1].id } } }, // Autonomie
                    { skill: { connect: { id: skills[3].id } } }, // Modélisation 3D
                    { skill: { connect: { id: skills[16].id } } }, // Unwrap Editing
                    { skill: { connect: { id: skills[4].id } } }, // Texturing
                    { skill: { connect: { id: skills[5].id } } }, // Eclairage
                    { skill: { connect: { id: skills[7].id } } }, // Optimisation 3D
                    { skill: { connect: { id: skills[9].id } } }, // Communication
                    { skill: { connect: { id: skills[10].id } } }, // Résolution de problème
                    { skill: { connect: { id: skills[11].id } } }, // Animation
                    { skill: { connect: { id: skills[12].id } } }, // Motion Capture
                    { skill: { connect: { id: skills[13].id } } }, // Unreal Engine 5
                    { skill: { connect: { id: skills[14].id } } }, // Design de gameplay
                    { skill: { connect: { id: skills[15].id } } }, // Accessibilité
                    
                ],
            },
        },
    });

    console.log(`Projet "${project_02.title}" créé avec succès !`);

    // Création Vapeur
    const project_03 = await prisma.project.create({
        data: {
            title: "Vapeur - Site de gestion de jeux vidéo",
            description: "Vapeur est une application web dynamique de gestion de collection de jeux vidéo, développée en équipe avec Express.js, SQLite et Prisma. Ce projet nous a permis d’explorer les bases du développement web full-stack, avec un focus sur la structuration de base de données relationnelles, les routes REST et le rendu de pages dynamiques via Handlebars.",
            link: "https://github.com/AmauryCelarier/Vapeur",
            createdAt: new Date("2024-12-01"),
            duration: 14, 
            images: {
                create: [
                    { path: "images/Vapeur/Vapeur_01.png" },
                    { path: "images/Vapeur/Vapeur_02.png" },
                    { path: "images/Vapeur/Vapeur_03.png" },
                ],
            },
            paragraphs: {
                create: [
                    { content: "Le but de ce projet était de concevoir une application complète et fonctionnelle permettant de gérer une collection de jeux vidéo. Nous avons abordé ce projet comme une opportunité de nous familiariser avec les frameworks web modernes tout en appliquant des bonnes pratiques de développement. L’idée était de créer une sorte de “mini Steam” pédagogique, où l’on pourrait consulter, ajouter, modifier et supprimer des jeux, des éditeurs et des genres." },
                    { content: "Nous avons utilisé Express.js comme moteur principal de notre application, avec Handlebars (HBS) pour générer les vues côté serveur. Prisma a été utilisé pour la gestion de la base de données SQLite, nous permettant de manipuler facilement les relations entre jeux, éditeurs et genres. J’ai personnellement contribué à  la conception de la base de données via Prisma, à l’implémentation des routes principales (CRUD pour jeux, genres et éditeurs), au templating des pages dynamiques, et à l’ajout de fonctionnalités bonus comme l’intégration d’images de jeux et la mise en avant des jeux sur la page d’accueil." },
                    { content: "Un des défis majeurs fut la gestion des relations entre entités (jeu ↔ éditeur ↔ genre), notamment pour les routes de détail et de modification. Pour y répondre, nous avons structuré les appels Prisma de façon claire et optimisé les requêtes pour obtenir les données associées dans une seule opération. Un autre point abordé à été la cohérence du design, que nous avons progressivement améliorée en CSS tout en conservant un layout épuré et lisible. Enfin, il a fallu veiller à la clarté du code pour être capable de le comprendre et l’expliquer, y compris les parties non réalisées directement." },
                    { content: "Ce projet a été une excellente introduction au développement web dynamique. Il m’a permis de mieux comprendre la logique des applications REST, de m’initier à la manipulation d’ORM avec Prisma, et de structurer une interface utilisateur dynamique. Les compétences acquises ici me servent désormais de base solide pour des projets web plus complexes." },
                ],
            },
            skills: {
                create: [
                    { skill: { connect: { id: skills[1].id } } }, // Autonomie
                    { skill: { connect: { id: skills[8].id } } }, // Travail en équipe
                    { skill: { connect: { id: skills[17].id } } }, // Rigueur
                    { skill: { connect: { id: skills[18].id } } }, // Développement web
                    { skill: { connect: { id: skills[19].id } } }, // Templating
                    { skill: { connect: { id: skills[20].id } } }, // ORM
                    { skill: { connect: { id: skills[21].id } } }, // Base de donnée
                    { skill: { connect: { id: skills[22].id } } }, // CRUD
                ],
            },
        },
    });

    console.log(`Projet "${project_03.title}" créé avec succès !`);

    // Création Humanity - Musée virtuel

    const project_04 = await prisma.project.create({
        data: {
            title: "Humanity - Musée virtuel",
            description: "Projet universitaire réalisé en groupe de 6, Humanity est une expérience immersive en 3D sur le thème de Martin Luther King et de son combat contre le racisme. Développé sous Unreal Engine 5, ce musée interactif prend la forme d’un escape game narratif, dans lequel les visiteurs découvrent des œuvres engagées à travers un parcours scénarisé. Le musée, initialement un temple romain vide, a été complètement transformé par notre équipe, avec une forte dimension éthique, artistique et éco-responsable.",
            link: "https://github.com/AmauryCelarier",
            createdAt: new Date("2024-01-10"),
            duration: 120, 
            model3D: "model_3D/Humanity.glb",
            images: {
                create: [
                    { path: "images/Humanity/Humanity_01.png" },
                    { path: "images/Humanity/Humanity_02.png" },
                    { path: "images/Humanity/Humanity_03.png" },
                    { path: "images/Humanity/Humanity_04.png" },
                    { path: "images/Humanity/Humanity_05.png" },
                    { path: "images/Humanity/Humanity_06.png" },
                ],
            },
            paragraphs: {
                create: [
                    { content: "L’idée fondatrice de *Humanity* repose sur un double objectif : sensibiliser à la question du racisme à travers l’histoire de Martin Luther King, et proposer une expérience interactive marquante, où le joueur n’est pas simple spectateur, mais véritable acteur de sa progression. Plutôt que de concevoir un musée traditionnel, nous avons choisi la forme d’un escape game symbolique. Le joueur commence enfermé dans un musée représentant l’histoire du racisme, et doit en sortir pour atteindre un espace final de paix et de liberté. Chaque zone du musée incarne une époque ou un aspect de cette histoire (esclavage, ségrégation, lutte pour les droits civiques, espoir). À travers ce cheminement, les œuvres sélectionnées prennent tout leur sens : elles accompagnent la narration, provoquent la réflexion, et marquent par leur portée émotionnelle et historique." },
                    { content: "Le projet s’est construit autour de cinq grands pôles de travail : la recherche et sélection des œuvres, la conception du gameplay, la modélisation 3D, la programmation du jeu, et l’optimisation écologique du rendu. Dès le départ, j’ai pris en charge l’organisation du projet en tant que responsable d’équipe. Cela impliquait de définir les tâches de chacun selon leurs envies et compétences, de planifier les étapes de production, de maintenir une communication fluide, et d’assurer le respect du calendrier. Mon rôle était aussi de veiller à la cohérence globale du projet et de superviser les différentes livraisons intermédiaires. Sur le fond, nous avons pris le temps de rechercher des œuvres qui avaient du sens dans notre parcours narratif. Nous avons retenu 8 œuvres : 3 sculptures, 3 peintures, une affiche, et un poème à savoir : “The Problem We All Live With” - Norman Rockwell; “Cueilleurs de coton” - William Aiken Walker; “L’Exécution” - Bon Thompson; “Statue of Emmett Till”; The Embrace” - Hank Willis Thomas; “Mémorial Martin Luther King Jr.” - Lei Yixin; “Barack Obama Hope” - Shepard Fairey; “Still I Rise” - Maya Angelou. Chacune a été choisie pour son impact historique, émotionnel et visuel." },
                    { content: "J’ai ensuite participé à la conception du scénario et des mécaniques de jeu. Nous avons divisé le musée en 4 zones thématiques, chacune proposant une ambiance, des mécaniques spécifiques, et un ensemble d’œuvres adaptées. Pour renforcer l’immersion, nous avons également réfléchi à une ambiance sonore adaptée à chaque espace. L’expérience se termine à l’extérieur du musée, dans un champ ouvert symbolisant la liberté. Sur la partie 3D, j’ai réalisé une grande partie des modèles 3D sur 3ds Max, incluant des œuvres, des objets narratifs (comme des clés ou portes interactives), et même des éléments d’environnement comme un champ de coton. Certains objets nécessitaient des animations spécifiques, que j’ai également réalisées.J’ai ensuite texturé l’ensemble sur Substance 3D Painter, en utilisant des techniques avancées de baking : création d’objets low-poly auxquels j’ai appliqué les détails de versions high-poly, pour optimiser le poids et la fluidité sans perte de qualité visuelle. Ce travail d’optimisation s’inscrivait dans notre volonté de créer un jeu éco-responsable, avec un usage réduit des ressources matérielles." },
                    { content: "*Humanity* a été pour moi une expérience extrêmement enrichissante, tant sur le plan technique qu’humain. J’ai consolidé mes compétences en modélisation, texturing, animation et intégration, tout en prenant en charge la coordination d’un projet à plusieurs dimensions. Ce projet m’a également permis de travailler sur des sujets sensibles, en apprenant à traiter un thème historique fort avec respect, engagement et cohérence artistique. C’est aussi un projet qui m’a permis d’expérimenter une création engagée, dans laquelle les outils techniques et artistiques sont mis au service d’un message universel. L’impact sur les membres du jury et les testeurs a été très positif, tant sur le fond que sur la forme, et nous a permis de défendre un projet complet, structuré et original." },
                ],
            },
            skills: {
                create: [
                    { skill: { connect: { id: skills[3].id } } }, // Modélisation 3D
                    { skill: { connect: { id: skills[4].id } } }, // Texturing
                    { skill: { connect: { id: skills[7].id } } }, // Optimisation 3D
                    { skill: { connect: { id: skills[9].id } } }, // Communication
                    { skill: { connect: { id: skills[11].id } } }, // Animation 3D
                    { skill: { connect: { id: skills[13].id } } }, // Unreal Engine 5
                    { skill: { connect: { id: skills[14].id } } }, // Design de gameplay
                    { skill: { connect: { id: skills[23].id } } }, // Leadership
                    { skill: { connect: { id: skills[24].id } } }, // Gestion d'équipe
                    { skill: { connect: { id: skills[25].id } } }, // Esprit critique
                    { skill: { connect: { id: skills[26].id } } }, // Planification de projet
                    { skill: { connect: { id: skills[27].id } } }, // Eco-conception
                ],
            },
        },
    });

    console.log(`Projet "${project_04.title}" créé avec succès !`);

    console.log("✅ Seeding terminé avec succès !");
}

// Fin fonction async main()
    


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });





    
    // const project = await prisma.project.create({
    //     data: {
    //         title: "Titre",
    //         description: "Description",
    //         link: "lien",
    //         createdAt: new Date("2024-10-01"),
    //         duration: 14, 
    //         // model3D: "model_3d/monModel.glb",
    //         images: {
    //             create: [
    //                 { path: "images/image01.png" },
    //                 { path: "images/image02.png" },
    //             ],
    //         },
    //         paragraphs: {
    //             create: [
    //                 { content: "Paragraphes01" },
    //                 { content: "Paragraphes02" },
    //             ],
    //         },
    //         skills: {
    //             create: [
    //                 { skill: { connect: { id: skills[0].id } } },
    //                 { skill: { connect: { id: skills[1].id } } },
    //             ],
    //         },
    //     },
    // });

    // console.log(`Projet "${project.title}" créé avec succès !`);
    
    // Reload : npm run seed