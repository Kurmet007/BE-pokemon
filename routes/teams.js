import express from "express";
import Team from "../models/Team.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const teams = await Team.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { teamId, teamName, pokemon } = req.body;

  if (!teamName || !pokemon || pokemon.length !== 6) {
    return res.status(400).json({ error: "Team name and 6 Pokémon are required" });
  }

  try {
    let team;
    if (teamId) {
      // edit
      team = await Team.findOneAndUpdate(
        { _id: teamId, userId: req.user.id },
        { teamName, pokemon },
        { new: true }
      );
      if (!team) return res.status(404).json({ error: "Team not found" });
    } else {
      // make
      team = await Team.create({
        userId: req.user.id,
        teamName,
        pokemon
      });
    }

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// del
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const team = await Team.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
