const userCollection = require('../models/userSchema')
const bcrypt = require('bcrypt');

const addUser = async (req,res) => {
    try{
        const {data} = req.body
        const email = data.email

        const isUserExist = await userCollection.findOne({email})

        if(isUserExist) {
            return res.status(400).json({ message: 'User Exist' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userData = {
            name: data.name,
            email: data.email,
            location: data.location,
            password: hashedPassword
        }

        await userCollection.insertMany([userData])
        return res.status(201).json({ message: 'User signed up successfully' });
    }
    catch(err){
        console.log(err);
    }

}

const editUser = async (req, res) => {
    try {
        const { data, userId } = req.body;

        console.log("Received request to edit user with ID:", userId);
        console.log("Updating with data:", data);

        const userData = {};
        let email;

        if (data.name != '') {
            userData.name = data.name;
        }
        
        if (data.email != '') {
            userData.email = data.email;
            email = data.email;
        }
        
        if (data.location != '') {
            userData.location = data.location;
        }

        console.log(55,email);
        if(email){
            const isExist = await userCollection.findOne({email})
            console.log(999,isExist);
            if(isExist){
                return res.status(400).json({ message: "User Exist"});
            }
        }
        
        
        const updatedUser = await userCollection.findOneAndUpdate(
            { _id: userId },
            { $set: userData },
            { new: true }
        );
        

        console.log("User updated successfully:", updatedUser);
        res.status(200).json({ message: "User updated successfully"});
    } catch (err) {
        console.error("Error editing user:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteUser = async (req,res) => {
    try{
        const {id} = req.body
        await userCollection.deleteOne({_id:id})
        res.status(200).json({ message: "User Deleted"});
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    addUser,editUser,deleteUser
}