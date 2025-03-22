document.getElementById("pop").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: solveIt
    });
});
function solveIt(){
    let iframe_coll=document.getElementsByClassName("game-launch-page__iframe")[0];
    //console.log(iframe_coll);
    let iframe=iframe_coll.contentDocument||iframe_coll.contentWindow?.document;
    const content=iframe.getElementsByClassName("queens-cell-with-border");
    //console.log(content);
    let board=Array.from(content,(el)=>el.getAttribute("aria-label").includes("Queen")?1:0);
    //console.log(board);

    let size=Math.sqrt(board.length);
    //console.log(size);

    let grid_clr=new Map();
    //let add_to_map=(idx,value)=> !grid_clr.has(value)?grid_clr.set(value,[idx]):grid_clr.get(value).push(idx);
    Array.from(content).forEach((val,idx)=>grid_clr.set(idx,val.classList[1].slice(-1)));

    //console.log([...grid_clr]);

    let row=Array(size).fill(false);
    let col=Array(size).fill(false);
    let clr=new Map();
    const locked=[]
    Array.from(board).forEach((val,idx)=>{
        if(val==1){
            row[Math.floor(idx/size)]=true;
            col[idx%size]=true;
            locked.push(idx);
        }
    });
    //console.log(row,col);

    Array.from(content).forEach((val,idx)=>{
        if(board[idx]==1){
            clr.set(val.classList[1].slice(-1),true);
        }
        else{
            if(!clr.has(val.classList[1].slice(-1))){
                clr.set(val.classList[1].slice(-1),false);
            }
        }
    });
    //console.log(clr);
    let adj=(idx)=>{
        let r_idx=Math.floor(idx/size);
        let c_idx=idx%size;

        let directions=[[0,1],[1,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[0,0]];

        return directions.some(([dx,dy])=>{
            let nx=r_idx+dx;
            let ny=c_idx+dy;
            let nidx=nx*size+ny;

            return nx>=0 && nx<size && ny>=0 && ny<size && board[nidx]===1;
        });
    };
    function is_safe(idx,r,c,clrr){
        if(row[r]||col[c]||clr.get(clrr)||adj(idx)){
            return false;
        }
        return true;
    }
    let display=(board)=>{
        for(let i=0;i<board.length;i+=size){
            console.log(board.slice(i,i+size));
        }
    }
    //display(board);
    function backtrack(idx){
        if(idx===board.length){
            console.log("FOUND!");
            display(board);
            console.log(row,col,clr);
            return true;
        }

        if(board[idx]===1 || locked.includes(idx)){
            return backtrack(idx+1);
        }
        let r=Math.floor(idx/size);
        let c=idx%size;
        let clrr=grid_clr.get(idx);
        if(is_safe(idx,r,c,clrr)){
            board[idx]=1
            row[r]=true;
            col[c]=true;
            clr.set(clrr,true);

            if(backtrack(idx+1))return true;
            
            board[idx]=0
            row[r]=false;
            col[c]=false;
            clr.set(clrr,false);
        }
        return backtrack(idx+1);
    }
    backtrack(0);
    //display(board);
    //console.log(board);
}