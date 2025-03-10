import { Router } from "express";
import artistRoutes from "./artist.routes";
import bandRoutes from "./band.routes";
import albumRoutes from "./album.routes";
import songRoutes from "./song.routes";

const router = Router();

/** Artist Router */
router.use("/artists", artistRoutes);

/** Bands Router */
router.use("/bands", bandRoutes);

/** Albums Router */
router.use("/albums", albumRoutes);

/** Songs Router */
router.use("/songs", songRoutes);

export default router;