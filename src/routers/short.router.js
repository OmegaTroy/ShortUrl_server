import { Router } from "express";
const route = Router();
import {
  createShortUrl,
  getShortUrls,
  deleteShortUrl,
  updateShortUrl,
  redirectShortUrl,
} from "../controllers/shortUrl.controller.js";

import { authRequired } from "../middlewares/validateToken.js";

// CORREGIR las rutas:
route.post("/shortUrl", authRequired, createShortUrl);
route.get("/shortUrl", authRequired, getShortUrls);
route.delete("/shortUrl/:id", authRequired, deleteShortUrl);
route.put("/shortUrl/:id", updateShortUrl);

// Ruta para redirección (sin autenticación requerida)
route.get("/:shortUrl", redirectShortUrl);

export default route;
