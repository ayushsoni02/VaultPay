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
  const { email, password, firstName, lastName } = req.body;


  const requiredBody = z.object({
    email: z.string().email(),
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

     // Check if email already exists in the database
     const existingUser = await userModel.findOne({ email });
     if (existingUser) {
       return res.status(409).json({
         message: "email is already taken. Please choose a different one."
       });
     }

     console.log("pass the existingUser");
     
    


   const user =  await userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword
    });

    console.log("pass the user");

    if (!user || !user._id) {
      return res.status(500).json({ message: "User creation failed" });
    }
 
     console.log("pass the user_id");

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

      // localStorage.setItem("token", response.data.token);

    res.json({
      message: "Signup succeeded",
      token
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "email already taken or incorrect input"
    });
  }
});


  //             -----  signin route -------


userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if user exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found. Please check your email."
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
        { userId: user._id, email: user.email },
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
          email: user.email,
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
        const userId = req.userId; 

        const query = filter ? {
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ],
            _id: { $ne: userId } // Exclude the logged-in user
        } : { _id: { $ne: userId } };

        const users = await userModel.find(query).select("email firstName lastName _id").lean();

        res.json({ user: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// --------------   /me route  --------------


userRouter.get('/me', userMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("firstName lastName email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = {
    userRouter: userRouter
}


