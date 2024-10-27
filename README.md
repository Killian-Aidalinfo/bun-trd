# bun-trd

Groupe : Michael, Killian, Lukas.

Réference des 3 users stories :
https://civilisation-it.fr/blog/decouverte-bun

## Run

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

## Test

```bash
bun test
```

## Curl

Register : 

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "STEIN",
    "prenom": "Killian",
    "email": "killian.stein@civilisation-it.fr",
    "password": "SuperAzerty57",
    "age": 23,
    "pays": "France"
  }'

```
Login : 

```bash
  curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "killian.stein@civilisation-it.fr",
    "password": "SuperAzerty57"
  }'
```

Match : 

```bash
curl http://localhost:3000/matchs
```
