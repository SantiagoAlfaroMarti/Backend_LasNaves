import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { person } from "../person/person"
import { room } from "../room/room"

@Entity('access')
export class access extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'person_id'})
    person_id!: number

    @Column({ name: 'room_id'})
    room_id!: number

    @Column({ name: 'entry_datetime'})
    entry_datetime!: Date

    @Column({ name: 'exit_datetime', type: 'datetime', nullable: true })
    exit_datetime!: Date | null;

    @Column({
        type: "enum",
        enum: ["active", "inactive", "cancelled"],
        default: "active",
        name: 'state'
    })
    state!: 'active' | 'inactive'| 'cancelled';

    @ManyToOne(() => person)
    @JoinColumn({ name: 'person_id' })
    person!: person;

    @ManyToOne(() => room)
    @JoinColumn({ name: 'room_id' })
    room!: room;
}