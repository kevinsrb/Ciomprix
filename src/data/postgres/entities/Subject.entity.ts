import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, BaseEntity, OneToMany,CreateDateColumn, UpdateDateColumn } from "typeorm"

import { User } from "./User.entity";
import { Evidence } from "./Evidence.entity";


@Entity({name: 'subjects'})
export class Subject extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

     @Column({nullable: false})
     period!: string;

     @Column({default: true})
     active!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;


    @OneToMany(()=> Evidence, (evidence) => evidence.subject)
    evidence?: Evidence[]

    @ManyToMany(() => User)
    users?: User[]
 
}