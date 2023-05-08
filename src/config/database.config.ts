import 'dotenv/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { User } from '../app/user/entities/user.entity';
import { Role } from '../app/roles/entities/role.entity';
import { Image } from '../app/image/entities/image.entity';

const databaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Role, Image],
  synchronize: false,
  migrations: [],
};

export default databaseConfig;
