import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.tokenData?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not allowed"
      });
    }
    next(); 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking admin role",
      error: error
    });
  }
};