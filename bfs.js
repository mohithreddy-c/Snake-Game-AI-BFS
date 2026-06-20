function bfs(start, target) {

    // Treat snake body as obstacles
    let blocked = new Set();

    for(let i = 1; i < snake.length; i++){

        blocked.add(
            snake[i].x + "," + snake[i].y
        );
    }

    const directions = [
        [1,0],   // Right
        [-1,0],  // Left
        [0,1],   // Down
        [0,-1]   // Up
    ];

    let queue = [start];

    let visited = new Set();

    let parent = {};

    visited.add(
        start.x + "," + start.y
    );

    while(queue.length){

        let current = queue.shift();

        if(
            current.x === target.x &&
            current.y === target.y
        ){
            break;
        }

        for(let dir of directions){

            let nx = current.x + dir[0];
            let ny = current.y + dir[1];

            if(nx < 0){
                nx = GRID_SIZE - 1;
            }

            if(nx >= GRID_SIZE){
                nx = 0;
         }

            if(ny < 0){
                ny = GRID_SIZE - 1;
            }

            if(ny >= GRID_SIZE){
                ny = 0;
            }

            let key = nx + "," + ny;

            if(
                nx >= 0 &&
                nx < GRID_SIZE &&
                ny >= 0 &&
                ny < GRID_SIZE &&
                !visited.has(key) &&
                !blocked.has(key)
            ){

                visited.add(key);

                parent[key] = current;

                queue.push({
                    x: nx,
                    y: ny
                });
            }
        }
    }

    return parent;
}

function getPath(parent, start, target){

    let path = [];

    let current = target;

    while(
        current.x !== start.x ||
        current.y !== start.y
    ){

        path.push(current);

        let key =
            current.x + "," + current.y;

        current = parent[key];

        if(!current){
            return [];
        }
    }

    path.reverse();

    return path;
}
