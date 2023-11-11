import { Hono } from "hono";
import { Database } from "better-sqlite3";

type Variables = {
    user: {
        user_id: string;
    }
    database: Database;
};

export const rate_recipe = new Hono<{ Variables: Variables }>();

rate_recipe.post("/rate-recipe/:recipe_id", async (c) => {
    const recipe_id = c.req.param("recipe_id");
    const score = Number(c.req.query("score"));
    const { user_id } = c.var.user; //get user_id from cookieAuth
    if (isNaN(score)) return c.json({ error: "Invalid score value" }, 400);
    //kolla på ngt som heter upsert
    try {
        c.var.database.prepare(
            `INSERT OR REPLACE INTO Score (user_id, recipe_id, score) VALUES (?, ?, ?)
            ON CONFLICT (user_id, recipe_id) DO UPDATE SET score = ${score}
            `
        ).run(user_id, recipe_id, score);

        return c.json({ ok: true }, 201);
    } catch (error) {
        return c.json({ error }, 500);
    }
});