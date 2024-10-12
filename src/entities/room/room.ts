import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { access } from "../access/access"
import { accessHistory } from "../accessHistory/accessHistory"

@Entity('room')
export class room extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'room_name' })
    room_name!: string;

    @Column({ name: 'capacity' })
    capacity!: number;

    @Column({ name: 'room_type' })
    room_type!: string;

    @OneToMany(() => access, access => access.person)
    accesses!: access[];

    @OneToMany(() => accessHistory, accessHistory => accessHistory.room)
    record!: accessHistory[];
}