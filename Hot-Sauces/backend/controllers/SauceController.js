const SauceModel= require("../models/SauceModel")
const createError = require('http-errors');

    exports.getAllSauces= async(req,res)=>{
        try{
            const sauces = await SauceModel.find();
            res.status(200).json(sauces)
        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }
    },


    exports.getOneSauce= async(req,res)=>{
        try{
            
            const sauce = await SauceModel.findById(req.params.id);
            if(!sauce) return res.status(404).json({message: "Sauce not found"})
            res.status(200).json(sauce);

        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }
    },


    exports.addSauce=async(req,res)=>{
        try{
        
            if(!req.file){
                return res.status(400).json({message: "Please upload an image"})
            }


            const sauceData = JSON.parse(req.body.sauce);
            const { name, manufacturer, description, heat, mainPepper, userId } = sauceData;
            const imageUrl =`${req.protocol}://${req.get('host')}/images/${req.file.filename}`

            const newSauce = new SauceModel({
                name,
                manufacturer,
                description,
                heat,
                likes: 0,
                dislikes: 0,
                imageUrl,
                mainPepper,
                usersLiked: [],
                usersDisliked: [],
                userId: req.auth.userId
            });

            await newSauce.save();

            res.status(201).json({
                message: 'Sauce added successfully',
                sauce: newSauce
            })

        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: err.message})
        }
    },


    exports.updateSauce=async(req,res)=>{
        try{
            const sauce = await SauceModel.findById(req.params.id);
            if (!sauce) {
                return res.status(404).json({ message: 'Sauce not found' });
            }
            
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized to modify this sauce' });
            }
            const updateData = { ...req.body };

                if (req.file) {
                    updateData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                }

                const updatedSauce = await SauceModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

                res.status(200).json({
                    message: 'Sauce updated successfully',
                    sauce: updatedSauce
                });
        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }

    },



    exports.deleteSauce=async(req,res)=>{
        try {
            const sauce = await SauceModel.findById(req.params.id);
            if (!sauce) {
                return res.status(404).json({ message: 'Sauce not found' });
            }
            
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Not authorized to delete this sauce' });
            }
            
            await SauceModel.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: 'Sauce deleted successfully'
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err.message
            });
        }

    },


    exports.likeSauce=async(req,res)=>{
        try {
            const { like } = req.body; 
            const { userId } = req.auth; 
      
            
            const status = [-1, 0, 1];
            if (!status.includes(like)) return res.status(400).json({ error: "Invalid like value" });
      
           
            const sauce = await SauceModel.findById(req.params.id);
            if (!sauce) throw createError(404, "Sauce not found");
      
            
            const { usersLiked, usersDisliked } = sauce;
    
            switch (like) {
              case 1:
                if (usersLiked.includes(userId)) return res.status(400).json({ error: "User already liked the sauce" });
                usersLiked.push(userId);
                break;
                
              case -1:
                
                if (usersDisliked.includes(userId)) return res.status(400).json({ error: "User already disliked the sauce" });
                usersDisliked.push(userId);
                break;
                
              case 0:
                if (usersLiked.includes(userId)) {
                  usersLiked.splice(usersLiked.indexOf(userId), 1);
                } else if (usersDisliked.includes(userId)) {
                  usersDisliked.splice(usersDisliked.indexOf(userId), 1);
                } else {
                  return res.status(400).json({ error: "User has not liked or disliked the sauce" });
                }
                break;
                
              default:
                return res.status(400).json({ error: "Invalid like value" });
            }
            sauce.likes = usersLiked.length;
            sauce.dislikes = usersDisliked.length;
    
            await sauce.save();
            res.status(200).json({ message: "Sauce updated successfully" });

          } catch (err) {
            next(err);
          }
    }

