import { Router } from "express";
import artistRoutes from "./artist.routes";
import bandRoutes from "./band.routes";
import albumRoutes from "./album.routes";

const router = Router();

/** Artist Router */
router.use("/artists", artistRoutes);

/** Bands Router */
router.use("/bands", bandRoutes);

/** Albums Router */
router.use("/albums", albumRoutes);

export default router;