
//Global variable to store the array properties to eventually do search
//The starting node is marked as 1, the ending node is marked as 2, unvisited nodes are marked as 0, and blocked nodes are marked as 3
class gridNode {
    constructor(id, val, x, y, weight) {
        this.id = id;
        this.val = val;
        this.x = x;
        this.y = y;
        this.weight = weight;
    }
}
var mousemove = false;
var startNode = new gridNode(0,0,0,0,0);
var endNode = new gridNode(0,0,0,0,0);
var arr = [];
var gridval = 0;
for (x = 0; x < 20; x++) {
    arr[x] = [];
    for(y = 0; y < 20; y++) {
        arr[x][y] = new gridNode(gridval.toString(), 0, x, y,0);
        gridval++;
    }
}
class gridHeap {
    constructor() {
        this.heap = [];
    }
    push(x) {
        var temp;
        this.heap.push(x);
        var index = this.heap.length - 1;
        var parent = Math.floor((index-1)/2);
        while(parent >= 0) {
            if(this.heap[parent][1] > this.heap[index][1]) {
                temp = this.heap[parent];
                this.heap[parent] = this.heap[index];
                this.heap[index] = temp;
            }
            else {
                break;
            }
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }
    pop() {
        var temp;
        if(this.heap.length < 1) {
            return null;
        }
        var curr = this.heap[0];
        this.heap[0] = this.heap[this.heap.length-1];
        this.heap.pop();
        var index = 0;
        var c1 = index * 2 + 1;
        var c2 = index * 2 + 2;
        while(c1 < this.heap.length || c2 < this.heap.length) {
            if(c1 < this.heap.length && c2 < this.heap.length) {
                if(this.heap[c1][1] >= this.heap[c2][1]) {
                    if(this.heap[c2][1] < this.heap[index][1]) {
                        temp = this.heap[index];
                        this.heap[index] = this.heap[c2];
                        this.heap[c2] = temp;
                    }
                    else {
                        break;
                    }
                    index = c2;
                    c1 = index * 2 + 1;
                    c2 = index * 2 + 2;
                }
                else {
                     if(this.heap[c1][1] < this.heap[index][1]) {
                        temp = this.heap[index];
                        this.heap[index] = this.heap[c1];
                        this.heap[c1] = temp;
                        
                    }
                    else {
                        break;
                    }
                    index = c1;
                    c1 = index * 2 + 1;
                    c2 = index * 2 + 2;
                }
            }
            else if(c1 < this.heap.length) {
                if(this.heap[c1][1] < this.heap[index][1]) {
                    temp = this.heap[index];
                    this.heap[index] = this.heap[c1];
                    this.heap[c1] = temp;
                }
                index = c1;
                c1 = index * 2 + 1;
                c2 = index * 2 + 2;
            }
        }
        return curr;
    }
    size() {
        return this.heap.length;
    }
    peek() {
        return this.heap[0];
    }
}

function startClick() {
    if(document.getElementById("startButton").value == 0) {
        alert("Please select the starting node");
        startFunction();
    }
    else {
        alert("You have already selected a starting node. Please reset to select a new one");
    }
}
function endClick() {
    if(document.getElementById("endButton").value == 0) {
        alert("Please select the ending node.");
        endFunction();
    }
    else {
        alert("You have already selected an ending node. Please reset to select a new one");
    }
}

function startFunction() {
    resetListeners("start");
    for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).addEventListener("click", clickedStart);
    }
    }
function endFunction() {
    resetListeners("end");
    for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).addEventListener("click", clickedEnd);
    }
}

function resetClick() {
    resetListeners("reset");
    document.getElementById("startButton").value = 0;
    document.getElementById("endButton").value = 0;
    gridval = 0;
    for (x = 0; x < 20; x++) {
        for(y = 0; y < 20; y++) {
            arr[x][y] = new gridNode(gridval.toString(), 0, x, y,0);
            gridval++;
        }
    }
    for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).style.animationName = "";
        document.getElementById(x.toString()).style.backgroundColor = "";
        document.getElementById("label_"+x.toString()).value = 0;
        document.getElementById("label_"+x.toString()).style.display = "none";
    }
}

