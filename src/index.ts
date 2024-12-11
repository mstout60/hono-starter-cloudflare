import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Hono } from "hono";
import { products, Users } from "./db/schema";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app
  .get("/", zValidator("query", z.object({})), async (c) => {
    try {
      const client = new Pool({ connectionString: c.env.DATABASE_URL });

      const db = drizzle(client);

      const result = await db.select().from(products);

      return c.json({
        result: "This Hono Works!!",
      });
    } catch (error) {
      console.log(error);
      return c.json(
        {
          error,
        },
        400
      );
    }
  })
  .post(
    "/username",
    zValidator(
      "json",
      z.object({
        username: z.string(),
      })
    ),
    async (c) => {
      try {
        const body = c.req.valid("json");

        const client = new Pool({ connectionString: c.env.DATABASE_URL });
        const db = drizzle(client);

        await db.insert(Users).values(body);
        return c.json({
          status: 200,
          message: "Success",
        });
      } catch (error) {
        return c.json({
          status: 400,
          message: "FAILED",
        });
      }
    }
  );

export default app;
