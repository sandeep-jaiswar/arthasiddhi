import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions[]>(
      AppModule,
      [
        {
          transport: Transport.TCP,
          options: {
            host: process.env.TCP_HOST || 'localhost',
            port: parseInt(process.env.TCP_PORT, 10) || 3001,
          },
        },
        {
          transport: Transport.REDIS,
          options: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            // url: process.env.REDIS_URL || 'redis://localhost:6379', // Alternative using URL
          },
        },
        {
          transport: Transport.GRPC,
          options: {
            package: process.env.GRPC_PACKAGE
              ? process.env.GRPC_PACKAGE.split(',')
              : ['hero'],
            protoPath: process.env.GRPC_PROTO_PATH
              ? join(__dirname, process.env.GRPC_PROTO_PATH)
              : join(__dirname, '_proto/hero.proto'),
            url: process.env.GRPC_URL || 'localhost:5000',
            // Add other gRPC options if needed (e.g., credentials)
          },
        },
        {
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: process.env.KAFKA_CLIENT_ID || 'my-kafka-client',
              brokers: process.env.KAFKA_BROKERS
                ? process.env.KAFKA_BROKERS.split(',')
                : ['localhost:9092'],
            },
            consumer: {
              groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'my-kafka-group',
            },
            // TODO: Add other Kafka options if needed
          },
        },
      ],
    );
    await app.listen();
    console.log('Microservice is listening on multiple transports...');
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
}
void bootstrap();
