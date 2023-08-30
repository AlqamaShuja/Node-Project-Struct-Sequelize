const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
// const { uploadFile } = require("../utils/s3");

const { 
    SECRET_ACCESS_TOKEN, ACCESS_TOKEN_EXPIRATION, 
    SECRET_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRATION, 
    COOKIE_DOMAIN, COOKIE_PATH, JWT_SECRET 
} = process.env;

const generateToken = (id) => {
    let token = jwt.sign({ id }, JWT_SECRET, {
        expiresIn: 86400 // 24 hours
    });
    return token;
}

const signinController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // const accessToken = jwt.sign({ id: user.id }, SECRET_ACCESS_TOKEN, {
        //     expiresIn: ACCESS_TOKEN_EXPIRATION,
        // });
        
        // const refreshToken = jwt.sign({ id: user.id }, SECRET_REFRESH_TOKEN, {
        //     expiresIn: REFRESH_TOKEN_EXPIRATION,
        // });
    
        // Set cookies for tokens
        // res.cookie('accessToken', accessToken, { httpOnly: true, domain: COOKIE_DOMAIN, path: COOKIE_PATH });
        // res.cookie('refreshToken', refreshToken, { httpOnly: true, domain: COOKIE_DOMAIN, path: COOKIE_PATH });
        if(!email || !password) return res.status(400).send({ success: false, message: 'Please provide all data' });
        const user = await User.findOne({ 
            where: { email },
        });
        
        if(!user) return res.status(404).send({ success: false, message: 'User not found' });

        const isPasswordMatch = await bcrypt.compare(password, user.dataValues.password);

        if(!isPasswordMatch) return res.status(400).send({ success: false, message: 'Credential does not match' });

        const token = generateToken(user.dataValues.id);
        
        return res.status(500).send({ success: true, message: 'Successfully Login', data: { ...user.toJSON(), token, } });
    } catch (error) {
        return res.status(200).send({ success: false, error: error.message });
    }
}

const signupController = async (req, res) => {
    try {
        const { first_name, last_name, email, password, phone, username, gender } = req.body;
        let fileName = null;

        if(!first_name || !last_name || !username || !gender || !phone || !email || !password) {
            return res.status(400).send({ success: false, message: 'Please provide all data' });
        }

        if (req.file) {
            fileName = Date.now() + '-' + req.file.originalname;
            // avatar = await uploadFile(req.file, fileName)
        }

        const hashPassword = await bcrypt.hash(password, 8);
        const user = await User.create({ first_name, last_name, email, password: hashPassword, phone, username, gender, dp_url: fileName }, { returning: true, raw: true });
        return res.status(200).send({ success: true, message: 'Successfully Signup', data: user.toJSON() });
    } catch (error) {
        return res.status(500).send({ success: false, error: error.message });
    }
}

// Route to refresh access token using refresh token
const generateAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).send({ message: 'Refresh token not provided' });
    }
  
    jwt.verify(refreshToken, SECRET_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: 'Invalid refresh token' });
      }
  
      const accessToken = jwt.sign({ id: decoded.id }, SECRET_ACCESS_TOKEN, {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      });
  
      // Set new access token as cookie
      res.cookie('accessToken', accessToken, { httpOnly: true, domain: COOKIE_DOMAIN, path: COOKIE_PATH });
  
      res.send({ accessToken });
    });
};
  

module.exports = {
    signinController,
    signupController,
    generateAccessToken,
}