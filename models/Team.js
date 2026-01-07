import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  teamName: { type: String, required: true },
  pokemon: {
    type: [String],
    validate: [arr => arr.length === 6, "Team must have exactly 6 Pokémon"]
  }
}, { timestamps: true });

export default mongoose.model("Team", teamSchema);
