const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const postCtrl = require("../controllers/postController");

// posts
router.post("/", authMiddleware, upload.single("image"), postCtrl.createPost);
router.get("/", authMiddleware, postCtrl.listPosts);
router.get("/:id", authMiddleware, postCtrl.getPost);
router.put("/:id", authMiddleware, upload.single("image"), postCtrl.updatePost);
router.delete("/:id", authMiddleware, postCtrl.deletePost);

// comments
router.post("/:id/comments", authMiddleware, postCtrl.addComment);
router.put(
  "/:postId/comments/:commentId",
  authMiddleware,
  postCtrl.updateComment
);
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  postCtrl.deleteComment
);

module.exports = router;
