import { Request, Response } from 'express';
import { Between, IsNull, Not } from "typeorm";
import { administration } from "./administration";
import { access } from "../access/access";
import { person } from '../person/person';
import { room } from '../room/room';


export const generateDailyReport = async (req: Request, res: Response) => {
    try {
        const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Madrid"}));
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 1. Obtener los accesos del día con detalles
        const accesses = await access.find({
            where: {
                entry_datetime: Between(today, tomorrow),
                exit_datetime: Not(IsNull()),
            },
            relations: ['person', 'room']
        });

        const totalAccesses = accesses.length;

        // 2. Obtener las ausencias (reservas canceladas) con detalles
        const absences = await access.find({
            where: {
                entry_datetime: Between(today, tomorrow),
                state: 'cancelled'
            },
            relations: ['person', 'room']
        });

        const totalAbsences = absences.length;

        // 3. Obtener todos los usuarios con actividad en el día
        const allActiveUsers = await access.createQueryBuilder("access")
            .select("access.person_id", "userId")
            .addSelect("COUNT(*)", "accessCount")
            .addSelect("person.name", "name")
            .addSelect("person.surnames", "surnames")
            .innerJoin("access.person", "person")
            .where("access.entry_datetime BETWEEN :start AND :end", { start: today, end: tomorrow })
            .groupBy("access.person_id")
            .addGroupBy("person.name")
            .addGroupBy("person.surnames")
            .orderBy("accessCount", "DESC")
            .getRawMany();

        // 4. Separar usuarios frecuentes e infrecuentes
        const frequentUsers = allActiveUsers.filter(user => parseInt(user.accessCount) > 1);
        const infrequentUsers = allActiveUsers.filter(user => parseInt(user.accessCount) <= 1);

        // 5. Preparar datos detallados para la respuesta
        const detailedReport = {
            report_date: today,
            total_accesses: totalAccesses,
            total_absences: totalAbsences,
            accesses: accesses.map(a => ({
                person: `${a.person.name} ${a.person.surnames}`,
                room: a.room.room_name,
                entry_time: a.entry_datetime,
                exit_time: a.exit_datetime
            })),
            absences: absences.map(a => ({
                person: `${a.person.name} ${a.person.surnames}`,
                room: a.room.room_name,
                scheduled_entry_time: a.entry_datetime,
            })),
            frequent_users: frequentUsers.map(u => ({
                name: `${u.name} ${u.surnames}`,
                accessCount: parseInt(u.accessCount)
            })),
            infrequent_users: infrequentUsers.map(u => ({
                name: `${u.name} ${u.surnames}`,
                accessCount: parseInt(u.accessCount)
            }))
        };

        // 6. Guardar el informe en la base de datos
        const newReport = new administration();
        newReport.report_date = today;
        newReport.total_accesses = totalAccesses;
        newReport.total_absences = totalAbsences;
        newReport.frequent_users = JSON.stringify(detailedReport.frequent_users);
        newReport.infrequent_users = JSON.stringify(detailedReport.infrequent_users);
        await newReport.save();

        // 7. Responder
        res.status(201).json({
            success: true,
            message: "Daily report generated and saved successfully",
            data: detailedReport
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error generating daily report",
            error: error 
        });
    }
};

