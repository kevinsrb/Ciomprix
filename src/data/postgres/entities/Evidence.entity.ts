import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, BaseEntity, JoinColumn } from "typeorm"
import { Subject } from './Subject.entity';
import { User } from "./User.entity";


export enum FormatFile {
  PNG = "png",
  JPG = "jpg",
  JPEG = "jpeg",
  PDF = "pdf",
}

@Entity({name: 'evidences'})
export class Evidence extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    filename!: string;


    @Column({default: 0})
    size!: number;

    @Column({
        type: "enum",
        enum: FormatFile,
      })
    format?: FormatFile;

    @Column({default: true})
    active!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.evidences)
    @JoinColumn({ name: "user_id" })
    user?: User;


    @ManyToOne(()=> Subject, (subject) => subject.evidence)
    @JoinColumn({ name: "subject_id" })
    subject?: Subject
 
    
}