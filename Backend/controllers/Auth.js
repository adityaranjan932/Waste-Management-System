const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");    // to generate signed token
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
require("dotenv").config()

exports.sendOTP = async (req, res) => {
    try {
        console.log("Processing sendOTP request...");
        const { phoneNumber } = req.body; // use phoneNumber instead of email

        // Optionally, check if the phone number is already registered in the User collection
        const checkUserPresent = await User.findOne({ contactNumber: phoneNumber });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: `User is already registered`,
            });
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated", otp);

        // Ensure OTP uniqueness
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { phoneNumber, otp }; // save phoneNumber here
        await OTP.create(otpPayload);
        console.log(otpPayload);

        console.log("OTP sent successfully");
        return res.status(200).json({
            success: true,
            message: `OTP sent successfully`,
            otp,
        });
    } catch (error) {
        console.error("Error in sendOTP:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//sign up
exports.signUp = async (req, res) => {
    try {
        console.log("Processing signUp request...");

        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        // Verify OTP using contactNumber instead of email
        const response = await OTP.find({ phoneNumber: contactNumber }).sort({ createdAt: -1 }).limit(1);

        if (response.length === 0 || response[0].otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid or has expired",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNumber, // Store the contact number in the profile
        });

        // Create user in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            approved: false, // Default value for approval
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        console.log("User registered successfully");
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Error in signUp:", error.message);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};


//login

exports.login = async (req, res) => {
    try {
        console.log("Processing login request...");
        //get email and passowrd from req.body
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            })
        }
        //find user with provided email
        const user = await User.findOne({ email }).populate("additionalDetails")
        // If user not found with provided email

        if (!user) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            })
        }
        // Generate JWT token and Compare Password

        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                httpOnly: true,
                secure: true, // Use this in production
                expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
            };


            //create cookie and send response 
            console.log("Logged in successfully");
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",

            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'password is incorrect',
            })
        }



    }
    catch (error) {
        console.error("Error in login:", error.message);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        })

    }
}
