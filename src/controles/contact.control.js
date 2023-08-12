const Joi = require("joi");

const Io = require("../utils/Io");
const Contact = require("../models/contact.models");

const Contacts = new Io(process.cwd()+"/database/contact.json");

const contact_created = async (req, res) => {
    const {name, phonenumber, email, message} = req.body;

    const phoneNumberRegex = /^\+998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/;

    const schema = Joi.object({
        name: Joi.string().required(),
        phonenumber: Joi.string().regex(phoneNumberRegex).required(),
        email: Joi.string().required(),
        message: Joi.string().required(),
    });
  
    const {error} = schema.validate({
        name,
        phonenumber,
        email,
        message,
    });
  
    if (error) return res.status(400).json({message: error.message});

    const contacts = await Contacts.read();

    const id = (contacts[contacts.length - 1]?.id || 0) + 1;

    const newContact = new Contact(id, name, phonenumber, email, message)

    const data = contacts.length ? [...contacts, newContact] : [newContact];

    await Contacts.write(data);

    res.status(201).json({message: "Created"});
}

const contact_korish = async (req, res) => {
    const {id} = req.params;

    const contacts = await Contacts.read();

    const contact = contacts.find((contact) => contact.id == id);

    if(!contact)
        return res.status(403).json({ message: "CONTACT NOT FOUND"});

    res.status(201).json({contact: contact});

    contact.condition = "ko'rildi";

    await Contacts.write(contacts);
}

module.exports = { contact_created, contact_korish }