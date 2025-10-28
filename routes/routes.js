const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
// user authentication
function ensureAuthenticated(req, res, next) {
  console.log("isAuthenticated:", req.isAuthenticated());
  console.log("user:", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}
// post user's images
router.post("/api/images", ensureAuthenticated, (req, res) => {
  const { title, url } = req.body;
  if (!title || !url)
    return res.status(400).send("Title and image URL are required.");
  const { username } = req.user;
  if (!username) return res.status(400).send("Invalid username");
  const addImage = new Image({
    title,
    url,
    postedBy: username,
  });
  addImage
    .save()
    .then((image) => res.status(201).json(image))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to save images");
    });
});
// get all images
router.get("/api/images", (req, res) => {
  const findImage = Image.find({});
  findImage
    .sort({
      addedAt: -1,
    })
    .then((images) => res.json(images))
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to find all images.");
    });
});
// get user's images
router.get("/api/my-images", ensureAuthenticated, (req, res) => {
  const { username } = req.user;
  if (!username) return res.status(400).send("Invalid username");
  const findImage = Image.find({ postedBy: username });
  findImage
    .sort({
      addedAt: -1,
    })
    .then((images) => {
      res.json(images);
      console.log(images);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to find images for the user.");
    });
});
// delete user's images
router.delete("/api/my-images/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Invalid id.");
  const { username } = req.user;
  if (!username) return res.status(400).send("Invalid username");
  Image.findOneAndDelete({
    _id: id,
    postedBy: username,
  })
    .then((deleted) => {
      if (!deleted) {
        return res.status(403).send("Not authorized as deleted.");
      }
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to delete images");
    });
});

module.exports = router;
