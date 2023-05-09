import 'dotenv/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// ========================== entities ==========================
import { UserEntity } from '../app/users/entities/user.entity';
import { RoleEntity } from '../app/roles/entities/role.entity';
import { ImageEntity } from '../app/image/entities/image.entity';

// ========================== migrations ==========================
import { $migration1683541698398 } from '../../migrations/1683541698398-$migration';
import { $migration1683544503000 } from '../../migrations/1683544503000-$migration';

const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [UserEntity, RoleEntity, ImageEntity],
  synchronize: false,
  migrations: [$migration1683541698398, $migration1683544503000],
};

export default databaseConfig;
