import { Router } from "express";
import { ArtistController } from "../controllers/artist.controller";

const router = Router();
const artistController = new ArtistController();

router.post("/", (req, res) => artistController.createArtist(req, res));
router.get("/", (req, res) => artistController.getAllArtists(req, res));
router.get("/:id", (req, res) => artistController.getArtistById(req, res));
router.post("/GetByFilters", (req, res) => artistController.getArtistsByFilter(req, res));
router.post("/ChangeStatus/:id/Activated", (req, res) => artistController.changeArtistStatus(req, res));
router.post("/ChangeStatus/:id/Deactivated", (req, res) => artistController.changeArtistStatus(req, res));

export default router;