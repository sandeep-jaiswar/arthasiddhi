import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions[]>(
    AppModule,
    [
      { // TCP
        transport: Transport.TCP,
        options: {
          host: process.env.TCP_HOST || 'localhost', // Use environment variable
          port: parseInt(process.env.TCP_PORT, 10) || 3001, // Use environment variable
        },
      },
      { // Redis
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost', // Use environment variable
          port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Use environment variable
          // url: process.env.REDIS_URL || 'redis://localhost:6379', // Alternative using URL
        },
      },
      { // gRPC
        transport: Transport.GRPC,
        options: {
          package: process.env.GRPC_PACKAGE ? process.env.GRPC_PACKAGE.split(',') : ['hero'], // Use environment variable
          protoPath: process.env.GRPC_PROTO_PATH ? join(__dirname, process.env.GRPC_PROTO_PATH) : join(__dirname, '_proto/hero.proto'), // Use environment variable
          url: process.env.GRPC_URL || 'localhost:5000', // Use environment variable
          // Add other gRPC options if needed (e.g., credentials)
        },
      },
      { // Kafka
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID || 'my-kafka-client', // Use environment variable
            brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'], // Use environment variable
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'my-kafka-group', // Use environment variable
          },
           // TODO: Add other Kafka options if needed
        },
      },
    ],
  );
  await app.listen();
  console.log('Microservice is listening on multiple transports...');
}
bootstrap();
