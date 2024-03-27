const Feedback = require('../models/feedback.model.js');

const createFeedback = async (req, res) => {
    const { type, message } = req.body;
    const userId = req.user;

    try {
        if (!type || !message) {
            return res.status(400).json({ message: "Please provide all details" });
        }

        const feedback = new Feedback({
            type,
            message,
            userId
        });

        await feedback.save();

        res.status(200).json({
            success: true,
            message: "Feedback successfully saved",
            feedback
        });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    createFeedback
};
