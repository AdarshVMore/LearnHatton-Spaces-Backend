const Space = require("../models/Space");

const createSpace = async (req, res) => {
  try {
    const { title } = req.body;
    const newSpace = await Space.create({ title, hasContext: false });
    res
      .status(201)
      .json({ message: "Space created successfully", space: newSpace });
  } catch (error) {
    res.status(500).json({ error: "Failed to create space" });
  }
};

const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
};

const addContextToSpace = async (req, res) => {
  const { id } = req.params;
  const { totalRewardPool, totalQuests, quests } = req.body;

  try {
    const space = await Space.findById(id);

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const updatedQuests = quests.map((quest, index) => ({
      ...quest,
      questId: index,
    }));
    space.context = {
      totalRewardPool,
      totalQuests,
      quests: updatedQuests,
    };

    await space.save();

    res.status(200).json({ message: "Context added successfully", space });
  } catch (error) {
    console.error("Error adding context:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addValuesFunction = async (req, res) => {
  const { id } = req.params;
  const { questId } = req.params;
  const { exp, winningSlts } = req.body;

  try {
    const space = await Space.findById(id);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const quest = space.context.quests.find(
      (quest) => quest.questId === Number(questId)
    );
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    quest.value.Exp = exp;
    quest.value.WinningSlts = winningSlts;

    await space.save();

    res
      .status(200)
      .json({ message: "Quest values updated successfully", space });
  } catch (error) {
    console.error("Error updating quest values:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addJoiningFunction = async (req, res) => {
  const { id } = req.params;
  const { questId } = req.params;
  try {
    const space = await Space.findById(id);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const quest = space.context.quests.find(
      (quest) => quest._id.toString() === questId
    );
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    quest.value.joinings += 1;

    await space.save();

    res
      .status(200)
      .json({ message: "Quest joinings updated successfully", space });
  } catch (error) {
    console.error("Error updating quest joinings:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addContentToTableOfContent = async (req, res) => {
  const { id } = req.params;
  const { questId } = req.params;
  const { content } = req.body;
  console.log("Received content:", JSON.stringify(content, null, 2));

  try {
    const space = await Space.findById(id);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const quest = space.context.quests.find(
      (quest) => quest.questId === parseInt(questId)
    );
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    if (!Array.isArray(content) || content.length === 0) {
      return res
        .status(400)
        .json({ message: "Content should be a non-empty array." });
    }

    for (const [index, item] of content.entries()) {
      if (!item.overview || !item.indexNo || !item.description) {
        return res.status(400).json({
          message: `Missing required field(s) in content item at index ${index}.`,
        });
      }
    }

    content.forEach((newContent) => {
      const tableOfContentItem = {
        overview: newContent.overview,
        indexNo: newContent.indexNo,
        description: newContent.description,
      };

      quest.tableOfContent.push(tableOfContentItem);
    });

    await space.save();

    res.status(200).json({
      message: "Content added to quest's table of contents successfully",
      quest,
    });
  } catch (error) {
    console.error("Error details:", JSON.stringify(error.errors, null, 2));
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createSpace,
  getSpaces,
  addContextToSpace,
  addValuesFunction,
  addJoiningFunction,
  addContentToTableOfContent,
};
