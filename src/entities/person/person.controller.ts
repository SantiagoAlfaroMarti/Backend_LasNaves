import { Request, Response } from 'express';
import { access } from '../access/access'; 
import { person } from '../person/person';
import { IsNull } from 'typeorm';
import { accessHistory } from '../accessHistory/accessHistory';

export const getCurrentAccess = async (req: Request, res: Response) => {
    try {
        const person_id = +req.params.id;

        if (isNaN(person_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid person ID"
            });
        }

        
        const personInfo = await person.findOne({ 
            where: { id: person_id },
            select: ['id', 'name', 'surnames', 'email', 'dni']
        });

        if (!personInfo) {
            return res.status(404).json({
                success: false,
                message: "Person not found"
            });
        }

        
        const currentAccess = await access.findOne({
            where: {
                person_id: person_id,
                state: 'active',
                exit_datetime: IsNull()
            },
            relations: ['room']
        });

        
        let accessInfo;
        if (currentAccess) {
            accessInfo = {
                access_id: currentAccess.id,
                room_id: currentAccess.room.id,
                room_name: currentAccess.room.room_name,
                entry_datetime: currentAccess.entry_datetime
            };
        }
        const response = {
            person: personInfo,
            current_access: accessInfo || null
        };

        
        return res.status(200).json({
            success: true,
            message: "Current access retrieved successfully",
            data: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting current access",
            error: error
        });
    }
};

export const getAccessHistory = async (req: Request, res: Response) => {
    try {
        const person_id = +req.params.id;

        if (isNaN(person_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid person ID"
            });
        }

        
        const personInfo = await person.findOne({ 
            where: { id: person_id },
            select: ['id', 'name', 'surnames', 'email', 'dni']
        });
        if (!personInfo) {
            return res.status(404).json({
                success: false,
                message: "Person not found"
            });
        }

        
        const accessHistoryList = await accessHistory.find({
            where: { person_id: person_id },
            relations: ['room'],
            order: { entry_datetime: 'DESC' }
        });

        
        const formattedHistory = accessHistoryList.map(entry => ({
            access_id: entry.id,
            room_id: entry.room.id,
            room_name: entry.room.room_name,
            entry_datetime: entry.entry_datetime,
            exit_datetime: entry.exit_datetime
        }));

        const response = {
            person: personInfo,
            access_history: formattedHistory
        };

        
        return res.status(200).json({
            success: true,
            message: "Access history retrieved successfully",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error getting access history",
            error: error
        });
    }
};