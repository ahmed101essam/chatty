import User from "../models/User";
import Message from "../models/Message";
import cloudinary from "../lib/cloudinary";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const allUsers = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password",
    );
    res.status(200).json(allUsers);
  } catch (error) {
    console.log("Error in getAllContacts controller: ", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getChatPartnerIds = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const partners = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUser }, { receiverId: loggedInUser }],
        },
      },
      {
        $project: {
          partnerId: {
            $cond: [
              { $eq: ["$senderId", loggedInUser] },
              "$receiverId",
              "$senderId",
            ],
          },
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: "$partnerId",
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    const partnerIds = partners.map((p) => p._id);

    const users = await User.find({ _id: { $in: partnerIds } }).select(
      "fullName email profilePic",
    );

    // preserve sort order from activity
    const orderedUsers = partnerIds.map((id) =>
      users.find((u) => u._id.toString() === id.toString()),
    );

    res.status(200).json({
      chatPartners: orderedUsers.filter(Boolean),
    });
  } catch (error) {
    console.log("Error in getChatPartnerIds controller: ", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
