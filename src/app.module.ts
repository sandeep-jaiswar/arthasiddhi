import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Specify the path to your .env file
      isGlobal: true, // Make the ConfigModule global
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
