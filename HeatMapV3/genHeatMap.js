const canvas = document.getElementById("canvas");
const div = document.getElementById("canvasDiv");
const ctx = canvas.getContext("2d");
const button = document.getElementById("generate-heatmap");
const img = new Image();
let heatmapInstance;

var allData = [];

const heatLayer = document.createElement('div');
heatLayer.id = 'heatLayer';
document.getElementById('canvasDiv').appendChild(heatLayer);

img.src = "KogniTyrimas1.jpg";
img.onload = () => {
    const MULT = 13;
    const targetWidth  = 150 * MULT;
    const targetHeight = Math.round(targetWidth * img.naturalHeight / img.naturalWidth);

    div.style.width  = targetWidth  + 'px';
    div.style.height = targetHeight + 'px';

    canvas.width  = targetWidth;
    canvas.height = targetHeight;
    
    heatLayer.style.width  = targetWidth  + 'px';
    heatLayer.style.height = targetHeight + 'px';

    heatmapInstance = h337.create({
    container: heatLayer,
    radius: 60,
    maxOpacity: 0.6,
    blur: 0.8,
    gradient: {
        '.2': 'blue',
        '.4': 'cyan',
        '.6': 'lime',
        '.8': 'yellow',
        '1.0': 'red'
    }
    });
    
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
};

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Start(read)
{
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = "grey";
    const StartingDots = [
        {x:211, y:147, value: 100},
        {x:1572, y:306, value: 100},
        {x:211, y:306, value: 100},
        {x:1572, y:147, value: 100}
    ];

    /*heatmapInstance.setData({
        max: 100,
        data: StartingDots
    });  */ 

    ctx.fillStyle = 'lime';
    for (const d of StartingDots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 10, 0, Math.PI*2);
        ctx.fill();
    }
    if(read)ReadData();
}

function ReadData() 
{
    fetch("IdPointsTime.csv")
        .then(r => r.text())
        .then(async text => {
            const rows = text.trim().split("\n");

            for (let i = 1; i < rows.length; i++) 
            {
                const [id, x, y, time] = rows[i].split(",");
                const cleanId = id.trim();
                allData.push([cleanId, +x, +y, +time]);
            }

            KurtiPasirinkimus();
        });
}
async function Gen(selectedId) 
{
    heatmapInstance.setData({ max: 100, data: [] });
    Start(false);
    let redDotsData = [];

    for (var i = 0; i < allData.length; i++) 
    {
        var id = allData[i][0];
        if (id != selectedId) continue;
        var x = allData[i][1];
        var y = allData[i][2];
        var time = allData[i][3];

        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.arc(x * 6 + 550, y * 6 + 250, 5, 0, Math.PI * 2);
        ctx.fill();

        redDotsData.push({
            x: x * 6 + 550,
            y: y * 6 + 250,
            value: time 
        });
        console.log(id);
    }
    let maxVal = Math.max(...redDotsData.map(d => d.value), 1);
    heatmapInstance.setData({
        max: maxVal,
        data: redDotsData
    });
}

function KurtiPasirinkimus()
{
    var chooseDiv = document.getElementById("chooseId");
    chooseDiv.innerHTML = "";
    var button = document.createElement("button");
    button.id = "Pasirinkimas";
    button.textContent = "Pasirinkti";
    chooseDiv.appendChild(button);
    var select = document.createElement("select");
    select.id = "SelectedId";
    var uniqueIds = UniqueIds();
    console.log(uniqueIds);
    for(var i=0; i<uniqueIds.length; i++)
    {
        var option = document.createElement("option");
        option.value = uniqueIds[i];
        option.text = uniqueIds[i];
        select.appendChild(option);
    }
    chooseDiv.appendChild(select);

    button.onclick = function() {
        var selectedId = select.value;
        Gen(selectedId);
    };
}

function UniqueIds()
{
    var uniqueIds = [];
    for(var i=0; i<allData.length; i++)
    {
        var id = allData[i][0];
        if(!uniqueIds.includes(id))
        {
            uniqueIds.push(id);
        }
    }
    return uniqueIds;
}
