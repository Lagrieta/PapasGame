var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, visibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var nachos, burrito, taco, PP;
var nachoG, burroG, tacoG, PPG, TesorosGroup;
var nachoImg, burroImg, tacoImg, PPImg;

var score=0;
var Papascoins=0;

var gameOver, restart;

function preload(){
  trex_running =   loadAnimation("Trex1.png","Trex2.png","Trex3.png", "Trex4.png");
  trex_collided = loadAnimation("Trex1.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  nachos = loadImage("Nachos.png");
  burrito = loadImage("Burrito.png");
  taco = loadImage("Taco.png");
  PP = loadImage("PP-tipo.png");
  
}

function setup() {
  //Logra hacer responsivo el espacio visual
  createCanvas(windowWidth, windowHeight);
  
  //haz responsivo al Trex
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //haz responsivo el suelo
  ground = createSprite(width/2,height-110,width,112);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.depth = trex.depth -1;
  
  //Haz responsivo gameOver
  gameOver = createSprite(width/2,height/2-75);
  gameOver.addImage(gameOverImg);
  gameOver.depth = +3;
  
  //Haz responsivo restart
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.depth = +3;
  
  gameOver.scale = 0.12;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  //Haz responsivo el suelo invisible
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //Haz responsivo el suelo que da color al suelo
  visibleGround = createSprite(width/2,height-50,width,120);
  visibleGround.depth = ground.depth -1;
  visibleGround.depth = trex.depth -2;
  visibleGround.depth = ground.depth -1;
  
  trex.setCollider("rectangle",0,0,75,200);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  nachoG = new Group();
  burritoG = new Group();
  tacoG = new Group();
  PPG = new Group();
  TesorosGroup = new Group();
  
  score = 0;
  papascoins= 0;
}

function draw() {
  //trex.debug = true;
  background(rgb(40, 88, 240));
  fill("red");
  textSize(15);
  text("Score: "+ score, 10,45);
  
  fill("yellow");
  textSize(20);
  text("Papascoins:"+ papascoins, 10, 65);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    trex.changeAnimation("running", trex_running);
    
    //Logra que el juego detecte el toque en la pantalla
    if((touches.length>0) || keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      touches = [];
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnTesoros();
  
    if(TesorosGroup.isTouching(trex)){
        TesorosGroup.destroyEach();
        papascoins = papascoins + 1;
    }
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    TesorosGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //Logra que el juego detecte el toque en la pantalla
    if((touches.length>0) || mousePressedOver(restart)) {
      reset();
      touches = [];
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    //haz responsivas a las nubes
    var cloud = createSprite(width/1,height-25,width,120);
    cloud.y = Math.round(random(80,200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  TesorosGroup.destroyEach();
  score = 0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    //Haz responsivos los obstáculos
    var obstacle = createSprite(width/1,height-95,width,120);
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function spawnTesoros() {
  if(frameCount % 150 === 0) {
    //Haz responsivos los obstáculos
    var Tesoros = createSprite(width/1,height-215,width,120);
    Tesoros.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: Tesoros.addImage(nachos);
              break;
      case 2: Tesoros.addImage(taco);
              break;
      case 3: Tesoros.addImage(burrito);
              break;
      case 4: Tesoros.addImage(PP);
              break;
      default: break;
    }
           
    Tesoros.scale = 0.04;
    Tesoros.lifetime = 300;

    TesorosGroup.add(Tesoros);
  }
}


