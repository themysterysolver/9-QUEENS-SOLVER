document.getElementById("pop").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: solveIt
    });
});
function solveIt(){
    let iframe_coll=document.getElementsByClassName("game-launch-page__iframe w-full")[0];
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
            clr.set(clr.has(val.classList[1].slice(-1)),true);
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

        let directions=[[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

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
    display(board);

    console.log("CHECKPOINT-1");
    console.log(row,col,clr);
    display(board);

    function backtrack(r){
        if(r===board.length){
            return true;
        }
        for(let c=0;c<size;c++){
            let nidx=r*size+c;
            let clrr=grid_clr.get(nidx);
            if(is_safe(nidx,r,c,clrr)){
                board[nidx]=1;
                row[r]=true;
                col[c]=true;
                clr.set(clrr, true);
                if(backtrack(r+1))return true;
                board[nidx]=0;
                row[r]=false;
                col[c]=false;
                clr.set(clrr,false);
            }
        }
        return false;
    }
    backtrack(0);
    function placeQueenAtIndex(index){
        let tile = iframe.querySelector(`[data-cell-idx="${index}"]`);
    
        if (tile) {
            console.log(`Clicking tile with index ${index}`);
    
            function clickElement(element) {
                let down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
                let up = new MouseEvent("mouseup", { bubbles: true, cancelable: true });
                let click = new MouseEvent("click", { bubbles: true, cancelable: true });
    
                element.dispatchEvent(down);
                element.dispatchEvent(up);
                element.dispatchEvent(click);
            }
    
            clickElement(tile);
            setTimeout(() => clickElement(tile), 100);
        } else {
            console.log("Tile not found!");
        }
    }
    let populate=(()=>{
        for(let i=0;i<board.length;i++){
            if(board[i]===1 && !locked.includes(i)){
                placeQueenAtIndex(i);
            }
        }
    });
    populate();
}