const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//register controller here
const registerUser = async (req, res) => {
    const { fullName,contactNumber, email, password } = req.body;

    // Check if any of the required parameters are missing
    if (!fullName || !email || !password || !contactNumber) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required details",
        });
    }

    try {
        // Check if the user with the provided email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists",
            });
        }
        if (password.length <= 8) {
            return res.status(400).json({
                success: false,
                message: "password length should be greater than 8 character",
            });
        }

        // Hash the user's password before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance with the hashed password
        const newUser = new User({
            fullName,
            email,
            contactNumber,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch (error) {
        // console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};


//Login controller here
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user provided email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        // Find the user by email or contactNumber
        const user = await User.findOne({
            $or: [{ email: email }, { contactNumber: email }] // Search by email or contactNumber
        });

        // Check if the user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        // User is authenticated; generate a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user, token }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        });
    }
};



//update user details controller here
const updateUserDetails = async (req, res) => {
    const { fullName, oldPassword, newPassword } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (newPassword !== undefined) {
            // Check if old password is provided
            if(newPassword.length <= 8){
                return res.status(400).json({
                    success: false,
                    message: 'new password should be greater than 8 character',
                });
            };
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password is required for password update.',
                });
            }
            
            // Check if the old password matches
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Old password is incorrect',
                });
            }
            // Update the password
            const saltRounds = 10;
            user.password = await bcrypt.hash(newPassword, saltRounds);
        }

        if (fullName !== undefined && fullName.trim() !== '') {
            user.fullName = fullName;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error,
        });
    }
};

//get One User Details
const getOneUser = async (req, res) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Return the user data
        res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error,
        });
    }
};




module.exports = {
    registerUser,
    loginUser,
    updateUserDetails,
    getOneUser
}