function blockClick() {
    alert("Add roadblocks by clicking on the cells");
    resetListeners("block");
    for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).addEventListener("mousedown",clickedBlock);
        document.getElementById(x.toString()).addEventListener("mousemove",clickedBlock);
        document.body.addEventListener("mouseup",clickedBlock);
    }
}

async function findClick() {
    resetListeners("find");
    document.getElementById("findButton").disabled = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("blockButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("endButton").disabled = true;
    document.getElementById("weightButton").disabled = true;
    document.getElementById("randomButton").disabled = true;
    document.getElementById("selector").disabled = true;
    if(document.getElementById("startButton").value != 1 || document.getElementById("endButton").value != 1) {
        if(document.getElementById("startButton").value != 1 && document.getElementById("endButton").value != 1) {
            alert("Please select both a starting node and ending node");
        }
        else if(document.getElementById("startButton").value != 1) {
            alert("Please select a starting node");
        }
        else {
            alert("Please select an ending node");
        }
    }
    else {
    if(startNode == endNode ) {
        alert("The start and end nodes are the same, the length is 0!");
        return;
    }
    for(x = 0; x < 20; x++) {
        for(y = 0; y < 20; y++) {
            if(arr[x][y].val == 0 || arr[x][y].val == 4) {
                document.getElementById(arr[x][y].id).style.backgroundColor = "";
                document.getElementById(arr[x][y].id).style.animationName = "";
            }
        }
    }
    method = document.getElementById("selector");
    method = method.options[method.selectedIndex].value;
    if(method == "BFS") {
       await BFSFunction();
    }
    else if(method == "dijkstra") {
        await DijkstraFunction();
    }
    else if(method == "Astar") {
        await AstarFunction();
    }
}
document.getElementById("findButton").disabled = false;
document.getElementById("startButton").disabled = false;
document.getElementById("blockButton").disabled = false;
document.getElementById("resetButton").disabled = false;
document.getElementById("endButton").disabled = false;
document.getElementById("weightButton").disabled = false;
document.getElementById("randomButton").disabled = false;
document.getElementById("selector").disabled = false;
}

function weightClick() {
    resetListeners("weight");
    for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).addEventListener("click", clickedWeight);
    }
}

async function genClick() {
    resetListeners("find");
    resetClick();
    document.getElementById("findButton").disabled = true;
    document.getElementById("startButton").disabled = true;
    document.getElementById("blockButton").disabled = true;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("endButton").disabled = true;
    document.getElementById("weightButton").disabled = true;
    document.getElementById("randomButton").disabled = true;
    document.getElementById("selector").disabled = true;

    await genMaze(0,19,0,19);


    document.getElementById("findButton").disabled = false;
    document.getElementById("startButton").disabled = false;
    document.getElementById("blockButton").disabled = false;
    document.getElementById("resetButton").disabled = false;
    document.getElementById("endButton").disabled = false;
    document.getElementById("weightButton").disabled = false;
    document.getElementById("randomButton").disabled = false;
    document.getElementById("selector").disabled = false;
}

