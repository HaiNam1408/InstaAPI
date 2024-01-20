const router = require("express").Router();
const postController = require("../controllers/postControllers");
const handleDeleteFile = require("../middlewares/deleteFile");
const handleUpdateFile = require("../middlewares/updateFile");
const uploadFile = require("../middlewares/uploadFile");
const { verifyToken } = require("../middlewares/verify");

router.get("/", postController.getAllPost);
router.get("/:id", verifyToken, postController.getPostById);
router.get("/user/:id", verifyToken, postController.getPostByUserId);
router.post("/create", verifyToken, uploadFile, postController.create);
router.put(
  "/:id",
  verifyToken,
  uploadFile,
  handleUpdateFile,
  postController.update
);
router.delete("/:id", verifyToken, handleDeleteFile, postController.delete);
module.exports = router;
