# RSSchool NodeJS websocket task template
This task is battleship game with backend using websocket.

The backend is able to do the following:

- Start websocket server
- Handle websocket connection
- Handle player requests
- Handle room requests
- Handle ships requests
- Handle game requests
- Create single play bot

## Setup
1. Use 18 LTS version of Node.js
2. Clone/download this repo
3. Go to project directory:
```bash
cd battleship-server
```
4. Install dependencies:
```bash
npm i
```
5. Switch to `develop` branch:
```bash
git checkout develop
```
6. When the server is started, you can send open app on the address `http://localhost:8181/`


## Starting application
**Development**

```
npm run start:dev
```

* App served @ `http://localhost:8181` with nodemon

**Production**

```
npm run start
```

* App served @ `http://localhost:8181` without nodemon

---

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.

---
## Game description
1. We should have inmemory DB with player data (login and password) storage
2. Player can create game room or connect to the game room after login
3. Player room data (players, game board, ships positions) storages in the server
3. Game starts after 2 players are connected to the room and sent ships positions to the server
4. Server sends move order
5. Players should shoot in their's turn
6. Server send back shot result
7. If player hits or kills the ship, player should make one more shoot
8. Player wins if he have killed all enemies ships
