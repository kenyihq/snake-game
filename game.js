class Random{
    static get(start, end) {
        return Math.floor(Math.random() * end) + start;
    }
}

class Food{
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }            

    static generate() {
        return new Food(Random.get(0, 500), Random.get(0, 300));
    }
}

class Square {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.back = null; // back reference to the square that is behind this one
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.hasBack()){
            this.back.draw();
        }
    }

    add() {
        if(this.hasBack()) return this.back.add();
        this.back = new Square(this.x, this.y);
    }

    hasBack() {
        return this.back !== null;
    }

    copy() {
        if(this.hasBack()) {
            this.back.copy()
            this.back.x = this.x;
            this.back.y = this.y;
        }
    }

    right() {
        this.copy();
        this.x += 10;
    }

    left() {
        this.copy();
        this.x -= 10;
    }

    up() {
        this.copy();
        this.y -= 10;
    }

    down() {
        this.copy();
        this.y += 10;
    }

    hit(head, second = false) {
        if(this === head && !this.hasBack()) return false;
        if(this === head) return this.back.hit(head);


        if(second && !this.hasBack()) return false;
        if(second) return this.back.hit(head, true);

        if(this.hasBack()) {
            return squareHit(this, head) || this.back.hit(head);
        }

        return squareHit(this, head);
    }

    hitBorder() {
        return this.x > 500 || this.x < 0 || this.y > 300 || this.y < 0;
    }

}

class Snake {
    constructor() {
        this.head = new Square(100, 0);
        this.draw();
        this.direction = 'right';
        this.head.add();
        this.head.add();
        this.head.add();
    }

    draw() {
        this.head.draw();
    }

    right() {
        if(this.direction === 'left') return;
        this.direction = 'right';
    }
    left() {
        if(this.direction === 'right') return;
        this.direction = 'left';
    }
    up() {
        if(this.direction === 'down') return;
        this.direction = 'up';
    }
    down() {
        if(this.direction === 'up') return;
        this.direction = 'down';
    }

    move() {
        if(this.direction === 'up') return this.head.up();
        if(this.direction === 'down') return this.head.down();
        if(this.direction === 'left') return this.head.left();
        if(this.direction === 'right') return this.head.right();
    }

    eat() {
        this.head.add();
    }

    dead() {
        return this.head.hit(this.head) || this.head.hitBorder();
    }
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const snake = new Snake();
let foods = [];

window.addEventListener("keydown", function(event){
    console.log(event.keyCode);
    if(event.keyCode > 36 && event.keyCode < 41 || event.keyCode === 83 || event.keyCode === 68 || event.keyCode === 65 || event.keyCode === 87) {
        event.preventDefault();
    }

    if(event.keyCode === 40 || event.keyCode === 83) return snake.down();
    if(event.keyCode === 38 || event.keyCode === 87) return snake.up();
    if(event.keyCode === 39 || event.keyCode === 68) return snake.right();
    if(event.keyCode === 37 || event.keyCode === 65) return snake.left();
    
    return false;
});
setInterval(function(){
    snake.move();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    snake.draw();
    drawFood();

    if(snake.dead()){
        console.log('Game Over');
        window.location.reload();
    }
}, 1000 / 10);

setInterval(function(){
    const food = Food.generate();
    foods.push(food);

    setTimeout(function(){removeFromFoods(food)}, 10000)

}, 4000)

function drawFood() {
    for(const index in foods) {
        const food = foods[index];
        if(typeof food !== 'undefined') {
            food.draw();
            if (hit(food, snake.head)){
                snake.eat();
                removeFromFoods(food);
            }
        }
    }
}

function removeFromFoods(food) {
    foods = foods.filter(function(f){
        return food !== f;
    });
}

function squareHit(squareOne, squareTwo) {
    return squareOne.x == squareTwo.x && squareOne.y == squareTwo.y;
}

function hit(a, b){ 
    var hit = false;
    if(b.x + b.width >= a.x && b.x < a.x +a.width) {
        if(b.y + b.height >= a.y && b.y < a.y + a.height);
        hit = true;
    } 
    if(b.x <= a.x && b.x + b.width >= a.x + a.width) {
        if(b.y <= a.y && b.y + b.height >= a.y + a.height);
        hit = true;
    }
    if(a.x <= b.x && a.x + a.width >= b.x + b.width) {
        if(a.y <= b.y && a.y +a.height >= b.y + b.height);
        hit = true;
    } 
    return hit;
}