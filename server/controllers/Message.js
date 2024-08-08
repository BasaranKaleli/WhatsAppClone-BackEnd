const Message = require("../models/Message.js");

const createMessage = async (req, res) => {
  try {
    const newMessage = await Message.create(req.body); // MongoDB'de 'name' olarak saklanacak
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const detailMessage = async (req, res) => {
  console.log(req.params.id, "req");
  try {
    const detailMessage = await Message.find({ roomId: req.params.id }); // MongoDB'de 'name' olarak saklanacak
    res.status(200).json(detailMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMessage, detailMessage };
