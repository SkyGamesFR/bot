import { Router } from "express";
import McController from "../controllers/mc.controller";

export default class McRoutes {
    public router: Router;

   // remplace my controller for your controller
    private controller: McController = new McController();

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

   // remplace my example routes and controller methods for your own 
    protected registerRoutes(): void {
        this.router.get('/', this.controller.getPlayers);
        this.router.post('/', this.controller.createPlayer);  // Ensure this matches your POST request URL
        this.router.delete('/:uuid', this.controller.deletePlayer);
        this.router.post('/playerDied', this.controller.playerDied);
    }

}