import { Request, Response } from 'express';
import { access } from '../access/access';
import { room } from '../room/room';
import { accessHistory } from '../accessHistory/accessHistory';
import { IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual } from 'typeorm';

export const registerEntry = async (req: Request, res: Response) => {
    try {
        
        const { room_id } = req.body;
        const person_id = req.tokenData.id;

        
        if (!room_id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }
        if (!person_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        
        const roomExists = await room.findOne({ where: { id: room_id } });
        if (!roomExists) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        
        const activeEntry = await access.findOne({
            where: {
                person_id: person_id,
                state: 'active',
                exit_datetime: IsNull()
            }
        });
        if (activeEntry) {
            return res.status(400).json({
                success: false,
                message: "User already has an active entry or reservation"
            });
        }

        
        const currentOccupancy = await access.count({
            where: {
                room_id: room_id,
                state: 'active',
                exit_datetime: IsNull()
            }
        });

        if (currentOccupancy >= roomExists.capacity) {
            return res.status(400).json({
                success: false,
                message: "Room capacity exceeded"
            });
        }

        
        const currentDate = new Date();
        const newEntry = new access();
        newEntry.person_id = person_id;
        newEntry.room_id = room_id;
        newEntry.entry_datetime = currentDate;
        newEntry.state = 'active';
        await newEntry.save();

        
        res.status(201).json({
            success: true,
            message: "Entry registered successfully",
            data: newEntry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error when registering the entry",
            error: error
        });
    }
}


export const registerExit = async (req: Request, res: Response) => {
    try {
        
        const { room_id } = req.body;
        const person_id = req.tokenData.id;

        
        if (!room_id) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required"
            });
        }
        if (!person_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        
        const roomExists = await room.findOne({ where: { id: room_id } });
        if (!roomExists) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const currentDate = new Date();

        
        const activeEntry = await access.findOne({
            where: {
                person_id: person_id,
                room_id: room_id,
                state: 'active',
                exit_datetime: IsNull(),
                entry_datetime: LessThanOrEqual(currentDate)
            }
        });

        if (!activeEntry) {
            return res.status(400).json({
                success: false,
                message: "No active entry found for this room or it's a future reservation"
            });
        }

        
        activeEntry.exit_datetime = currentDate;
        activeEntry.state = 'inactive';
        await activeEntry.save();

        
        const historyEntry = new accessHistory();
        historyEntry.person_id = person_id;
        historyEntry.room_id = room_id;
        historyEntry.entry_datetime = activeEntry.entry_datetime;
        historyEntry.exit_datetime = currentDate;
        await historyEntry.save();

        
        res.status(200).json({
            success: true,
            message: "Exit registered successfully and added to history",
            data: {
                access: activeEntry,
                historyEntry: historyEntry
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error when registering the exit",
            error: error
        });
    }
};


export const registerReserve = async (req: Request, res: Response) => {
    try {
        
        const { room_id, entry_datetime } = req.body;
        const person_id = req.tokenData.id;

        
        if (!room_id || !entry_datetime) {
            return res.status(400).json({
                success: false,
                message: "Room ID and entry datetime are required"
            });
        }
        if (!person_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const currentDate = new Date();
        const reservationDate = new Date(entry_datetime);

        
        if (reservationDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "Cannot make reservations in the past"
            });
        }

        
        const roomExists = await room.findOne({ where: { id: room_id } });
        if (!roomExists) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        
        const userActiveAccess = await access.findOne({
            where: {
                person_id: person_id,
                state: 'active'
            }
        });
        if (userActiveAccess) {
            return res.status(400).json({
                success: false,
                message: "User already has an active reservation or entry"
            });
        }
        
        const roomActiveAccesses = await access.count({
            where: {
                room_id: room_id,
                state: 'active',
                entry_datetime: MoreThanOrEqual(reservationDate),
                exit_datetime: IsNull()
            }
        });

        if (roomActiveAccesses >= roomExists.capacity) {
            return res.status(400).json({
                success: false,
                message: "Room capacity exceeded for the requested time"
            });
        }

        
        const newReservation = new access();
        newReservation.person_id = person_id;
        newReservation.room_id = room_id;
        newReservation.entry_datetime = reservationDate;
        newReservation.state = 'active';
        await newReservation.save();

        
        res.status(201).json({
            success: true,
            message: "Reservation registered successfully",
            data: newReservation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error when registering the reservation",
            error: error
        });
    }
}


export const cancelReservation = async (req: Request, res: Response) => {
    try {
        
        const reservationId = parseInt(req.params.id);
        const person_id = req.tokenData.id;

        
        if (isNaN(reservationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Reservation ID"
            });
        }
        if (!person_id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const currentDate = new Date();

        
        const reservation = await access.findOne({
            where: {
                id: reservationId,
                entry_datetime: MoreThan(currentDate),
                state: 'active'  
            }
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Future active reservation not found"
            });
        }

        
        if (reservation.person_id !== person_id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this reservation"
            });
        }

        
        reservation.state = 'cancelled';
        await reservation.save();

        
        res.status(200).json({
            success: true,
            message: "Reservation cancelled successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error when cancelling the reservation",
            error: error
        });
    }
}

export const getActiveReservation = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.id; 

        const activeReservation = await access.findOne({
            where: {
                person_id: userId,
                state: 'active',
                entry_datetime: MoreThan(new Date()) 
            }
        });

        res.status(200).json({
            success: true,
            data: activeReservation || null
        });
    } catch (error) {
        console.error('Error getting active reservation:', error);
        res.status(500).json({
            success: false,
            message: "Error getting active reservation",
            error: error
        });
    }
}



export const currentRoomOccupants = async (req: Request, res: Response) => {
    try {
        const room_id = +req.params.room_id;

        if (isNaN(room_id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid room ID"
            });
        }

        
        const roomExists = await room.findOne({ where: { id: room_id } });
        if (!roomExists) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const now = new Date();

        
        const activeAccesses = await access.find({
            where: {
                room_id: room_id,
                state: 'active',
                entry_datetime: LessThanOrEqual(now),
                exit_datetime: IsNull()
            },
            relations: ['person']
        });

        if (activeAccesses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No persons currently in the room",
                data: []
            });
        }

        
        const occupants = activeAccesses.map(entry => ({
            id: entry.person.id,
            name: entry.person.name,
            surnames: entry.person.surnames,
            email: entry.person.email,
            dni: entry.person.dni
        }));

        
        return res.status(200).json({
            success: true,
            message: "Persons currently in the room",
            data: occupants
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error when searching for current occupants",
            error: error
        });
    }
};