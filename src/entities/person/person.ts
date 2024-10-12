import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { access } from "../access/access"
import { accessHistory } from "../accessHistory/accessHistory"

@Entity('person')
export class person extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ name: 'name' })
    name!: string

    @Column({ name: 'surnames' })
    surnames!: string

    @Column({ name: 'password' })
    password!: string

    @Column({ name: 'startup' })
    startup!: string

    @Column({ name: 'email' })
    email!: string

    @Column({ name: 'dni' })
    dni!: string

    @Column({ name: 'phone' })
    phone!: string

    @Column({
        type: "enum",
        enum: ["user", "admin"],
        default: "user",
        name: 'role'
    })
    role!: 'user' | 'admin';

    @OneToMany(() => access, access => access.person)
    accesses!: access[];

    @OneToMany(() => accessHistory, accessHistory => accessHistory.person)
    record!: accessHistory[];
}