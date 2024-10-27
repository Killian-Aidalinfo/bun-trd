import { describe, expect, test } from "bun:test";
import { fonctionViewMatch } from "../src/controllers/matchController";

describe("Recupéation des matchs seulement du jour", () => {
  test("Recupération des matchs du jour", async () => {
    const match = await fonctionViewMatch();
    const today = new Date();
    expect(match.length).toBeGreaterThan(0);
    match.forEach((m) => {
      expect(m.date.getDate()).toBe(today.getDate());
    })
  });
})