async function genMaze(sx, ex, sy, ey) {
    if((ex - sx < 2) || (ey - sy < 2)) {
        return;
    }
    orient = Math.floor(Math.random() * 2);
    if(orient == 0) {
        wallIndex = Math.floor((Math.random() * (ey - sy)) + sy);
        numOfOpenings = Math.floor(Math.random() * (ex - sx));
        openings = [];
        for(i = 0; i <= numOfOpenings; i++) {
            openings[i] = Math.floor((Math.random() * (ex - sx)) + sx);
        }
        for(x = sx; x <= ex; x++) {
            if(openings.includes(x) == false) {
                //add wall
                document.getElementById(arr[x][wallIndex].id).style.animationName = "blockFiller";
                document.getElementById(arr[x][wallIndex].id).style.animationDuration = "1s";
                document.getElementById(arr[x][wallIndex].id).style.animationFillMode = "forwards";
                arr[x][wallIndex].val = 3;
            }
        }
        genMaze(sx, ex, sy, wallIndex-1);
        genMaze(sx, ex, wallIndex + 1, ey);
    }
    else {
        wallIndex = Math.floor((Math.random() * (ex - sx)) + sx);
        numOfOpenings = Math.floor(Math.random() * (ey - sy));
        openings = [];
        for(i = 0; i <= numOfOpenings; i++) {
            openings[i] = Math.floor((Math.random() * (ey - sy)) + sy);
        }
        for(x = sy; x <= ey; x++) {
            if(openings.includes(x) == false) {
                //add wall
                document.getElementById(arr[wallIndex][x].id).style.animationName = "blockFiller";
                document.getElementById(arr[wallIndex][x].id).style.animationDuration = "1s";
                document.getElementById(arr[wallIndex][x].id).style.animationFillMode = "forwards";
                arr[wallIndex][x].val = 3;
            }
        }
        genMaze(sx, wallIndex - 1, sy, ey);
        genMaze(wallIndex + 1, ex, sy, ey);
    }


}

function clickedStart(event) {
    if(event.target.id <= 19) {
        if(arr[0][parseInt(event.target.id)].val != 0) {
            return;
        }
    }
    else if(arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val != 0) {
        return;
    }
    if(document.getElementById("startButton").value == 0) {
        document.getElementById("startButton").value = 1;
        event.target.style.animationName = "startFiller";
        event.target.style.animationDuration = "1s";
        event.target.style.animationFillMode = "forwards";
        if(parseInt(event.target.id) <= 19) {
            arr[0][parseInt(event.target.id)].val = 1;
            startNode = arr[0][parseInt(event.target.id)];
        }
        else {
        arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val = 1;
        startNode = arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)];
        } }
    
}
function clickedEnd(event) {
    if(event.target.id <= 19) {
        if(arr[0][parseInt(event.target.id)].val != 0) {
            return;
        }
    }
    else if(arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val != 0) {
        return;
    }
    if(document.getElementById("endButton").value == 0) {
        document.getElementById("endButton").value = 1;
        event.target.style.animationName = "endFiller";
        event.target.style.animationDuration = "1s";
        event.target.style.animationFillMode = "forwards";
        if(parseInt(event.target.id) <= 19) {
            arr[0][parseInt(event.target.id)].val = 2;
            endNode = arr[0][parseInt(event.target.id)];
        }
        else {
        arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val = 2;
        endNode = arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)];
        } 
        }

}
function clickedBlock(event) {
    if(event.type == "mousedown") {
        mousemove = true;
    }
    else if(event.type == "mouseup") {
        mousemove = false;
    }
    if(mousemove == true) {
    if(parseInt(event.target.id) <= 19) {
        if(arr[0][parseInt(event.target.id)].val != 0) {
            return;
        }
        event.target.style.animationName = "blockFiller";
        event.target.style.animationDuration = "1s";
        event.target.style.animationFillMode = "forwards";
        arr[0][parseInt(event.target.id)].val = 3;
    }
    else {
    if(arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val != 0) {
        return;
    }
    event.target.style.animationName = "blockFiller";
    event.target.style.animationDuration = "2s";
    event.target.style.animationFillMode = "forwards";
    arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val = 3;
}
}
}
function clickedWeight(event) {
    if(parseInt(event.target.id) <= 19) {
        if(arr[0][parseInt(event.target.id)].weight == 0 && arr[0][parseInt(event.target.id)].val != 0) {
            return;
        }
    }
    else if(arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].weight == 0 &&
        arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val != 0) {
        return;
    }
    if(document.getElementById("label_"+ event.target.id.toString()).value == 0) {
        document.getElementById("label_"+ event.target.id.toString()).style.display = "initial";
    }
        document.getElementById("label_"+ event.target.id.toString()).value++;
        if(parseInt(event.target.id) <= 19) {
            arr[0][parseInt(event.target.id)].weight = document.getElementById("label_"+ event.target.id.toString()).value;
            arr[0][parseInt(event.target.id)].val = 4;
        }
        else {
            arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].weight = document.getElementById("label_"+ event.target.id.toString()).value;
            arr[Math.floor(parseInt(event.target.id) / 20)][parseInt(event.target.id) % (Math.floor(parseInt(event.target.id) / 20) * 20)].val = 4;
        }
        document.getElementById("label_"+ event.target.id.toString()).innerHTML = document.getElementById("label_"+ event.target.id.toString()).value;
    
}

