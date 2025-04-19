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

lint:
	docker compose run --rm app npm run lint

lint-fix:
	docker compose run --rm app npm run lint -- --fix
