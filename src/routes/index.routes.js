const adminRouter = require("./admin.routes");
const servicesRouter = require("./services.routes");
const feedbackRouter = require("./feedbeck.routes");
const contactRouter = require("./contact.routes")

module.exports = [
    adminRouter,
    servicesRouter,
    feedbackRouter,
    contactRouter,
]