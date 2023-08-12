const {Router} = require("express");

const { create, get_services, get_one_service, remove_one_service, update_one_service } = require("../controles/services.control");
const isAdmin = require("../middlewars/isAdmin");

const router = Router();

router.post("/services/created", isAdmin, create);
router.get("/services/get", get_services);
router.get("/services/get/:id", get_one_service);
router.put("/services/update/:id", isAdmin, update_one_service);
router.delete("/services/delete/:id", isAdmin, remove_one_service);

module.exports = router;