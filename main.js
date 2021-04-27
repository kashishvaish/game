let c = document.getElementById("my-canvas");
let ctx = c.getContext("2d");

let loadImage = (src, callback) => {
   let img = document.createElement("img");
   img.onload = () => callback(img);
   img.src = src;
};

let punchSound = new Audio("audio/PUNCH.mp3");
let kickSound = new Audio("audio/KICK.mp3");


let imagePath = (frameNumber, animation) => "images/"+animation+"/"+frameNumber+".png";

let frames = {
   idle : [1,2,3,4,5,6,7,8],
   kick : [1,2,3,4,5,6,7],
   punch : [1,2,3,4,5,6,7],
   backward : [1,2,3,4,5,6],
   block : [1,2,3,4,5,6,7,8,9],
   forward : [1,2,3,4,5,6]
};

let loadImages = (callback) => {
   let images = {idle:[], kick:[], punch:[], backward:[], block:[], forward:[]};
   let imagesToLoad = 0;

   ["idle", "kick", "punch", "backward", "block", "forward"].forEach((animation) => {
      let animationFrames = frames[animation];
      imagesToLoad += animationFrames.length;

      animationFrames.forEach((frameNumber) => {
         let path = imagePath(frameNumber, animation);
         loadImage(path, (image) => {
            images[animation][frameNumber - 1] = image;
            imagesToLoad -= 1;
            if(imagesToLoad === 0){
               callback(images);
            };
         });
      });      
   });
};

let animate = (ctx, images, animation, callback) => {
   if(animation === "punch"){
      punchSound.play();
   }else if(animation === "kick") {
      kickSound.play();
   };
   images[animation].forEach((image, index) => {
      setTimeout(() => {
         ctx.clearRect(0, 0, 800, 500)
         ctx.drawImage(image, 0, 0, 500, 500);
      }, index * 100);
   });
   setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
   let queuedAnimation = [];
   let aux = () => {
      let selectedAnimation;
      if(queuedAnimation.length === 0){
         selectedAnimation = "idle";
      } else {
         selectedAnimation = queuedAnimation.shift()
      };

      animate(ctx, images, selectedAnimation, aux);
   };
   aux();

   document.getElementById("kick").onclick = () => {
      queuedAnimation.push("kick");
   };

   document.getElementById("punch").onclick = () => {
      queuedAnimation.push("punch");
   };

   document.getElementById("backward").onclick = () => {
      queuedAnimation.push("backward");
   };

   document.getElementById("block").onclick = () => {
      queuedAnimation.push("block");
   };

   document.getElementById("forward").onclick = () => {
      queuedAnimation.push("forward");
   };

   document.addEventListener("keyup", (event) => {
      const key = event.key; //"ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"
      if(key === "ArrowLeft"){
         queuedAnimation.push("backward");
      } else if(key === "ArrowRight"){
         queuedAnimation.push("forward");
      } else if(key === "ArrowUp"){
         queuedAnimation.push("punch");
      } else if(key === "ArrowDown"){
         queuedAnimation.push("kick");
      } else if(key === " "){
         queuedAnimation.push("block");
      } 
   });
});
