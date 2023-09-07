class Drawings {
    constructor( {position, image, animation = 0, cut = 1} ) {
        this.position = position;
        this.image = image;
        this.image.onload = () => {
            this.width = this.image.width/cut;
            this.height = this.image.height;
        }
         this.animation = animation;
         this.cut = cut;
    }
    
    
    draw() {
            ctx.drawImage(
                this.image, 
                this.animation, 
                0, 
                this.image.width/this.cut,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width/this.cut,
                this.image.height,
                );

    }
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor( {position} ) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}