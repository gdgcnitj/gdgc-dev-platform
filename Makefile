.PHONY: help install dev check build db-up db-down db-logs db-migrate db-studio

help:
	@printf '%s\n' 'make install     Install project packages.' 'make dev         Start the mprocs process list.' 'make check       Run lint and type checks.' 'make build       Make a production build.' 'make db-up       Start the local database.' 'make db-down     Stop the local database.' 'make db-logs     Show database logs.' 'make db-migrate  Apply database migrations.' 'make db-studio   Open Drizzle Studio.'

install:
	npm ci

dev:
	npm run mprocs

check:
	npm run check

build:
	npm run build

db-up:
	npm run db:up

db-down:
	npm run db:down

db-logs:
	npm run db:logs

db-migrate:
	npm run db:migrate

db-studio:
	npm run db:studio
