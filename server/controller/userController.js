const userCollection = require('../models/userSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-key';


const signup = async(req,res) => {
    const data = req.body

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword
    }

    await userCollection.insertMany([userData])
    res.status(201).json({ message: 'User signed up successfully' });
}

const login = async(req,res) => {

    const {email,password} = req.body
    const user = await userCollection.findOne({email})

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    else{
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });

        // res.status(201).json({ message: 'User signed up successfully' ,user});
    }
}

const profileUpload = async (req, res) => {
    try {
      const uploadedFile = req.file;
      const email = req.query.email
        
        await userCollection.findOneAndUpdate(
        { email },
        { $set: { profilePicture: uploadedFile.filename } },
        { new: true }
        );
  
      res.status(200).send('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).send('Internal Server Error');
    }
};

const getProfile = async (req,res) => {
    try {
        const email = req.body.email;
        const data = await userCollection.findOne({email})
        res.status(200).json(data);
      } 
      catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).send('Internal Server Error');
      }
}

const editProfile = async (req,res) => {
    const data = req.body
    const email = data.email
    const updateData = data.updateData
    const newEmail = data.updateData.email
    await userCollection.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true }
    );
    const user = await userCollection.findOne({email:newEmail})
    const token = jwt.sign({ email: updateData.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({user,token});
}

const users = async (req,res) =>{
    const user = await userCollection.find()
    res.status(200).json({user});
}
  

module.exports = {
signup,login,profileUpload,getProfile,editProfile,users
}