const Room = require("../models/Room.js");

const createRoom = async (req, res) => {
  const { groupName } = req.body; // Destructuring ile 'groupName' verisini alıyoruz
  console.log("Received groupName:", groupName); // Konsolda doğru şekilde görülebilmesi için

  try {
    const newRoom = await Room.create({ name: groupName }); // MongoDB'de 'name' olarak saklanacak
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allRoom = async (req, res) => {
  try {
    const getRooms = await Room.find();
    res.status(200).json(getRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const detailRoom = async (req, res) => {
  try {
    const detail = await Room.findById(req.params.id);
    if (!detail) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(detail);
  } catch (error) {
    console.error("Error fetching room details:", error); // Hata ayrıntılarını yazdır
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRoom, allRoom, detailRoom };
