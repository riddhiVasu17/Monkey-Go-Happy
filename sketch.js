//game states
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//variables for sprites, images and groups
var bground, bg, ig;
var monkey, monkey_running, monkey_collided;
var bananaImage, obstacle, obstacleImage;
var banana, bananaGroup;
var obstacle, obstacleGroup;

//score
var score;


function preload(){
  //load Images here
  monkey_running =                    loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png", "sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkey_collided = loadImage("sprite_0.png");
  bg = loadImage("junglebg.jpg");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 
}


function setup() {
  //create the canvas
  createCanvas(550, 300);
  
  //create background(sprite)
  bground = createSprite(200, 150, 600, 20); 
  bground.addImage(bg);
  bground.scale = 1.2;
  
  //create objects(sprites)
  monkey = createSprite(120, 220, 40, 40);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.18;
  
  ig = createSprite(300, 280, 600, 20); 
  ig.visible = false;
  
  bananaGroup = createGroup();
  obstacleGroup = createGroup(); 
  
  //declare the value of score as 0
  score = 0;
  
} 


function draw() {
  //display the created sprites
  drawSprites();
  
    //when in gameState PLAY, perform following
    if (gameState === PLAY) {

      bground.velocityX = -(3 +(score/100));

    if (bground.x < 200) {
      bground.x = bground.width/2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && monkey.y > 150) {
      monkey.velocityY = -10;
    }
      //add gravity
      monkey.velocityY = monkey.velocityY + 0.8;

      //calculate the survival time of monkey in score
      score = score + Math.round(getFrameRate()/60);

      spawnBanana();

      spawnObstacles();

      //when bananas collide with monkey destroy it
    if (bananaGroup.collide(monkey)) {
      bananaGroup.destroyEach();
    }

      //if obstacles collide with monkey, change gamestate into END
    if (obstacleGroup.collide(monkey)) {
      gameState = END;
    }
  }
  
  
   //when in gameState END, perform following
   else if (gameState === END) {
    //set the velocity of these objects to 0
    bground.velocityX = 0;
    monkey.velocityY = 0;
  
    //to display the GAME OVER message
    fill("black");
    textSize(40);
    textStyle(BOLD);
    text("🎮GAME OVER🎮", 160, 150);
     
    //set lifetime of these objects so that they are never destroyed
    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    
     //set the speed to 0 of these objects
    bananaGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
  }
  
  //text to display the score
  fill("black");
  textSize(20);
  textStyle(BOLD);
  text("Survival Time : " +score,  350, 30);
  
  //to make monkey collide with invisible ground
  monkey.collide(ig);

}


function spawnBanana() {
  
  if (frameCount % 80 === 0){
  banana = createSprite(600, random(100, 230), 40, 40);
  banana.addImage(bananaImage);
  banana.scale = 0.12;
  //to increase the speed, when the score crosses multiple of 100
  banana.velocityX = -(5 +(score/100));
    
  //to prevent memory leakage
  banana.lifetime = 200; 
    
  //add banana to banana group
  bananaGroup.add(banana);
}

}

function spawnObstacles() {
  
  if (frameCount % 200 === 0){
  obstacle = createSprite(600, 250, 40, 40);
  obstacle.addImage(obstacleImage);
  obstacle.scale = 0.12;
  //to increase the speed, when the score crosses multiple of 100
  obstacle.velocityX = -(5 +(score/100));
 
  //make the depth of monkey and obstacle equal
  monkey.depth = obstacle.depth;
    
  //to prevent memory leakage
  obstacle.lifetime = 200;     
    
  //add obstacle to obstacle group
  obstacleGroup.add(obstacle);
    
  //set collider as circle, to make it collide with a fixed radius
  obstacle.setCollider("circle", 0, 0, 40);
    
  //make obstacle collide with invisible ground
  obstacle.collide(ig);  
}
}