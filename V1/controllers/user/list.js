import Waitlist from "../../models/Waitlist.js";

export const saveWaitlist = async (req, res) => {
    
  try {
    const saveList = new Waitlist(req.body);
    await saveList.save();
    const data = {
        message: "Thank you for joining our waitlist! We are on the edge of something new and can't wait to share our updates with you.",
        status: true,
        data: saveList
    };
    res.status(201).json(data);
    console.log('Waitlist saved successfully');
  } catch (error) {
    res.status(500).json({ message: 'Error saving waitlist', error });
    console.error('Error saving waitlist', error);
  }
};