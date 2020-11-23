var dogImg, happyDogImg, dog;
var database;
var foodS, foodStock; 
var canvas, lastFed, fedTime, foodObj, feed, addFood, food1, foodCount, input, milk, milkImg;
var gameState,readState;
var bedroom,garden,washroom;

function preload() {
  dogImg = loadImage('images/Dog.png');
  happyDogImg = loadImage('images/Happy.png');
  milkImg = loadImage('images/Milk.png');

  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png")

}

function setup() {
  database = firebase.database();

  dog = createSprite(650, 250);
  dog.scale = 0.3;
  dog.addImage(dogImg);

  milk = createSprite(565, 300);
  milk.addImage(milkImg);
  milk.scale = 0.1;
  milk.visible = false;
  milk.rotation = 55;
  
  food1 = new Food();
  


  addFood = createButton("Add food");
  addFood.position(370, 45);
  addFood.mousePressed(addFoods);

  input = createInput("Your Dog's Name");
  input.position(150, 70);

  feed = createButton("Feed your Dog");
  feed.position(450, 45);
  feed.mousePressed(feedDog);

  canvas = createCanvas(800, 400);
}

function draw() {  
  background(46, 139, 87);


  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      food1.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      food1.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      food1.washroom();
   }else{
    update("Hungry")
    food1.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    
   }

  food1.display();


  if(gameState !== "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }
  drawSprites();
}

function feedDog() {
  food1.getFoodStock();
  food1.updateFedTime();

  if(foodCount === 0) {
    foodCount = 0;
    milk.visible = false;
    dog.addImage(dogImg);
  } else {
    food1.updateFoodStock(foodCount - 1);
    milk.visible = true;
    dog.addImage(happyDogImg);
  }
}

function addFoods() {
 food1.getFoodStock();

 food1.updateFoodStock(foodCount + 1); 
}

function readState(){
  readState = database.ref('gameState');
  readState.on("value", function (data){
    gameState = data.val()
  })
}

function update(state){
  database.ref('/').update({
    gameSate : state
  });
}