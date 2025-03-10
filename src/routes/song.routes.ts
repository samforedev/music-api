import { Router } from "express";
import { SongController } from "../controllers/song.controller";

const router = Router();
const songController = new SongController();

router.post("/", (req, res) => songController.createSong(req, res));
router.get("/", (req, res) => songController.getAllSongs(req, res));

export default router;