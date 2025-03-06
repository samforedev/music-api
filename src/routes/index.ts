import { Router } from "express";
import artistRoutes from "./artist.routes";
import bandRoutes from "./band.routes";

const router = Router();

/** Artist Router */
router.use("/artists", artistRoutes);

/** Bands Router */
router.use("/bands", bandRoutes);

export default router;