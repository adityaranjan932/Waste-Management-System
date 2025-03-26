const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");    // to generate signed token
const OTP = require("../models/OTP");
require("dotenv").config()

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        //check if the user is already present 
        const checkUserPresent = await User.findOne({ email });

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

        //check unique otp 
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        //create an entry in DB
        await OTP.create(otpPayload);
        console.log(otpPayload);

        return res.status(200).json({
            success: true,
            message: `Otp sent successfully`,
            otp,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//sign up
exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;
        
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        
        // Find the most recent OTP
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        } else if (otp !== response[0].otp) { // FIX: response is an array, so accessing otp correctly
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        
        // Hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create profile entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNumber: null,
        });
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType: accountType,
            approved: false, // FIX: assigned a default value for 'approved' as it was undefined
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

//login

//login

exports.login = async(req,res) =>{
    try{
      //get email and passowrd from req.body
      const{email,password} = req.body;
  
      if(!email ||!password){
        return res.status(400).json({
          success:false,
          message:`Please Fill up All the Required Fields`,
        })
      }
      //find user with provided email
      const user = await User.findOne({email}).populate("additionalDetails")
          // If user not found with provided email
  
      if (!user) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is not Registered with Us Please SignUp to Continue`,
        })
      }
        // Generate JWT token and Compare Password
  
        if(await bcrypt.compare(password, user.password)){
  
          const payload = {
            email:user.email,
            id:user._id,
            accountType:user.accountType,
          }
          const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
          });
          user.token = token;
          user.password = undefined;
  
          const options = {
            httpOnly: true,
            secure: true, // Use this in production
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
          };
          
  
          //create cookie and send response 
          res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully",
            
          })
        }
        else{
          return res.status(401).json({
            success:false,
              message:'password is incorrect',
          })
        }
  
  
  
    }
    catch(error){
      console.error(error)
      // Return 500 Internal Server Error status code with error message
      return res.status(500).json({
        success: false,
        message: `Login Failure Please Try Again`,
      })
  
    }
  }
  