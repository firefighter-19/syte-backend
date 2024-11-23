import { LocaleEntity } from 'src/locale/locale.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('catalog')
export class CatalogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name!: string;

  @Column({
    type: 'enum',
    enum: ['fashion', 'home', 'general'],
    nullable: false,
  })
  vertical!: 'fashion' | 'home' | 'general';

  @Column({ type: 'boolean', default: false, nullable: false })
  is_primary!: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  created_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    default: new Date().toJSON(),
  })
  indexed_at!: Date;

  @ManyToMany(() => LocaleEntity, (locale) => locale.catalog, { cascade: true })
  @JoinTable({ name: 'catalog_locale' })
  locales: LocaleEntity[];

  @ManyToMany(() => UserEntity, (user) => user.catalog)
  user: UserEntity[];
}
