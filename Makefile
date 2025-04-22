all: build install up

build:
	docker compose build

up:
	docker compose up

down:
	docker compose down

exec:
	docker compose run --rm app bash

install:
	docker compose run --rm app npm install

create-default-admin:
	docker compose run --rm app npm run create-default-admin

lint:
	docker compose run --rm app npm run lint

lint-fix:
	docker compose run --rm app npm run lint -- --fix
