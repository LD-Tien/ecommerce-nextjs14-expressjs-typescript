import { Router } from "express";
import conn from "../configs/db";

const router = Router();

router.get("/test", async (req, res) => {
  try {
    conn.query('SELECT 1 + 1 AS `test`;', (_err, rows) => {
      res.json({
        message: "test api",
        data: rows
      });
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
