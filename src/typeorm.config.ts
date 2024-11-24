import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './user/user.entity';
import { CatalogEntity } from './catalog/catalog.entity';
import { LocaleEntity } from './locale/locale.entity';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'testDB',
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
  entities: [UserEntity, CatalogEntity, LocaleEntity],
  migrationsRun: false,
};

const AppDataSource = new DataSource(config);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
