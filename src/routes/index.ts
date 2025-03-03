import { Router } from "express";
import artistRoutes from "./artist.routes";

const router = Router();

/** Artist Router */
router.use("/artists", artistRoutes);

export default router;