function resetListeners(func) {
    if(func == "start") {
        for(x = 0; x < 400; x++) {
            document.getElementById(x.toString()).removeEventListener("mousedown",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("mousemove",clickedBlock);
            document.body.removeEventListener("mouseup",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("click", clickedEnd);
            document.getElementById(x.toString()).removeEventListener("click", clickedWeight);
        }
    }
    else if(func == "end") {
        for(x = 0; x < 400; x++) {
            document.getElementById(x.toString()).removeEventListener("mousedown",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("mousemove",clickedBlock);
            document.body.removeEventListener("mouseup",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("click",clickedStart);
            document.getElementById(x.toString()).removeEventListener("click", clickedWeight);
        }
    }
    else if(func == "reset" || func == "find") {
        for(x = 0; x < 400; x++) {
            document.getElementById(x.toString()).removeEventListener("mousedown",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("mousemove",clickedBlock);
            document.getElementById(x.toString()).removeEventListener("mouseup",clickedBlock);
            document.body.removeEventListener("click",clickedStart);
            document.getElementById(x.toString()).removeEventListener("click", clickedEnd);
            document.getElementById(x.toString()).removeEventListener("click", clickedWeight);
        }
    }
    else if(func == "block") {
        for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).removeEventListener("click",clickedStart);
        document.getElementById(x.toString()).removeEventListener("click", clickedEnd);
        document.getElementById(x.toString()).removeEventListener("click", clickedWeight);
        }
    }
    else if(func == "weight") {
        for(x = 0; x < 400; x++) {
        document.getElementById(x.toString()).removeEventListener("click",clickedStart);
        document.getElementById(x.toString()).removeEventListener("click", clickedEnd);
        document.getElementById(x.toString()).removeEventListener("mousedown",clickedBlock);
        document.getElementById(x.toString()).removeEventListener("mousemove",clickedBlock);
        document.getElementById(x.toString()).removeEventListener("mouseup",clickedBlock);
        }
    }
}



const delay = time => new Promise(done => setTimeout(done, time));

//Search Algorithm functions
 async function BFSFunction() {    
    var prev = [];
    var queue = [];
    var dist = [];
    for( x= 0; x < 400; x++) {
        dist[x] = Math.pow(10,1000);
    }
    dist[parseInt(startNode.id)] = 0;
    var curr;
    distval = 1;
    queue.push(startNode);
    while(queue.length > 0) {
        curr = queue.shift();
        await bfshelper(prev,queue, dist, distval, curr);
        distval++;
        if(prev[parseInt(endNode.id)]) {
            break;
        }
    }
    if(prev[parseInt(endNode.id)]) {
        curr = prev[parseInt(endNode.id)];
        while(curr != startNode) {
            await delay(25);
            document.getElementById(curr.id).style.animationName = "finishFiller";
            document.getElementById(curr.id).style.animationDuration = "1s";
            document.getElementById(curr.id).style.animationFillMode = "forwards";
            await delay(25);
            curr = prev[parseInt(curr.id)];
        }
    }
    else {
        alert("There is no possilbe path");
    }
}
 async function bfshelper(prev, queue, dist, distval, curr) {
    if((curr.x + 1 <= 19)) {
        if(arr[curr.x + 1][curr.y].val == 0 || arr[curr.x + 1][curr.y].val == 2 || arr[curr.x + 1][curr.y].val == 4) {
            if(distval < dist[parseInt(arr[curr.x+1][curr.y].id)]) {
                dist[parseInt(arr[curr.x+1][curr.y].id)] = distval;
                if(arr[curr.x + 1][curr.y].val != 2) {
                 await delay(25);   
                 document.getElementById(arr[curr.x+1][curr.y].id).style.animationName = "findFiller";
                 document.getElementById(arr[curr.x+1][curr.y].id).style.animationDuration = "1s";
                 document.getElementById(arr[curr.x+1][curr.y].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x+1][curr.y].id)] = curr;
                queue.push(arr[curr.x+1][curr.y]);
            }

        }
    }
    if((curr.x - 1 >= 0)) {
        if(arr[curr.x - 1][curr.y].val == 0 || arr[curr.x - 1][curr.y].val == 2 || arr[curr.x - 1][curr.y].val == 4) {
            if(distval < dist[parseInt(arr[curr.x - 1][curr.y].id)]) {
                dist[parseInt(arr[curr.x - 1][curr.y].id)] = distval;
                if(arr[curr.x - 1][curr.y].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x - 1][curr.y].id)] = curr;
                queue.push(arr[curr.x - 1][curr.y]);
            }

        }
    }
    if((curr.y + 1 <= 19)) {
        if(arr[curr.x][curr.y + 1].val == 0 || arr[curr.x][curr.y + 1].val == 2 || arr[curr.x][curr.y + 1].val == 4) {
            if(distval < dist[parseInt(arr[curr.x][curr.y + 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y + 1].id)] = distval;
                if(arr[curr.x][curr.y + 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x][curr.y + 1].id)] = curr;
                queue.push(arr[curr.x][curr.y + 1]);
            }

        }
    }
    if((curr.y - 1 >= 0)) {
        if(arr[curr.x][curr.y - 1].val == 0 || arr[curr.x][curr.y - 1].val == 2 || arr[curr.x][curr.y - 1].val == 4) {
            if(distval < dist[parseInt(arr[curr.x][curr.y - 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y - 1].id)] = distval;
                if(arr[curr.x][curr.y - 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x][curr.y - 1].id)] = curr;
                queue.push(arr[curr.x][curr.y - 1]);
            }

        }
    }
    



 }






