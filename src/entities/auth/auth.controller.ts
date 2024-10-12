import { Request, Response } from "express";
import { person } from "../person/person";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {

        
        const { email, password, name, surnames, startup, dni, phone, role } = req.body;

        
        if (!email || !password || !name || !surnames || !dni) {
            return res.status(400).json({
                success: false,
                message: "Name, surnames, email, password, and DNI are required",
            });
        }
        if (password.length < 9 || password.length > 17) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 9 and 17 characters",
            });
        }

       
        const hashedPassword = bcrypt.hashSync(password, 10);

        
        const newUser = await person.create({
            email,
            password: hashedPassword,
            name,
            surnames,
            startup,
            dni,
            phone,
            role: role || 'user',
        }).save();

       
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "User cannot be registered",
            error: error,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        
        const user = await person.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }

       
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Email or password is incorrect"
            });
        }

        
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "2h"
            }
        );

        
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token: token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occurred during login",
            error: error
        });
    }
};