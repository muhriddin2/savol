const Joi = require("joi");
const path = require("path");
const { v4: uuid } = require("uuid");

const Io = require('../utils/Io');
const Feedback = require("../models/feedback.model");

const Feedbacks = new Io(process.cwd()+"/database/feedback.database.json")

const create = async (req, res) => {
    const {name, job, text} = req.body;
    const image = req.files?.photo;

    const schema = Joi.object({
        name: Joi.string().required(),
        job: Joi.string().required(),
        text: Joi.string().required(),
    });
  
    const {error} = schema.validate({
        name,
        job,
        text,
    });
  
    if (error) return res.status(400).json({message: error.message});

    const mimetype = path.extname(image.name);
    const photo = uuid() + mimetype;

    image.mv(process.cwd() + "/uploads/" + photo);

    const feedbacks = await Feedbacks.read();

    const id = (feedbacks[feedbacks.length - 1]?.id || 0) + 1;

    const newFeedback = new Feedback(id, name, job, text, photo);

    const data = feedbacks.length ? [...feedbacks, newFeedback] : [newFeedback];

    await Feedbacks.write(data);

    res.status(201).json({message: "Created"});
}

const get_feedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedbacks.read();

        res.json({feedbacks: feedbacks})
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

const get_one_feedback = async (req, res) => {
    try {
        const {id} = req.params;
        const feedbacks = await Feedbacks.read();

        const feedback = feedbacks.find((feedback) => feedback.id == id);

        if(!feedback) return res.status(404).json({message: "FEEDBACK NOT FOUND"});

        res.status(201).json({feedback: feedback})
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

const update_one_feedback = async (req, res) => {
    const {id} = req.params;
    const {name, job, text} = req.body;
    const image = req.files?.photo;

    const feedbacks = await Feedbacks.read();

    const feedback = feedbacks.find((feedback) => feedback.id == id);

    if(!feedback)
        return res.status(404).json({message: "FEEDBACK NOT FOUND"});

    if(image) {
        const mimetype = path.extname(image.name);
        const photo = uuid() + mimetype;

        image.mv(process.cwd() + "/uploads/" + photo);
    }

    feedback.name = name ? name : feedback.name;
    feedback.job = job ? job : feedback.job;
    feedback.text = text ? text : feedback.text;
    

    await Feedbacks.write(feedbacks);

    res.json({message: "Success", data: feedback});
}

const remove_one_feedback = async (req, res) => {
    try {
        const {id} = req.params;
        const feedbacks = await Feedbacks.read();

        const feedback = feedbacks.filter((feedback) => feedback.id != id);

        await Feedbacks.write(feedback);

        res.status(201).json({message: "Success"});
    } catch (error) {
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

module.exports = { create, get_feedbacks, get_one_feedback, update_one_feedback, remove_one_feedback }