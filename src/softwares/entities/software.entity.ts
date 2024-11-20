import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Software {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    name: string;

    @Column('text', { array: true, nullable: true })
    img_url: string[];

    @Column({ nullable: true })
    description: string;

    @Column('float', { default: 100, nullable: true })
    price: number;

    @Column({ nullable: true, default: 'usd' })
    currency: string;

    @Column({ nullable: true })
    category: string;

    @Column('text', { array: true, default: [] })
    tags: string[];
}
