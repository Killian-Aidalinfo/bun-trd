// Import du helper create Factory de Hono
// https://hono.dev/docs/helpers/factory
import { createFactory } from "hono/factory";
// Import de l'exception HTTP
import { HTTPException } from "hono/http-exception";
// Import du connecteur SQLite
import { db } from "../utils/db";

// Création d'un type utilisateur
type user = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  age: number;
  pays: string;
  created_at: string;
};
// Création d'un type d'input utilisateur sans id et created_at
type userInput = Omit<user, "id" | "created_at">;
//Instanciation du Factory
const factory = createFactory();

// Création d'une fonction qui permet de créer un utilisateur
// la fonction est en dehors du helper pour faciliter la création des test
export async function fonctionUserCreate(userInput: userInput) {
  //Vérification des champs obligatoires
  if (
    !userInput.email ||
    !userInput.password ||
    !userInput.nom ||
    !userInput.prenom ||
    !userInput.age ||
    !userInput.pays
  ) {
    throw new HTTPException(400, {
      message: "Tous les champs sont obligatoires",
    });
  }
  //Vérification de l'age
  if (userInput.age < 18) {
    throw new HTTPException(400, { message: "L'age doit être supérieur à 18" });
  }
  //Hashage du mot de passe
  //https://bun.sh/guides/util/hash-a-password
  const hashedPassword = await Bun.password.hash(userInput.password);
  // Insertion de l'utilisateur dans la base de données
  try {
    db.run(
      "INSERT INTO users (nom, prenom, email, password, age, pays) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userInput.nom,
        userInput.prenom,
        userInput.email,
        hashedPassword,
        userInput.age,
        userInput.pays,
      ]
    );
    return "Utilisateur créé avec succès";
  } catch (err) {
    //Envoie d'une erreur si la création de l'utilisateur a échoué
    throw new HTTPException(500, {
      message: `Erreur lors de la création de l'utilisateur: ${err}`,
    });
  }
}

export const userCreate = factory.createHandlers(async (c) => {
  // Récupéreration des donnée de la requête
  const userInput = await c.req.json<userInput>();
  const message = await fonctionUserCreate(userInput);
  return c.text(message);
});

// Login utilisateur
import { sign } from "hono/jwt";
//Fonction de login de l'utilisateur
export async function fonctionUserLogin(userInput: Pick<userInput, "email" | "password">) {
  //Pick permet de sélectionner juste les champs d'entrée voulus de userInput
  //Vérification des champs obligatoires
  if (!userInput.email || !userInput.password) {
    throw new HTTPException(400, {
      message: "Tous les champs sont obligatoires",
    });
  }
  //Requete dans la base de données pour récupérer l'utilisateur
  const user = db
    .query("SELECT * FROM users WHERE email = ?")
    .get(userInput.email) as user; //Nécessite as user en TS pour typé le résultat de la query
  //Erreur si l'utilisateur n'existe pas
  if(!user){
    throw new HTTPException(400, { message: "Utilisateur inexistant" });
  }
  //Vérification du password
  //https://bun.sh/guides/util/hash-a-password
  const isMatch = await Bun.password.verify(userInput.password, user.password);
  //Vérification si le password signé correspond
  if (!isMatch) {
    throw new HTTPException(400, { message: "Mot de passe incorrect" });
  }
  //Création du payload pour le token
  const payload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expiration dans 60 minutes
  };
  //Récupération du secret JWT dans le .env
  const secret = Bun.env.JWT_SECRET as string; // nécessite as string et le if pour éviter une erreur undefined à la signature du token
  if (!secret) {
    throw new Error(
      "JWT_SECRET n'est pas défini dans les variables d'environnement."
    );
  }
  // Création du token
  const token = await sign(payload, secret);
  return token;
}

export const userLogin = factory.createHandlers(async (c) => {
  // Récupéreration des donnée de la requête
  const userInput = await c.req.json<userInput>();
  const result = await fonctionUserLogin(userInput);
  return c.text(result);
});