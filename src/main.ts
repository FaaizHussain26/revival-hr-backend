import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { UserService } from "./users/services/user.service";
import { SeedModule } from "./seeder/seed.module";
import { UserSeeder } from "./seeder/user.seeder";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appContext = await NestFactory.createApplicationContext(AppModule);
   const seeder = appContext.get(UserSeeder);
  await seeder.seed();

  await appContext.close();
  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Revival API")
    .setDescription("Testing API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);
  app.enableCors();

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