//Dijkstra Function which will be used for weightde graphs, where the node carries a weight property that tells the path length for any node to enter it.

async function DijkstraFunction() {
    var prev = [];
    var queue = [];
    var dist = [];
    for( x= 0; x < 400; x++) {
        dist[x] = Math.pow(10,1000);
    }
    dist[parseInt(startNode.id)] = 0;
    var curr;
    queue.push(startNode);
    while(queue.length > 0) {
        curr = queue.shift();
        await dijkstrahelper(prev,queue, dist, curr);
    }
    if(prev[parseInt(endNode.id)]) {
        curr = prev[parseInt(endNode.id)];
        while(curr != startNode) {
            await delay(25);
            document.getElementById(curr.id).style.animationName = "finishFiller";
            document.getElementById(curr.id).style.animationDuration = "1s";
            document.getElementById(curr.id).style.animationFillMode = "forwards";
            await delay(25);
            curr = prev[parseInt(curr.id)];
        }
    }
    else {
        alert("There is no possilbe path");
    }
}
 async function dijkstrahelper(prev, queue, dist, curr) {
    if((curr.x + 1 <= 19)) {
        if(arr[curr.x + 1][curr.y].val == 0 || arr[curr.x + 1][curr.y].val == 2 || arr[curr.x + 1][curr.y].val == 4 ) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x + 1][curr.y].weight;
            if( distval < dist[parseInt(arr[curr.x + 1][curr.y].id)]) {
                dist[parseInt(arr[curr.x + 1][curr.y].id)] = distval;
                if(arr[curr.x + 1][curr.y].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x + 1][curr.y].id)] = curr;
                queue.push(arr[curr.x + 1][curr.y]);
            }
            
        }
    }
    if((curr.x - 1 >= 0)) {
        if(arr[curr.x - 1][curr.y].val == 0 || arr[curr.x - 1][curr.y].val == 2 || arr[curr.x - 1][curr.y].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x -1][curr.y].weight;
            if(  distval < dist[parseInt(arr[curr.x - 1][curr.y].id)]) {
                dist[parseInt(arr[curr.x - 1][curr.y].id)] = distval;
                if(arr[curr.x - 1][curr.y].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x - 1][curr.y].id)] = curr;
                queue.push(arr[curr.x - 1][curr.y]);
            }
            
        }
    }
    if((curr.y + 1 <= 19)) {
        if(arr[curr.x][curr.y + 1].val == 0 || arr[curr.x][curr.y + 1].val == 2 || arr[curr.x][curr.y + 1].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x][curr.y + 1].weight;
            if(distval < dist[parseInt(arr[curr.x][curr.y + 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y + 1].id)] = distval;
                if(arr[curr.x][curr.y + 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x][curr.y + 1].id)] = curr;
                queue.push(arr[curr.x][curr.y + 1]);
            }

        }
    }
    if((curr.y - 1 >= 0)) {
        if(arr[curr.x][curr.y - 1].val == 0 || arr[curr.x][curr.y - 1].val == 2 || arr[curr.x][curr.y - 1].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x][curr.y - 1].weight;
            if(distval < dist[parseInt(arr[curr.x][curr.y - 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y - 1].id)] = distval;
                if(arr[curr.x][curr.y - 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationDuration = "1s";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationFillMode = "forwards";
                }
                prev[parseInt(arr[curr.x][curr.y - 1].id)] = curr;
                queue.push(arr[curr.x][curr.y - 1]);
            }
        }
    }


 }

