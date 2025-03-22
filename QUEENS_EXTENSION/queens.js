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

    console.log([...grid_clr]);

    let get_row=(idx)=>{
        let row_start_index=Math.floor(idx/size)*size;
        return Array.from({length:size},(_,i)=>board[row_start_index+i]);
    };

    let get_col=(idx)=>{
        let col_start_index=idx%size;
        return Array.from({length:size},(_,i)=>board[col_start_index+i*size]);
    };
    let row=Array(size).fill(false);
    let col=Array(size).fill(false);
    let clr=new Map();
    

    Array.from(board).forEach((val,idx)=>{
        if(val==1){
            row[Math.floor(idx/size)]=true;
            col[idx%size]=true;
        }
    });

    
}