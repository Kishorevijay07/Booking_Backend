import { v2 as cloudinary } from 'cloudinary';
import User from '../model/auth.model.js';
import ListModel from '../model/list.model.js';


export const createListing = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      address,
      location,
      image
    } = req.body;

    const userId = req.user.userid;

    if (
      !title || !price || !description ||
      !address?.street || !address?.area || !address?.city ||
      !location?.lat || !location?.lng
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let imageUrl = "";
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "rooms",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newRoom = new ListModel({
      title,
      price,
      description,
      address,
      location,
      image: imageUrl,
      userId,
    });

    await newRoom.save();
    res.status(201).json({ message: "Room created", room: newRoom });
  } catch (error) {
    console.error("Error in createListing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getalllists=async(req,res)=>{
  const lists = await ListModel.find();
  console.log(lists)
  return res.status(200).json(lists)

}
export const getParticularHotel = async (req, res) => {
  try {
    const { id } = req.params;
    // const userId = req.user?.userid;

    const hotel = await ListModel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }


    return res.status(200).json(hotel);
  } catch (error) {
    console.error("Error in getParticularHotel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
