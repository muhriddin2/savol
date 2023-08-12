const Joi = require("joi");
const bcrypt = require("bcrypt");

const Io = require("../utils/io");
const jwt = require("../utils/jwt");
const Admin = require("../models/new_admin.model");

const Admins = new Io(process.cwd()+"/database/admin.database.json")

const admin_create = async (req, res) => {
    const {login, password} = req.body;

    const schema = Joi.object({
        login: Joi.string().required(),
        password: Joi.string().min(6).required(),
      });
  
      const {error} = schema.validate({
        login,
        password,
      });
  
      if (error) return res.status(400).json({message: error.message});

    const admins = await Admins.read();

    const admin = admins.find((admin) => admin.login === login);

    if (admin) return res.status(403).json({ message: "Admin already exists"});

    const id = (admins[admins.length - 1]?.id || 0) + 1;
    const hashedPass = await bcrypt.hash(password, 12)

    const newAdmin = new Admin(id, login, hashedPass);

    const data = admins.length ? [...admins, newAdmin] : [newAdmin];

    await Admins.write(data);

    const token = jwt.sign({id: newAdmin.id});

    res.status(201).json({message: "Succes", data: token})
}

const chesk_admin = async (req, res) => {
    const {login, password} = req.body;

    const admins = await Admins.read();

    const admin = admins.find((admin) => admin.login === login);

    if (!admin)
        return res.status(403).json({message: "ADMIN NOT FOUND"});

    const result = await bcrypt.compare(password, admin.password);

    if(result)
        return res.status(201).json({message: "Success"});

    return res.status(403).json({message: "ADMIN NOT FOUND"})
}

module.exports = {admin_create, chesk_admin};