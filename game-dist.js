;(function() {

    class Random{
        static get(start, end) {
            return Math.floor(Math.random() * end) + start;
        }
    }

    class Food{
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        draw() {
            ctx.fillRect(this.x, this.y, 10, 10);
        }            

        static generate() {
            return new Food(Random.get(0, 500), Random.get(0, 300));
        }
    }

    class Square {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.back = null; // back reference to the square that is behind this one
        }

        draw() {
            ctx.fillRect(this.x, this.y, 10, 10);
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
            this.direction = 'right';
        }
        left() {
            this.direction = 'left';
        }
        up() {
            this.direction = 'up';
        }
        down() {
            this.direction = 'down';
        }

        move() {
            if(this.direction === 'up') return this.head.up();
            if(this.direction === 'down') return this.head.down();
            if(this.direction === 'left') return this.head.left();
            if(this.direction === 'right') return this.head.right();
        }
    }


    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    const snake = new Snake();
    let foods = [];

    window.addEventListener("keydown", function(event){
        console.log(event.keyCode);
        event.preventDefault();
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
    }, 1000 / 5);

    setInterval(function(){
        const food = Food.generate();
        foods.push(food);

        setTimeout(function(){removeFromFoods(food)}, 10000)

    }, 4000)

    function drawFood() {
        for(const index in foods) {
            const food = foods[index];
            food.draw();
        }
    }

    function removeFromFoods(food) {
        foods = foods.filter(function(f){
            return food !== f;
        });
    }

})();