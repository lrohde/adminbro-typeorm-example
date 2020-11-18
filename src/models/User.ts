import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity('users')
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsEmail()
  @Column({ type: 'varchar' })
  email: string;
}

export default User;