//distance heuristic calculating fucntion
function distance(x1,y1,x2,y2) {
    if(x1 == x2 && y1 == y2) {
        return 0;
    }
    else {
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    }
}

 //A* Algorithm
 async function AstarFunction() {
     var seen = [];
     for(i = 0; i< 400 ; i ++) {
         seen[i] = false;
     }
     seen[parseInt(startNode.id)] = true;
    var prev = [];
    const heap = new gridHeap(); //priority queue to help with sorting heuristic and weights sums
    var dist = [];
    for( x= 0; x < 400; x++) {
        dist[x] = Math.pow(10,1000);
    }
    dist[parseInt(startNode.id)] = 0;
    var curr;
    heap.push([startNode,distance(startNode.x,startNode.y, endNode.x,endNode.y)]);
    while(heap.size() > 0) {
        curr = heap.pop();
        await Astarhelper(heap,prev,seen, dist, curr[0]);
        if(prev[parseInt(endNode.id)]) {
            break;
        }
    }
    if(prev[parseInt(endNode.id)]) {
        curr = prev[parseInt(endNode.id)];
        while(curr != startNode) {
            await delay(25);
            document.getElementById(curr.id).style.animationName = "finishFiller";
            document.getElementById(curr.id).style.animationDuration = "1s";
            document.getElementById(curr.id).style.animationFillMode = "forwards";
            await delay(25);
            curr = prev[parseInt(curr.id)];
        }
    }
    else {
        alert("There is no possilbe path");
    }
 }

 async function Astarhelper(heap, prev, seen, dist, curr) {
    if((curr.x + 1 <= 19) && seen[parseInt(arr[curr.x+1][curr.y].id)] != true) {
        if(arr[curr.x + 1][curr.y].val == 0 || arr[curr.x + 1][curr.y].val == 2 || arr[curr.x + 1][curr.y].val == 4 ) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x + 1][curr.y].weight;
            if( distval < dist[parseInt(arr[curr.x + 1][curr.y].id)]) {
                dist[parseInt(arr[curr.x + 1][curr.y].id)] = distval;
                if(arr[curr.x + 1][curr.y].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationDuration = ".8s";
                    document.getElementById(arr[curr.x+1][curr.y].id).style.animationFillMode = "forwards";
                    seen[parseInt(arr[curr.x+1][curr.y].id)] = true;
                }
                prev[parseInt(arr[curr.x + 1][curr.y].id)] = curr;
            }
            heap.push([arr[curr.x + 1][curr.y],distance(curr.x + 1,curr.y, endNode.x, endNode.y) + arr[curr.x + 1][curr.y].weight]);
        }
    }
    if((curr.x - 1 >= 0) && seen[parseInt(arr[curr.x-1][curr.y].id)] != true) {
        if(arr[curr.x - 1][curr.y].val == 0 || arr[curr.x - 1][curr.y].val == 2 || arr[curr.x - 1][curr.y].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x -1][curr.y].weight;
            if(  distval < dist[parseInt(arr[curr.x - 1][curr.y].id)]) {
                dist[parseInt(arr[curr.x - 1][curr.y].id)] = distval;
                if(arr[curr.x - 1][curr.y].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationDuration = ".8s";
                    document.getElementById(arr[curr.x - 1][curr.y].id).style.animationFillMode = "forwards";
                    seen[parseInt(arr[curr.x-1][curr.y].id)] = true;
                }
                prev[parseInt(arr[curr.x - 1][curr.y].id)] = curr;
            }
        heap.push([arr[curr.x - 1][curr.y],distance(curr.x - 1, curr.y, endNode.x, endNode.y) + arr[curr.x - 1][curr.y].weight]);
            
        }
    }
    if((curr.y + 1 <= 19) && seen[parseInt(arr[curr.x][curr.y + 1].id)] != true) {
        if(arr[curr.x][curr.y + 1].val == 0 || arr[curr.x][curr.y + 1].val == 2 || arr[curr.x][curr.y + 1].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x][curr.y + 1].weight;
            if(distval < dist[parseInt(arr[curr.x][curr.y + 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y + 1].id)] = distval;
                if(arr[curr.x][curr.y + 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationDuration = ".8s";
                    document.getElementById(arr[curr.x][curr.y + 1].id).style.animationFillMode = "forwards";
                    seen[parseInt(arr[curr.x][curr.y + 1].id)] = true;
                }
                prev[parseInt(arr[curr.x][curr.y + 1].id)] = curr;
            }
            heap.push([arr[curr.x][curr.y + 1],distance(curr.x, curr.y + 1 ,endNode.x, endNode.y) + arr[curr.x][curr.y + 1].weight]);
        }
    }
    if((curr.y - 1 >= 0) && seen[parseInt(arr[curr.x][curr.y - 1].id)] != true) {
        if(arr[curr.x][curr.y - 1].val == 0 || arr[curr.x][curr.y - 1].val == 2 || arr[curr.x][curr.y - 1].val == 4) {
            distval = dist[parseInt(arr[curr.x][curr.y].id)] + arr[curr.x][curr.y - 1].weight;
            if(distval < dist[parseInt(arr[curr.x][curr.y - 1].id)]) {
                dist[parseInt(arr[curr.x][curr.y - 1].id)] = distval;
                if(arr[curr.x][curr.y - 1].val != 2) {
                    await delay(25); 
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationName = "findFiller";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationDuration = ".8s";
                    document.getElementById(arr[curr.x][curr.y - 1].id).style.animationFillMode = "forwards";
                    seen[parseInt(arr[curr.x][curr.y - 1].id)] = true;
                }
                prev[parseInt(arr[curr.x][curr.y - 1].id)] = curr;
            }
            heap.push([arr[curr.x][curr.y - 1],distance(curr.x,curr.y - 1, endNode.x, endNode.y) + arr[curr.x][curr.y - 1].weight]);
        }

    }

 }
























 