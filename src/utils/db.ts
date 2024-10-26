import { Database } from "bun:sqlite";
//Connexion à la base de données (La création est faite si elle n'existe pas)
export const db =
  Bun.env.NODE_ENV === "test"
    ? new Database("data/trd_test.sqlite", { create: true })
    : new Database("data/trd.sqlite", { create: true });

//Création de la table utilisateur par défaut
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    age INTEGER,
    pays TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);
