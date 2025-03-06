import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToOne(() => Permission, (permission) => permission.role, {
    cascade: ['insert', 'update', 'remove'], // Enable cascading operations
    eager: true, // Enable eager loading here
    onDelete: 'CASCADE', // Cascade delete
    nullable: true, // Allow null permissions
  })
  @JoinColumn()
  permission: Permission;
}