export const getRoomUsageStats = async (req: Request, res: Response) => {
    try {
        // 1. Calcular el primer día del mes actual y el día actual
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // 2. Obtener todos los accesos desde el inicio del mes hasta hoy
        const accesses = await access.find({
            where: {
                entry_datetime: Between(startDate, endDate)
            },
            relations: ['room']
        });

        // 3. Obtener todas las salas
        const rooms = await room.find();

        // 4. Calcular el número de días transcurridos en el mes
        const daysInPeriod = now.getDate();

        // 5. Calcular estadísticas para cada sala
        const roomStats = rooms.map(room => {
            const roomAccesses = accesses.filter(a => a.room.id === room.id);
            const completedAccesses = roomAccesses.filter(a => a.exit_datetime !== null);
            const cancelledAccesses = roomAccesses.filter(a => a.state === 'cancelled');
            const totalAccesses = roomAccesses.length - cancelledAccesses.length;

            // Calcular horas totales de uso y duración promedio solo para accesos completados
            let totalHours = 0;
            let totalDuration = 0;

            completedAccesses.forEach(a => {
                if (a.exit_datetime) {
                    const duration = (a.exit_datetime.getTime() - a.entry_datetime.getTime()) / (1000 * 60 * 60);
                    totalHours += duration;
                    totalDuration += duration;
                }
            });

            const averageDuration = completedAccesses.length > 0 ? totalDuration / completedAccesses.length : 0;

            return {
                room_id: room.id,
                room_name: room.room_name,
                total_accesses: totalAccesses,
                completed_accesses: completedAccesses.length,
                cancelled_accesses: cancelledAccesses.length,
                total_hours_used: parseFloat(totalHours.toFixed(2)),
                average_duration: parseFloat(averageDuration.toFixed(2))
            };
        });

        // 6. Calcular estadísticas globales
        const totalAccesses = roomStats.reduce((sum, stat) => sum + stat.total_accesses, 0);
        const totalCancellations = roomStats.reduce((sum, stat) => sum + stat.cancelled_accesses, 0);
        const totalHoursUsed = roomStats.reduce((sum, stat) => sum + stat.total_hours_used, 0);

        // 7. Preparar la respuesta
        const response = {
            period: `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
            days_in_period: daysInPeriod,
            total_accesses: totalAccesses,
            total_cancellations: totalCancellations,
            total_hours_used: parseFloat(totalHoursUsed.toFixed(2)),
            room_stats: roomStats
        };

        // 8. Enviar la respuesta
        res.status(200).json({
            success: true,
            message: "Room usage statistics from the beginning of the month to today retrieved successfully",
            data: response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error retrieving room usage statistics",
            error: error
        });
    }
};

export const getDateReport = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            return res.status(400).json({
                success: false,
                message: "Both start_date and end_date are required in the request body"
            });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        endDate.setHours(23, 59, 59, 999);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        // 1. Obtener los accesos del período con detalles
        const accesses = await access.find({
            where: {
                entry_datetime: Between(startDate, endDate),
                exit_datetime: Not(IsNull()),
            },
            relations: ['person', 'room']
        });

        const totalAccesses = accesses.length;

        // 2. Obtener las ausencias (reservas canceladas) con detalles
        const absences = await access.find({
            where: {
                entry_datetime: Between(startDate, endDate),
                state: 'cancelled'
            },
            relations: ['person', 'room']
        });

        const totalAbsences = absences.length;

        // 3. Obtener todos los usuarios con actividad en el período
        const allActiveUsers = await access.createQueryBuilder("access")
            .select("access.person_id", "userId")
            .addSelect("COUNT(*)", "accessCount")
            .addSelect("person.name", "name")
            .addSelect("person.surnames", "surnames")
            .innerJoin("access.person", "person")
            .where("access.entry_datetime BETWEEN :start AND :end", { start: startDate, end: endDate })
            .groupBy("access.person_id")
            .addGroupBy("person.name")
            .addGroupBy("person.surnames")
            .orderBy("accessCount", "DESC")
            .getRawMany();

        // 4. Separar usuarios frecuentes e infrecuentes
        const averageAccesses = allActiveUsers.reduce((sum, user) => sum + parseInt(user.accessCount), 0) / allActiveUsers.length;
        const frequentUsers = allActiveUsers.filter(user => parseInt(user.accessCount) > averageAccesses);
        const infrequentUsers = allActiveUsers.filter(user => parseInt(user.accessCount) <= averageAccesses);

        // 5. Preparar datos detallados para la respuesta
        const detailedReport = {
            report_period: {
                start_date: startDate,
                end_date: endDate
            },
            total_accesses: totalAccesses,
            total_absences: totalAbsences,
            accesses: accesses.map(a => ({
                person: `${a.person.name} ${a.person.surnames}`,
                room: a.room.room_name,
                entry_time: a.entry_datetime,
                exit_time: a.exit_datetime
            })),
            absences: absences.map(a => ({
                person: `${a.person.name} ${a.person.surnames}`,
                room: a.room.room_name,
                scheduled_entry_time: a.entry_datetime,
            })),
            frequent_users: frequentUsers.map(u => ({
                name: `${u.name} ${u.surnames}`,
                accessCount: parseInt(u.accessCount)
            })),
            infrequent_users: infrequentUsers.map(u => ({
                name: `${u.name} ${u.surnames}`,
                accessCount: parseInt(u.accessCount)
            }))
        };

        // 6. Guardar el informe en la base de datos
        const newReport = new administration();
        newReport.report_date = startDate;
        newReport.total_accesses = totalAccesses;
        newReport.total_absences = totalAbsences;
        newReport.frequent_users = JSON.stringify(detailedReport.frequent_users);
        newReport.infrequent_users = JSON.stringify(detailedReport.infrequent_users);
        await newReport.save();

        // 7. Responder
        res.status(201).json({
            success: true,
            message: "Custom report generated and saved successfully",
            data: detailedReport
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error generating custom report",
            error: error
        });
    }
};