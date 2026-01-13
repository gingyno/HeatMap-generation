const canvas = document.getElementById("canvas");
const div = document.getElementById("canvasDiv");
const ctx = canvas.getContext("2d");
const button = document.getElementById("generate-heatmap");
const img = new Image();

var allData = [];

img.src = "KogniTyrimas1.jpg";
img.onload = () =>
{
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
}

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Start(read)
{
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = "grey";
    const StartingDots = [{x:211, y:147}, {x:1572, y:306}, {x:211, y:306}, {x: 1572, y:147}];
    ctx.fillStyle = 'lime';
    for (const d of StartingDots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 20, 0, Math.PI*2);
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

            for (let i = 1; i < rows.length; i++) {          // skip header
                const [id, x, y, time] = rows[i].split(",");
                allData.push([id, +x, +y, +time]);
            }

            KurtiPasirinkimus();   // <-- build the list only now
        });
}
function getColor(time) 
{
    const colorStops = [
        { time: 80, color: [0, 0, 255] },          // blue
        { time: 100, color: [0, 170, 255] },       // cyan
        { time: 150, color: [0, 255, 170] },       // green-cyan
        { time: 250, color: [0, 255, 0] },         // green
        { time: 300, color: [170, 255, 0] },       // yellow-green
        { time: 350, color: [255, 200, 0] },       // yellow
        { time: Infinity, color: [255, 0, 0] }     // red
    ];

    for (let i = 0; i < colorStops.length - 1; i++) 
    {
        if (time <= colorStops[i].time && time <= colorStops[i + 1].time) 
        {
            const t0 = colorStops[i].time;
            const t1 = colorStops[i + 1].time;
            const c0 = colorStops[i].color;
            const c1 = colorStops[i + 1].color;

            const t = (time - t0) / (t1 - t0);

            const r = c0[0] + (c1[0] - c0[0]) * t;
            const g = c0[1] + (c1[1] - c0[1]) * t;
            const b = c0[2] + (c1[2] - c0[2]) * t;

            return `rgba(${r}, ${g}, ${b}, 0.8)`;
        }
    }

    return `rgba(${colorStops[colorStops.length - 1].color.join(', ')}, 0.8)`;
}

async function Gen(selectedId) 
{
    Start(false);
    for(var i=0; i<allData.length; i++)
    {
        //ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        /*if (time <= 80)            ctx.fillStyle = "rgba(0,  0,255,0.8)";   // blue
        else if (time > 80 && time <= 100)       ctx.fillStyle = "rgba(0, 170,255,0.8)";  // green
        else if (time > 100 && time <= 150)       ctx.fillStyle = "rgba(0, 255,170,0.8)";  // green
        else if (time > 150 && time <= 250)       ctx.fillStyle = "rgba(0, 255,  0,0.8)";  // green
        else if (time > 250 && time <= 300)       ctx.fillStyle = "rgba(170, 255,  0,0.8)";  // green
        else if (time > 300 && time <= 350)       ctx.fillStyle = "rgba(255, 200,  0,0.8)";  // green
        else if (time > 350)       ctx.fillStyle = "rgba(255,  0,  0,0.8)";  // green*/
        ctx.fillStyle = getColor(time);
        
        var id = allData[i][0];
        if(id != selectedId) continue;
        var x = allData[i][1];
        var y = allData[i][2];
        var time = allData[i][3];
        ctx.beginPath();
        ctx.arc(x*6 + 550, y*6+250, 5, 0, Math.PI*2);
        ctx.fill();
       // await sleep(time);
    }
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
