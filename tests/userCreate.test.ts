//Import des class de test via bun:test
import { describe, expect, test } from "bun:test";
//Récupération de la fonction à tester
import { fonctionUserCreate, fonctionUserLogin } from "../src/controllers/usersController";
// Import de l'exception HTTP
import { HTTPException } from "hono/http-exception";
// Import de la db vider les données de la base de données
import { db } from "../src/utils/db";
import { verify } from "hono/jwt";

//Récupération des tables de la base de données
const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all() as { name: string }[];
// as name string[], permet de dire que le résultat de la query est un tableau

//Suppression des données de chaque table
for (const table of tables) {
  db.run(`DELETE FROM ${table.name};`);
}

//Input standard pour la création d'un utilisateur
let userInput = {
  nom: "Test",
  prenom: "Killian",
  email: "killian.stein@civilisation.fr",
  password: "SuperAzerty57",
  age: 23,
  pays: "France",
};

//Création d'un bloc de test pour fonctionUserCreate
describe("Tests de la fonction fonctionUserCreate", () => {
// Test de la création d'un utilisateur
  test("Création d'un utilisateur", async () => {
    //Message de retour dans une variable
    const resultUserCreation = await fonctionUserCreate(userInput);
    //Vérification que ça retourne la valeur attendu
    expect(resultUserCreation).toBe("Utilisateur créé avec succès");
  });
  test("Vérification d'un essaie de création avec une email déjà existant", async () => {
    expect(fonctionUserCreate(userInput)).rejects.toThrow(
      new HTTPException(500, { message: "Erreur lors de la création de l'utilisateur: SQLiteError: UNIQUE constraint failed: users.email" })
    );
  });
  // Test de la création d'un utilisateur avec un age inférieur à 18
  test("Erreur de création de l'utilisateur avec un age inférieur à 18", async () => {
    userInput.age = 17;
    //Ici on met pas la fonction dans une variable sinon nous n'avons pas l'erreur Throw
    expect(fonctionUserCreate(userInput)).rejects.toThrow(
      new HTTPException(400, { message: "L'age doit être supérieur à 18" })
    );
  });
  // Test de la création d'un utilisateur avec des champs manquants
  test("Erreur de création de l'utilisateur avec des champs manquants", async () => {
    userInput.age = 18;
    userInput.pays = "";
    expect(fonctionUserCreate(userInput)).rejects.toThrow(
      new HTTPException(400, { message: "Tous les champs sont obligatoires" })
    );
  });
});

//Input de login
let loginInput = {
  email: userInput.email,
  password: userInput.password,
}

// Tests de la fonction fonctionUserLogin
describe("Tests de la fonction fonctionUserLogin", () => {
  test("Connexion réussie", async () => {
    const token = await fonctionUserLogin(loginInput);
    expect(token).toBeDefined();
    // Décodage et vérification du token
    const payload = await verify(token, Bun.env.JWT_SECRET as string);
    expect(payload).toHaveProperty("id" && "exp");   
    //https://jestjs.io/docs/expect#tohavepropertykeypath-value
  });

  test("Échec de connexion avec un mot de passe incorrect", async () => {
    loginInput.password = "Azerty57";
    expect(fonctionUserLogin(loginInput)).rejects.toThrow(
      new HTTPException(400, { message: "Mot de passe incorrect" })
    );
  });
  
  test("Addresse email inexistante", async () => {
    loginInput.email = "test@gmail.com";

    expect(fonctionUserLogin(loginInput)).rejects.toThrow(
      new HTTPException(400, { message: "Utilisateur inexistant" })
    );
  });

  test("Échec de connexion avec des champs manquants", async () => {
    loginInput.email = "";
    loginInput.password = "";

    expect(fonctionUserLogin(loginInput)).rejects.toThrow(
      new HTTPException(400, { message: "Tous les champs sont obligatoires" })
    );
  });

});