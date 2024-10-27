// Import du helper create Factory de Hono
// https://hono.dev/docs/helpers/factory
import { createFactory } from "hono/factory";
// Import de l'exception HTTP
import { HTTPException } from "hono/http-exception";
// Import du connecteur SQLite
import { db } from "../utils/db";

const championsLeagueMatches = [
  {
    equipe1: "Paris Saint-Germain",
    equipe2: "Manchester City",
    date: new Date("2024-10-27T20:00:00"), 
    cote: {
      "1": 2.10,  // Victoire de PSG
      "N": 3.60,  // Match nul
      "2": 2.30,  // Victoire de Manchester City
    },
  },
  {
    equipe1: "Real Madrid",
    equipe2: "Inter Milan",
    date: new Date("2024-10-27T18:00:00"), 
    cote: {
      "1": 1.85,  // Victoire de Real Madrid
      "N": 3.40,  // Match nul
      "2": 4.00,  // Victoire de Inter Milan
    },
  },
  {
    equipe1: "Liverpool",
    equipe2: "Bayern Munich",
    date: new Date("2024-10-27T15:00:00"), 
    cote: {
      "1": 2.50,  // Victoire de Liverpool
      "N": 3.50,  // Match nul
      "2": 2.20,  // Victoire de Bayern Munich
    },
  },
  {
    equipe1: "Chelsea",
    equipe2: "Barcelona",
    date: new Date("2024-10-28T18:00:00"), 
    cote: {
      "1": 2.25,  // Victoire de Chelsea
      "N": 3.20,  // Match nul
      "2": 2.40,  // Victoire de Barcelona
    },
  },
  {
    equipe1: "Juventus",
    equipe2: "Manchester United",
    date: new Date("2024-10-28T18:00:00"), 
    cote: {
      "1": 2.40,  // Victoire de Juventus
      "N": 3.30,  // Match nul
      "2": 2.30,  // Victoire de Manchester United
    },
  },
  {
    equipe1: "Atletico Madrid",
    equipe2: "AC Milan",
    date: new Date("2024-10-28T18:00:00"), 
    cote: {
      "1": 1.95,  // Victoire de Atletico Madrid
      "N": 3.30,  // Match nul
      "2": 3.90,  // Victoire de AC Milan
    },
  },
  {
    equipe1: "Dortmund",
    equipe2: "Porto",
    date: new Date("2024-10-28T18:00:00"), 
    cote: {
      "1": 1.75,  // Victoire de Dortmund
      "N": 3.80,  // Match nul
      "2": 4.20,  // Victoire de Porto
    },
  },
  {
    equipe1: "Benfica",
    equipe2: "RB Leipzig",
    date: new Date("2024-10-28T18:00:00"), 
    cote: {
      "1": 2.60,  // Victoire de Benfica
      "N": 3.40,  // Match nul
      "2": 2.10,  // Victoire de RB Leipzig
    },
  },
];

type match = {
  equipe1: string;
  equipe2: string;
  date: Date;
  cote: {
    "1": number;
    "2": number;
    "N": number;
  };
};

export async function fonctionViewMatch(){
  const today = new Date();
  const match = championsLeagueMatches.filter(match => match.date.getDate() === today.getDate()) as match[];
  if(!match){
    throw new HTTPException(400, { message: "Aucun match du jour" });
  }
  return match;
}

export const viewMatch = createFactory().createHandlers(async (c) => {
  const match = await fonctionViewMatch();
  return c.json(match);
});