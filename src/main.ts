import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    next();
  });

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
