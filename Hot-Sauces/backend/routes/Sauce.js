const express =require('express');
const router = express.Router();

const {getAllSauces,getOneSauce,addSauce,updateSauce,deleteSauce,likeSauce} = require('../controllers/SauceController');
const {upload} =require('../middleware/Multer-img-upload');
const {auth} =require('../middleware/Auth-middleware');

router.get("/",auth,getAllSauces);
router.get("/:id",auth,getOneSauce);
router.post("/",auth,upload.single('image'),addSauce);
router.put("/:id",auth,upload.single('image'),updateSauce);
router.delete("/:id",auth,deleteSauce);
router.post("/:id/like",auth,likeSauce);

module.exports = router;