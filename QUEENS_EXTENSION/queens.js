document.getElementById("pop").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: solveIt
    });
});
function solveIt(){
    let iframe_coll=document.getElementsByClassName("game-launch-page__iframe")[0];
    console.log(iframe_coll);
    let iframe=iframe_coll.contentDocument||iframe_coll.contentWindow?.document;
    const content=iframe.getElementsByClassName("queens-cell-with-border");
    console.log(content);
    let board=Array.from(content,(el)=>el.getAttribute("aria-label").includes("Queen")?1:0);
    console.log(board);
}