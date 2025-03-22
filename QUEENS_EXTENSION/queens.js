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

    Array.from(board).forEach((val,idx)=>{
        if(val==1){
            row[Math.floor(idx/size)]=true;
            col[idx%size]=true;
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
}