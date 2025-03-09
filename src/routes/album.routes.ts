import { Router } from "express";
import { AlbumController } from "../controllers/album.controller";

const router = Router();
const albumController = new AlbumController();

router.post("/", (req, res) => albumController.createAlbum(req, res));
router.get("/", (req, res) => albumController.getAllAlbums(req, res));
router.get("/:id", (req, res) => albumController.getAlbumById(req, res));
router.post("/GetByFilters", (req, res) => albumController.getAlbumByFilter(req, res));
router.post("/ChangeStatus/:id/Activated", (req, res) => albumController.changeAlbumStatus(req, res));
router.post("/ChangeStatus/:id/Deactivated", (req, res) => albumController.changeAlbumStatus(req, res));
router.get("/GetByTitle", (req, res) => albumController.getAlbumByTitle(req, res));
router.get("/GetByBand", (req, res) => albumController.getAllAlbumsByBandId(req, res));

export default router;