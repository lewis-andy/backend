const express = require("express");
const router = express.Router();
const auth = require('../middleware/authorize');
const postController = require('../controllers/posts');
// const postModels = require("../models/posts");
const multer = require('../middleware/multer-config');

// Get all posts
router.get('/', auth, postController.getAllPosts);

// Get a single post
router.get('/:id', auth, postController.getOnePost);

// creste a new post
router.post('/', auth, multer, postController.createPost);

// router.post("/upload", upload.single("media"), (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
  
//       res.status(200).json({
//         message: "File uploaded successfully",
//         filePath: `/uploads/${req.file.filename}`,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

// Modify an existing post
// router.put('/:id', auth, multer, postController.modifyPost);

// Delete a post
router.delete('/:id', auth, postController.deletePost);

// Like or dislike a sauce
router.post('/:id/like', auth, postController.likePost);

// Route for adding a sauce with image upload
router.post('/', auth, multer, postController.createPost);

// Other routes (delete, get posts, etc.)
module.exports = router;

// Create Post
// router.post("/", auth, async (req, res) => {
//   const { content, mediaUrl } = req.body;
//   try {
//     const post = new post({ user: req.user.id, content, mediaUrl });
//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ error: "Error creating post" });
//   }
// });

// Fetch All Posts
// router.get("/", auth, async (req, res) => {
//   try {
//     const posts = await post.find().populate("user", "name");
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching posts" });
//   }
// });

// // Mark as Read
// router.patch("/:id/read", auth, async (req, res) => {
//   try {
//     const post = await postModels.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: "Error marking post as read" });
//   }
// });