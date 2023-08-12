const {Router} = require("express");

const isAdmin = require("../middlewars/isAdmin");
const { contact_created, contact_korish } = require("../controles/contact.control");

const router = Router();

router.post("/contact/created", contact_created);
router.get("/contact/korish/:id", isAdmin, contact_korish);

module.exports = router;