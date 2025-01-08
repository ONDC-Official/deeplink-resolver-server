# Deep Link v2
This repo holds the code for Deep Link v2 App. It is a utility provided to generate usecases from predefined templates. There are 3 personas concerned in this app. These personas are:
1. Admin
2. User
3. Consumer

Out of these, currently, the User flow has been enabled. Remaining flows are under development and will be introduced in future releases.

## Admin
The admin is responsible to **creating** templates. These templates inherit schema from the Base Beckn template. The admin can then add fields to the template. There are 3 types of fields:
1. Pre-filled - These fields are defined and their values are provided by the admin. These fields are not editable by the user. So any usecase created with these templates will have the same values for these fields.
2. User-filled - The admin can mark a field as "user-filled". This field will be editable by the user. The user can provide their own values for these fields during usecase generation.
3. PG - These fields are filled during consumption phase. The usecase created with the template will have these fields marked and the resolver server will communicate with the agent to fill these fields.

## User
The user is responsible to **creating** usecases. The user can select a template and then add fields to the template. The user can then generate the usecase. The usecase will be generated in the form of a JSON file. The user can then use this JSON file to create a usecase on the Beckn network.

The usecases may be kept private or public (saveed to GitHub). Additionally, when the usecase is either published privately (submitted) or published, the usecase QR is saved on Github. This QR contains the ID of the usecase. The resolver server can then use this ID to fetch the usecase.

## Consumer
The consumer is responsible to **consuming** usecases. The consumer can scan the QR of the usecase and the resolver server will fetch the usecase. The resolver server will then communicate with the "consuming" agent to fill the fields marked as PG. The resolver server will then return the usecase to the consumer. The consumer can then use this usecase to create a usecase on the Beckn network.

Currently, hitting `/api/resolver/{usecase_id}` will resolve the usecase. *Note*: While this returns the usecase, it does not resolve the usecase. The usecase is resolved when the resolver server communicates with the agent and all the post-generation fields are filled. **Post Generation fields are denoted with `{{<value>}}`.

## Developer Guide

This section is meant for developers who want to contribute to the project. The project is built using NextJS and PostgreSQL. Prisma ORM has been used.

### Prerequisites
Knowledge of NextJS 15, TypeScript, PostgreSQL, Docker, Docker Compose, Prisma ORM, and Beckn Protocol is required.

You need to have the following before you can start developing:
1. NodeJS (^22.0)
2. Docker & Docker Compose

### Steps to start the project
1. Clone the repo
2. RUN `cd deeplink-generator`
3. Run `npm install`
4. Copy the `example.env` file to `.env` and update the values as needed.
5. Copy the `docker-compose.local.yml` to `docker-compose.yml`.
6. RUN `docker compose up ondc_deep_link_db -d`. This will start the database in a docker container.
7. RUN `npx prisma migrate dev` followed by `npx prisma seed` to seed the database.
8. RUN `npm run dev` to start the project.

### Seeding the database
The database comes pre-seeded with the templates defined inside the `seeding` directory once step 7 in the previous sub-section is completed. The seeding script automatically picks up on the usecase category and sub-category as defined in the templates and seeds them accordingly.

## Contributors: 
1. [Abhik Banerjee](https://github.com/abhik-wil)
2. [Sonali Shakya](https://github.com/sonalishakya)