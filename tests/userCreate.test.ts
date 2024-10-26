//Import des class de test via bun:test
import { describe, expect, test, jest } from "bun:test";
//Récupération de la fonction à tester
import { fonctionUserCreate } from "../src/controllers/usersController";
// Import de l'exception HTTP
import { HTTPException } from "hono/http-exception";
// Import de la db pour mock la méthode db.run
import { db } from "../src/utils/db";

// Mock de la méthode db.run pour éviter les écritures en base réelle
// https://jestjs.io/docs/mock-functions
db.run = jest.fn();

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
    userInput.email = "";
    expect(fonctionUserCreate(userInput)).rejects.toThrow(
      new HTTPException(400, { message: "Tous les champs sont obligatoires" })
    );
  });
});
