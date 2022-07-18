const getRandomBird = () => {
    const x = innerWidth/4.2;
    const y = innerHeight*2/3;
    const birds = [
        {
            radius: 10,
            posX: x,
            posY: y,
            physics: {
                name: 'Terence',
                density: 0.1,
                frictionAir: 0.0000000001,
                render: {
                    sprite: {
                        texture: './img/1.png',
                        xScale: 0.3,
                        yScale: 0.3
                    }
               }
            }
        },
        {
            radius: 10,
            posX: x,
            posY: y,
            physics: {
                name: 'Bubbles',
                density: 0.1,
                frictionAir: 0.0000001,
                grow: 1.5,
                maxGrow: 0.35,
                render: {
                    sprite: {
                        texture: './img/10.png',
                        xScale: 0.2,
                        yScale: 0.2
                    }
               }
            }
        },
        {
            radius: 15,
            posX: x,
            posY: y,
            physics: {
                name: 'triangle',
                density: 0.01,
                frictionAir: 0.000005,
                factor: 1.5,
                render: {
                    sprite: {
                        texture: './img/55.png',
                        xScale: 0.2,
                        yScale: 0.2
                    }
               }
            }
        }
    ]

    return birds[Math.floor(Math.random() * birds.length)]
}