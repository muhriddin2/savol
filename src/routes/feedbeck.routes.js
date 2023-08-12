const {Router} = require("express");

const isAdmin = require("../middlewars/isAdmin");
const { create, get_feedbacks, get_one_feedback, update_one_feedback,remove_one_feedback } = require("../controles/feedbeck.control")

const router = Router();

router.post("/feedback/created", create);
router.get("/feedback/get", get_feedbacks);
router.get("/feedback/get/:id", isAdmin, get_one_feedback);
router.put("/feedback/update/:id", isAdmin, update_one_feedback)
router.delete("/feedback/delete/:id", isAdmin, remove_one_feedback);

module.exports = router;