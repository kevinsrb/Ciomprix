import { Entity, Column, PrimaryGeneratedColumn, ManyToMany,JoinTable, BaseEntity, UpdateDateColumn, CreateDateColumn, OneToMany  } from "typeorm"
import { Subject } from "./Subject.entity";
import { Evidence } from "./Evidence.entity";

export enum UserRole {
  ADMIN = "admin",
  STUDENT = "student",
}


@Entity({name: 'users'})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 50})
    name!: string;

    @Column({ type: "varchar", length: 50})
    lastname!: string;

    @Column({ type: "varchar", length: 150, unique: true})
    email!: string;

    @Column({ type: "varchar", length: 15, unique: true})
    identification!: string;

    @Column({ type: "varchar", length: 10})
    phone!: string;


    @Column({unique: true})
    password!: string;

    @Column({nullable: true})
    birthdate!: Date;

    @Column({default: true})
    active!: boolean;

    @Column({
      type: "enum",
      enum: UserRole,
      default: UserRole.STUDENT,
    })
    role?: UserRole

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Evidence, evidence => evidence.user)
    evidences?: Evidence[];

    @ManyToMany(() => Subject)
    @JoinTable({
      name: 'user_subject',
      joinColumn: {
        name: 'user_id'
      },
      inverseJoinColumn: {
        name: 'subject_id'
      }
    })
    subject?: Subject[]

 

}