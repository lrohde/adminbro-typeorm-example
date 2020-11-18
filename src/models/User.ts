import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsEmail } from 'class-validator';

export enum UserRole {
  ADMIN = "admin",
  RESTRICTED = "restricted",
}

@Entity('users')
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  encryptedPassword: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.ADMIN
  })
  role: UserRole
}

export default User;