import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { RoleModule } from './app/roles/role.module';
import { UserModule } from './app/user/user.module';
import { SecurityModule } from './app/security/security.module';
import { AuthModule } from './app/auth/auth.module';
import { ImageModule } from './app/image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    RoleModule,
    UserModule,
    SecurityModule,
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}
