import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { person } from "../person/person"
import { room } from "../room/room"

@Entity('accessHistory')
export class accessHistory extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'person_id'})
    person_id!: number

    @Column({ name: 'room_id'})
    room_id!: number

    @Column({ name: 'entry_datetime'})
    entry_datetime!: Date

    @Column({ name: 'exit_datetime'})
    exit_datetime!: Date

    @ManyToOne(() => person, person => person.record)
    @JoinColumn({ name: 'person_id' })
    person!: person;

    @ManyToOne(() => room, room => room.record)
    @JoinColumn({ name: 'room_id' })
    room!: room;
}