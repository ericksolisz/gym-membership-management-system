# Gym Membership Management System — Backend

Backend microservices for managing gym members and their membership tiers.

For the full architecture overview, diagrams, and design rationale, see the
[root README](../README.md). This document covers backend-specific build,
run, and deployment details.

## Architecture

| Service | Purpose | Port |
| --- | --- | --- |
| `member-service` | Member CRUD, membership plan and status | `4000` |
| `billing-service` | Creates billing accounts over gRPC | `4001`, gRPC `9001` |
| `analytics-service` | Consumes member-created Kafka events | `4002` |
| `api-gateway` | JWT-protected public API | `4004` |
| `auth-service` | Login and JWT validation | `4005` |

Uses two PostgreSQL databases, Kafka, ECS Fargate, an Application Load
Balancer, AWS CDK, and LocalStack.

## Membership Model

Membership plans:

- `BASIC`
- `PREMIUM`
- `VIP`

Membership statuses:

- `ACTIVE`
- `PAUSED`
- `CANCELLED`

New memberships default to `ACTIVE`. A member's `joinedDate` is set during
creation and is not changed by updates.

## API

All member routes are exposed through the API gateway and require a bearer
token:

```text
GET    /api/members
POST   /api/members
PUT    /api/members/{id}
DELETE /api/members/{id}
```

OpenAPI docs are proxied through the gateway too (no auth required):

```text
GET    /api-docs/members
GET    /api-docs/auth
```

Create request:

```json
{
  "name": "Sam Carter",
  "email": "sam.carter@example.com",
  "address": "123 Main Street",
  "dateOfBirth": "1995-09-09",
  "joinedDate": "2026-07-18",
  "membershipPlan": "PREMIUM"
}
```

Update requests use the same contact fields and can change
`membershipPlan` and `membershipStatus`. Omitting `membershipStatus` preserves
its current value.

The seeded administrator login remains:

```json
{
  "email": "testuser@test.com",
  "password": "password123"
}
```

## Run With Docker Compose (Recommended)

One command builds all five images and starts the full backend stack, with
healthchecks ordering startup correctly:

```powershell
docker compose up --build
```

Only the API gateway (`4004`) is published to the host — everything else is
reachable only inside the compose network, mirroring the real deployment.
Stop with `docker compose down` (keeps seeded data) or `docker compose down -v`
(wipes it). See [docker-compose.yml](docker-compose.yml) for the full service
definitions and the `JWT_SECRET` override instructions.

## Build (Without Compose)

Each Spring service remains an independent Maven project. On Windows, run the
following command inside each service directory:

```powershell
.\mvnw.cmd clean package
```

Build the same five Docker images used by the CDK stack:

```powershell
docker build -t member-service .\member-service
docker build -t billing-service .\billing-service
docker build -t analytics-service .\analytics-service
docker build -t auth-service .\auth-service
docker build -t api-gateway .\api-gateway
```

Then run each container manually with `docker run`, wiring the environment
variables below. `auth-service` additionally requires `JWT_SECRET` — a
base64 string that decodes to at least 32 bytes (e.g.
`openssl rand -base64 48`) — since it both signs and verifies tokens.

## Local Container Environment

Member service:

```text
BILLING_SERVICE_ADDRESS=billing-service
BILLING_SERVICE_GRPC_PORT=9001
SPRING_DATASOURCE_PASSWORD=password
SPRING_DATASOURCE_URL=jdbc:postgresql://member-service-db:5432/member-service-db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
SPRING_SQL_INIT_MODE=always
```

Auth service:

```text
SPRING_DATASOURCE_PASSWORD=password
SPRING_DATASOURCE_URL=jdbc:postgresql://auth-service-db:5432/auth-service-db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_SQL_INIT_MODE=always
```

Kafka container:

```text
KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,EXTERNAL://localhost:9094
KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
KAFKA_CFG_NODE_ID=0
KAFKA_CFG_PROCESS_ROLES=controller,broker
```

## LocalStack Deployment

The local stack deployment goes as follows:

1. Build the five Docker images.
2. Start LocalStack with the ECS, RDS, MSK, ELB, Route 53, CloudFormation, and
   logging services enabled.
3. Synthesize the infrastructure from the `infrastructure` directory. The
   module declares no `exec-maven-plugin`, so invoke it by full coordinates:

```powershell
mvn compile org.codehaus.mojo:exec-maven-plugin:3.5.0:java "-Dexec.mainClass=com.gym.stack.GymMembershipStack"
```

This writes `cdk.out/localstack.template.json`.

4. From Git Bash or WSL, deploy the generated template:

```bash
cd infrastructure
./localstack-deploy.sh
```

The script deploys `cdk.out/localstack.template.json` as the
`gym-membership-management` CloudFormation stack and prints the load balancer
hostname.

Ready-to-run login, REST, and gRPC examples are under `api-requests` and
`grpc-requests`.
