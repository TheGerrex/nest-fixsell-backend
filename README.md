# Backend de Fixsell en NEST

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1.  Clonar el repositorio
2.  Ejecutar

```
npm install
```

3.  Tener Nest CLI instalado

```
npm install -g @nestjs/cli
```

4.  Levantar base de datos

```
docker-compose up -d
```

5. Clonar el archivo **.env.template** y renombrar a **.env**

6. Llenar las variables de entorno definidas en el **.env**

7. Ejecutar la aplicacion en dev:

```
npm run start:dev
```

6. Reconstruir la base de datos con la semilla

```
localhost:3000/seed
```

## Stack Usado

- MongoDB
- NestJS
