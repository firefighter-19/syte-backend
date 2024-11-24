import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'testDB',
  synchronize: false,
  migrations: [__dirname + '/migrations/*.js'],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrationsRun: true,
  metadataTableName: 'migrations_metadata',
  logging: ['query', 'error', 'migration'],
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
