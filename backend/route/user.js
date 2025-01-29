const { Router } = require('express');
const userRouter = Router();
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { z } = require('zod');
const { userModel, AccountModel } = require('../db.js');
const { JWT_SECRET } = require('../config.js');
const { userMiddleware } = require('../middleware.js');


//                    ----        sign out  route   ---------

userRouter.post('/signup', async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;


  const requiredBody = z.object({
    userName: z.string().min(4, "Username must be at least 4 characters long"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string()
      .min(6, "Password should be at least 6 characters long")
      .regex(/[A-Z]/, "Password should contain at least one uppercase letter")
      .regex(/[a-z]/, "Password should contain at least one lowercase letter")
  });


  const parsedData = requiredBody.safeParse(req.body);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: errorMessages
    });
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  try {

     // Check if username already exists in the database
     const existingUser = await userModel.findOne({ userName });
     if (existingUser) {
       return res.status(409).json({
         message: "Username is already taken. Please choose a different one."
       });
     }
    
   const user =  await userModel.create({
      userName,
      firstName,
      lastName,
      password: hashedPassword
    });

    if (!user || !user._id) {
      return res.status(500).json({ message: "User creation failed" });
    }

    await AccountModel.create({
      userId:user._id,
      balance: Math.floor(1 + Math.random() * 10000)
    })

    const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Should be true in production
        maxAge: 3600000, 
        sameSite: 'strict'
      });

  
    res.json({
      message: "Signup succeeded",
      token
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Username already taken or incorrect input"
    });
  }
});


  //             -----  signin route -------


userRouter.post('/signin', async (req, res) => {
    const { userName, password } = req.body;
  
    try {
      // Check if user exists
      const user = await userModel.findOne({ userName });
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please check your username."
        });
      }
  
      // Compare passwords
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid credentials. Please try again."
        });
      }

      
      // Generate a token
      const token = jwt.sign(
        { userId: user._id, userName: user.userName },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, 
        sameSite: 'strict'
      });
      
      res.json({
        message: "Signin succeeded",
        token,
        user: {
          id: user._id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error("Error during signin:", error);
      res.status(500).json({
        message: "Internal server error. Please try again later."
      });
    }
  });


              //      --- logout route  --- 

              userRouter.post('/logout', (req, res) => {
                res.cookie('token', '', { maxAge: 0 }); // Expire the cookie immediately
                res.json({ message: "Logged out successfully" });
              });



             //  ---- for updating database  ------


const updateBody = z.object({
  password: z.string().min(5).optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional()
});

userRouter.put('/', userMiddleware, async (req, res) => {
  
  const parsedData = updateBody.safeParse(req.body);
  if (!parsedData.success) {
      return res.status(411).json({
          message: "Error while updating values",
          error: parsedData.error.errors 
      });
  }

  // Whitelist allowed fields for update
  const updateData = {};

  if (req.body.firstName) updateData.firstName = req.body.firstName;
  if (req.body.lastName) updateData.lastName = req.body.lastName;
  if (req.body.password) updateData.password = await bcrypt.hash(req.body.password, 10); 

  try {
      // Update the user in the database
      await userModel.updateOne({ _id: req.userId }, { $set: updateData });

      res.json({
          message: "Updated successfully!"
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: "Error updating user"
      });
  }
});



  //          ----  get route  ------           

  userRouter.get('/bulk', userMiddleware, async (req, res) => {
    try {
       const filter = req.query.filter || ""; 
 
       
       const query = filter ? {
          $or: [
             { firstName: { "$regex": filter, "$options": "i" } },
             { lastName: { "$regex": filter, "$options": "i" } }
          ]
       } : {}; // If no filter, return all users
 
       const users = await userModel.find(query);
 
       res.json({
          users: users.map(user => ({
             userName: user.userName,
             firstName: user.firstName,
             lastName: user.lastName,
             _id: user._id
          }))
       });
 
    } catch (error) {
       console.error("Error fetching users:", error);
       res.status(500).json({ message: "Internal Server Error" });
    }
 });
 


module.exports = {
    userRouter: userRouter
}


