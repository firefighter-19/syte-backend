import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { CatalogEntity } from '../catalog/catalog.entity';

@Entity('locale')
export class LocaleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  language!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  code!: string;

  @ManyToMany(() => CatalogEntity, (catalog) => catalog.locales)
  catalog: CatalogEntity[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
