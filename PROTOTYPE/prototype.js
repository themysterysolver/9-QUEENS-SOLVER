let board=[0, 0, 1, 0, 0, 0, 0, 0,
            0,0, 0, 0, 0, 0, 0, 1,
            0, 0,0, 0, 0, 0, 0, 0,
            0, 0, 0,0, 0, 0, 0, 0,
            0, 0, 0, 0,0, 0, 0, 0,
            0, 0, 0, 0, 0,0, 0, 0,
            0, 0, 0, 0, 0, 0,0, 0,
            0, 0, 0, 0, 0, 0, 0, 0]

const size=8;
let row=[true, true, false, false, false, false, false, false]
let col=[false, false, true, false, false, false, false, true]

const locked=[2, 15]

let clr_data = {
    0: "2",  1: "2",  2: "2",  3: "2",  4: "2",  5: "2",  6: "2",  7: "2",
    8: "2",  9: "1", 10: "2", 11: "1", 12: "2", 13: "2", 14: "2", 15: "0",
   16: "3", 17: "1", 18: "2", 19: "1", 20: "2", 21: "1", 22: "2", 23: "0",
   24: "3", 25: "1", 26: "1", 27: "1", 28: "1", 29: "1", 30: "1", 31: "0",
   32: "3", 33: "4", 34: "1", 35: "1", 36: "1", 37: "1", 38: "1", 39: "0",
   40: "3", 41: "4", 42: "4", 43: "1", 44: "1", 45: "1", 46: "5", 47: "0",
   48: "3", 49: "4", 50: "4", 51: "6", 52: "6", 53: "7", 54: "5", 55: "0",
   56: "3", 57: "4", 58: "4", 59: "6", 60: "6", 61: "7", 62: "5", 63: "0"
};

//CLR MAPPING

let grid_clr = new Map();
for (const key in clr_data) {
    grid_clr.set(parseInt(key), clr_data[key]);
}

const clr = new Map([
    ["0", true],//INITIAL-VIOLET
    ["1", false],
    ["2", true],//INITIAL-BLUE
    ["3", false],
    ["4", false],
    ["5", false],
    ["6", false],
    ["7", false]
]);

//-------------------------BOARD STRUCTURE------------------------------------------------------

let adj=(idx)=>{
    let r_idx=Math.floor(idx/size);
    let c_idx=idx%size;

    let directions=[[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

    return directions.some(([dx,dy])=>{
        let nx=r_idx+dx;
        let ny=c_idx+dy;
        let nidx=nx*size+ny;

        return nx>=0 && nx<size && ny>=0 && ny<size && board[nidx]===1;
    });
};

function is_safe(idx,r,c,clrr){
    if(row[r]||col[c]||clr.get(clrr)||adj(idx)||locked.includes(idx)){
        return false;
    }
    return true;
}

let display=(board)=>{
    console.log(board.map((val, idx) => (idx % size === 0 ? "\n" : "") + val).join(", "));
}

//-------------HELPER-FUNCTIONS--------------------------------

console.log("CHECKPOINT-1")
display(board)

//------------------BACKTRACKING------------------------------
console.log("BACKTRACKING");

let result=[];
function backtrack(r){
    if(r===size){
        result=structuredClone(board);
        console.log("Hey!FOUND IT!");
        return
    }
    for(let c=0;c<size;c++){
        let idx=r*size+c;
        let color=grid_clr.get(idx);

        if(is_safe(idx,r,c,color)){
            board[idx]=1
            row[r]=true;
            col[c]=true;
            clr.set(color,true);
            backtrack(r+1);
            board[idx]=0
            row[r]=false;
            col[c]=false;
            clr.set(color,false);
        }
    }
}
backtrack(0);

console.log("AFTER-BACKTRACKING");
display(result);
