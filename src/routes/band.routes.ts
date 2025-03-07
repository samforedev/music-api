import { Router } from "express";
import { BandController } from "../controllers/band.controller";

const router = Router();
const bandController = new BandController();

router.post("/", (req, res) => bandController.createBand(req, res));
router.get("/", (req, res) => bandController.getAllBands(req, res));
router.get("/:id", (req, res) => bandController.getBandById(req, res));
router.post("/GetByFilters", (req, res) => bandController.getBandByFilters(req, res));
router.post("/ChangeStatus/:id/Activated", (req, res) => bandController.changeBandStatus(req, res));
router.post("/ChangeStatus/:id/Deactivated", (req, res) => bandController.changeBandStatus(req, res));
router.post("/GetByArtistId", (req, res) => bandController.getByArtistId(req, res));
router.post("/:id/AddManyArtist", (req, res) => bandController.addMembersToBand(req, res));
router.post("/:id/CreateBandMember", (req, res) => bandController.createAndAddNewMember(req, res));


export default router;