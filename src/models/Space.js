const mongoose = require("mongoose");

const ValueSchema = new mongoose.Schema({
  Exp: { type: Number },
  WinningSlts: { type: Number },
  joinings: { type: Number },
});

const TableOfContextSchema = new mongoose.Schema({
  overview: { type: String },
  indexNo: { type: Number },
  description: { type: String },
});

const questSchema = new mongoose.Schema({
  questId: { type: Number, required: true },
  title: { type: String, required: true },
  reward: { type: String, required: true },
  value: { type: ValueSchema },
  tableOfContent: [TableOfContextSchema],
});

const spaceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  context: {
    totalRewardPool: { type: String, default: "" },
    totalQuests: { type: Number, default: 0 },
    quests: [questSchema],
  },
});

module.exports = mongoose.model("Space", spaceSchema);
