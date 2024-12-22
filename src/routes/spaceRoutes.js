const express = require("express");
const {
  createSpace,
  getSpaces,
  addContextToSpace,
  addValuesFunction,
  addJoiningFunction,
  addContentToTableOfContent,
} = require("../controllers/spaceController");

const router = express.Router();

router.post("/", createSpace);

router.get("/", getSpaces);

router.post("/:id/context", addContextToSpace);

router.post("/:id/quests/:questId/values", addValuesFunction);

router.post("/:id/quests/:questId/join", addJoiningFunction);

router.post("/:id/quests/:questId/content", addContentToTableOfContent);

module.exports = router;
