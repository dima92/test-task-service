import { Module } from '@nestjs/common';

// ============================ typeorm =================================
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================ config ==================================
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

// ========================== modules ===================================
import { SecurityModule } from './app/security/security.module';
import { UserModule } from './app/users/user.module';
import { RoleModule } from './app/roles/role.module';
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
