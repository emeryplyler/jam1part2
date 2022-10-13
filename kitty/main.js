title = "Kitty";

description = `
    Kitty game
    Dont touch the 
    dogs and don't 
    let the fish 
    escape!`;

characters = [
`
 c  c 
cccccc
c cc c
cccccc
cccccc
cccccc
`,
`
 pp p
pypp
 pp p
`,
`
p p
 p   p 
 pppp
  p p
`,

];

// Game design variable container
const G = {
	WIDTH: 100,
	HEIGHT: 150,

    STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
    
    PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,

    FBULLET_SPEED: 5,

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
    ENEMY_FIRE_RATE: 45,

    EBULLET_SPEED: 2.0,
    EBULLET_ROTATION_SPD: 0.1
};

// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    // isPlayingBgm: true,
    isReplayEnabled: true,
    // theme: "dark"
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * isJumping: boolean,
 * vx: number,
 * vy: number,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * }} Fish
 */

/**
 * @type { Fish }
 */
let fish;

/**
 * @type { Fish [] }
 */
let fishes;

/**
 * @type { number }
 */
let fishspeed = 0.2;

/**
 * @type { number }
 */
 const fishoffset = 10;

/**
 * @type { number }
 */
let counter = 0;
let dogs;

function update() {
	if (!ticks) {
		// initialization
		player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
			speed: 0,
			isJumping: false,
			vx: 0,
			vy: 0,
        };
		fish = {
			pos: vec(0, G.HEIGHT * 0.5 - fishoffset),
		};
		fishes = [];
        dogs = [];
	}

	counter++; // increment counter
	counter = counter % 65;

	if (player.isJumping) {
		player.vy += 0.05;            // decrease upward velocity
		player.pos.y += player.vy;    // move sprite
		if (player.pos.y >= (G.HEIGHT * 0.5)) {
			player.vy = 0;            // sprite has hit "ground"
			player.pos.y = G.HEIGHT * 0.5;
			player.isJumping = false; // reset
		}
	} else {
		if (input.isJustPressed) {
			player.vy = -1;           // initial upward velocity
			player.isJumping = true;
			// addScore(1);
		}
	}
	
	if (counter == 64) {
		const posX = G.WIDTH;
		const posY = (G.HEIGHT * 0.5) - fishoffset + rnd(0, 3);
        // add if statement to make it half dogs and half cats
        if (rnd(0, 10)>5){
            fishes.push({ pos: vec(posX, posY) });
        } else{
            dogs.push({ pos: vec(posX, posY) });
        }
        fishspeed *= difficulty;
	}
	
	// player.pos = vec(input.pos.x, input.pos.y);
	player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
	char("a", player.pos);

    remove(fishes, (f) => {
        // let thisFish = char("b", f.pos);    // draw fish
        f.pos.x -= fishspeed;               // move fish 
        
        if (f.pos.x <= 0) {
            end("Game over :("); // fish escape
        }

        // if fish collides with player and player is jumping
        // add collision for dogs
        const fishCollision = char("b", f.pos).isColliding.char.a;
        if (fishCollision && player.isJumping) {
            addScore(1); // add to score
            return true; // delete fish
        } else {
            return false;
        }
    });
    remove(dogs, (g) => {
        // let thisFish = char("b", f.pos);    // draw fish
        g.pos.x -= fishspeed;               // move fish 

        // if fish collides with player and player is jumping
        // add collision for dogs
        const dogCollision = char("c", g.pos).isColliding.char.a;
        if (dogCollision && player.isJumping) {
            end("Game Over");
        } else {
            return false;
        }
    });
    
}
