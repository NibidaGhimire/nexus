import SubNexus from "../models/subnexus.model.js";

export const createSubNexus = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user ? req.user._id : null;
    const members = [userId];


    console.log("Creating post with data:", {
      name,
      description,
      userId,
    });

    if (!userId) {
      console.error("User ID is missing");
      return res.status(400).json({ error: "User ID is missing" });
    }

    const newSubNexus = new SubNexus({
      name,
      description,
      createdBy: userId,
      members,
    });

    await newSubNexus.save();

    res.status(201).json(newSubNexus);
  } catch (error) {
    console.log("Error in createSubNexus controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSubNexus = async (req, res) => {
  try {
    const subnexus = await SubNexus.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("members", "username");
    if (!subnexus) {
      return res.status(404).json({ error: "SubNexus not found" });
    }
    res.status(200).json(subnexus);
  } catch (error) {
    console.log("Error in getSubNexus controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllSubNexus = async (req, res) => {
  try {
    const subnexus = await SubNexus.find().populate("createdBy", "username");
    res.status(200).json(subnexus);
  } catch (error) {
    console.log("Error in getAllSubNexus controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const joinSubNexus = async (req, res) => {
  try {
    const subnexus = await SubNexus.findById(req.params.id);
    if (!subnexus) {
      return res.status(404).json({ error: "SubNexus not found" });
    }
    if (!subnexus.members.includes(req.user._id)) {
      subnexus.members.push(req.user._id);
      await subnexus.save();
    }
    res.status(200).json(subnexus);
  } catch (error) {
    console.log("Error in joinSubNexus controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
