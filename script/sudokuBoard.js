 //random images
 function setimage(indeximg,indexbox){
    let img= document.createElement("img");
    if(levels=='level1'){
        board4.children[indexbox].append(img);
    }
    else{
        board9.children[indexbox].append(img);
    }
    // console.log(img);
    img.id= groups.children[0].children[indeximg-1].id;
    img.src= groups.children[0].children[indeximg-1].src;
    img.setAttribute("readonly","true");
    }   
// selcting the tittle
let tittle=document.querySelector(".tittle");
// 4*4 board
let  board4= document.querySelector(".board");
//levels option
let level= document.querySelectorAll("select>option");
// 9*9 board
let board9=document.querySelector(".bigBoard");
// image collections 
let imageGroup= document.querySelectorAll(".btngroup");
// choosen collection
let groups=document.querySelector(".playcards4");
//start button
let start=document.getElementById("start");
// popup
let popup=document.querySelector(".popup");
//timer
let timer=document.querySelector(".time");

let pressEnter =document.querySelector(".enter");
// try again button
let tryagain=document.querySelector("#try");
// on load event
let levels= location.search.substring(1).split("=")[2];
let playerName=location.search.substring(8).split("&")[0];
window.addEventListener("load",function(){
    //remove and hide images groups
    const group9Element = this.document.querySelector(".group9-container");
    const group4Element = this.document.querySelector(".group4-container");
    
    if(levels=="level1"){
     group9Element.classList.add("hide");   
     group4Element.classList.remove("hide");   
    }else{
     group4Element.classList.add("hide");   
     group9Element.classList.remove("hide");  
    }       
    //fetching random board
    let boardLength;
    async function getBoard(){
       let sol=[];
       let arr=[];
       let levels= location.search.substring(1).split("=")[2];
       let response;
       if(levels=="level1"){ 
        boardLength=4;
        response = await fetch("https://sudoku-api.deta.dev/?type=4");
       }else{
        response = await fetch("https://sudoku-api.deta.dev/?type=9");
        boardLength=9;
       }
        let puzzel= await response.json();
       
       for(let index in puzzel.solution){
           
           sol.push(puzzel.solution[index])
       }
       localStorage.setItem("solution",sol);
       
       for(let item in puzzel.board){
           arr[item]=puzzel.board[item];      
       }
       for(let row=0; row<boardLength; row++){
           for(let col=0;col<boardLength;col++){
               let box=document.createElement("div");
               box.id=row.toString() +""+ col.toString();
               box.classList.add("smallbox");
               if(levels=="level1"){
                   board4.append(box);
               }
               else{
                   board9.append(box);
               }
           }
       }
       for(let i in arr){
           if(arr[i]=="."){
               if(levels=="level1"){
                   board4.children[i].innerText="";
               }
               else{
                    board9.children[i].innerText="";
               }
   
           }else{
               setimage(arr[i],i)
           }
        }  
    }       
    //choosing the images group
    for(let item of imageGroup){
        item.addEventListener("click",function(event){
            item.parentElement.parentElement.classList.add("hide");           
            let levels= location.search.substring(1).split("=")[2];
            if(levels == "level1") {
                for(let i=0; i<4; i++){
                    item.parentElement.previousElementSibling.children[i].id = i + 1;
                }
                
            } else {
                for(let i=0; i<9; i++){
                    item.parentElement.previousElementSibling.children[i].id = i + 1;
                }
                
            }
            alert(`Welcom ${playerName}`);
            groups.append(event.target.parentElement.previousElementSibling);
            event.target.parentElement.classList.add("hide");
            event.target.parentElement.classList.remove("col-5")
            start.classList.remove("hide");
            popup.classList.remove("hide");
            
        });
    }
    //solution array
    let input=[];
    // moving arrows
    let loose=false;
    let currentImage= this.document.createElement("div");
    let col=0;
    let row=0;
    this.document.body.addEventListener("keydown",function(event){
        let numbers=[];
        for(let i=1 ; i<=boardLength;i++){
        numbers.push(i);    
        } 
        if((board4.children.length==0&&board9.children.length==0)||loose){
            
            return;
        }
        else{
        if (event.key == "ArrowRight") {
            if (col < groups.children[0].childElementCount-1) {
                col++;
                currentImage.style.border = "2px solid black";
                currentImage = document.getElementById(row + "" + col);
                currentImage.style.border = "2px solid red";
               
            }
    
        } else if (event.key == "ArrowLeft") {
            if (col > 0) {
                col--;
                currentImage.style.border = "2px solid black";
                currentImage = document.getElementById(row + "" + col);
                currentImage.style.border = "2px solid red";
                
            }
        } else if (event.key == 'ArrowUp') {
            
            if (row > 0) {
                row--;
                currentImage.style.border = "2px solid black";
                currentImage = document.getElementById(row + "" + col);
                currentImage.style.border = "2px solid red";
            }
        }else if (event.key == 'ArrowDown') {
            if (row < groups.children[0].childElementCount-1) {
                row++;
                currentImage.style.border = "2px solid black";
                currentImage = document.getElementById(row + "" + col);
                currentImage.style.border = "2px solid red";
            }
        }
        //play with numbers
        else if (numbers.includes(parseInt(event.key))) {
            if(currentImage.innerHTML==""){
            let choosen = document.createElement("img");
            currentImage.append(choosen);
            currentImage.children[0].src = groups.children[0].children[parseInt(event.key)-1].src;
            currentImage.children[0].id = event.key;
            }
            else{
                return;
            }
        }
        else if(event.key=="Backspace"){
                if(currentImage.innerHTML==""){
                    return ;
                }            

                else if(currentImage.children[0].getAttribute("readonly")=="true"){
                    return;
                }
                else{
                currentImage.children[0].remove();
                }     
        }
        else if (event.key=="Enter"){   
            if(levels=="level1"){
                
                var boardImage=board4.querySelectorAll("img"); 
            }
            else{
                var boardImage=board9.querySelectorAll("img");
            }
            if(boardImage.length>6){
                for(let i=0; i<boardImage.length;i++){
                    input.push(boardImage[i].id);            
                }
                if(localStorage.solution==input){
                    loose=true;
                    alert(`congrats ${playerName}`);
                }
                else{
                    alert(`Not Yet Keep Trying ${playerName}...`);
                }
            }
        }   
    }     
    });   
   //click start
    start.addEventListener("click",function(){
        getBoard();
        pressEnter.classList.remove("hide");
        countTimeDown();            
        tryagain.addEventListener("click",function(){
            tryagain.classList.add("hide");
            loose=false;
            if(levels=="level1"){
                board4.innerHTML="";
                getBoard();
                sec=61;
                countTimeDown(); 
            }else{
                board9.innerHTML="";
                getBoard();
                sec=121;
                countTimeDown(); 
            }           
        })
      },{"once":"true"});
      // timer
    let sec;
    if(levels=="level1"){
        sec=61;
    } else{
        sec=121;
    }
    function countTimeDown() {
        function count() {
            sec--;
            timer.innerHTML =
              "0:"+(sec<10?'0':'') +String(sec);
            if (sec >= 0) {
               var timerID = setTimeout(count, 1000);
            }else {
                timer.innerHTML = "0:00";
                clearTimeout(timerID)
                tryagain.classList.remove("hide");
                if(levels=="level1"){
                    var boardImage=board4.querySelectorAll("img"); 
                }
                else{
                    var boardImage=board9.querySelectorAll("img");
                }
                if(boardImage.length>6){
                    for(let i=0; i<boardImage.length;i++){
                        input.push(boardImage[i].id);     
                    }  
                    if(localStorage.solution==input){
                        alert(`congrats ${playerName}`);
                        loose=true;
                    }else{
                        alert(`oops You lost Press Try Again ${playerName}`);
                        loose=true;
                    }
                }  
            }
          }
        count();
      }
});