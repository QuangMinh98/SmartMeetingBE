import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule. { cors: true });

  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET, PUT, POST, DELETE',
  //   allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, x-auth-token",
  // });

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT) || 3000;
  
  await app.listen(port, () => {
    console.log('listening on port ' + port);
  });
}
bootstrap();
