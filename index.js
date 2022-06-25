window.addEventListener('load', init());

var iMap; // Interactive map
var infoElement; // Information
var mouse;

function init() {
    information = document.getElementById("information");
    initMouse();
    initMap();
}

function initMouse() {
    mouse = new Object();
    mouse.lastX = -1;
    mouse.lastY = -1;
    mouse.inDrag = false;
}

function initMap() {
    iMap = new Object();
    iMap.htmlElement = document.getElementById("interactiveMap");
    iMap.htmlElement.style.backgroundImage = "url('./mapSource.png')";

    iMap.background = new Object();
    iMap.background.posX = 0;
    iMap.background.posY = 0;

    iMap.background.size = MAP_DATA.imageWidth;

    iMap.updateBackground = () => {
        console.log("sad");
        // Validate and push back in boundaries!
        
        //Resize
        if(iMap.background.size < iMap.htmlElement.clientWidth) {
            iMap.background.size = iMap.htmlElement.clientWidth;
        }
        else if(iMap.background.size > iMap.htmlElement.clientWidth * 5) {
            iMap.background.size = iMap.htmlElement.clientWidth * 5;
        }
        if(iMap.background.size / MAP_DATA.imageWidthToHeight < iMap.htmlElement.clientHeight) {
            iMap.background.size = iMap.htmlElement.clientHeight * MAP_DATA.imageWidthToHeight;
        }
        else if(iMap.background.size / MAP_DATA.imageWidthToHeight > iMap.htmlElement.clientHeight * 5) {
            iMap.background.size = iMap.htmlElement.clientHeight * MAP_DATA.imageWidthToHeight * 5;
        }

        // Move
        if(iMap.background.posX > 0) {
            iMap.background.posX = 0;
        }
        else if(iMap.background.posX < iMap.htmlElement.clientWidth - (iMap.background.size)) {
            iMap.background.posX = iMap.htmlElement.clientWidth - (iMap.background.size);
        }
        if(iMap.background.posY > 0) {
            iMap.background.posY = 0;
        }
        else if(iMap.background.posY < iMap.htmlElement.clientHeight - (iMap.background.size / MAP_DATA.imageWidthToHeight)) {
            iMap.background.posY = iMap.htmlElement.clientHeight - (iMap.background.size / MAP_DATA.imageWidthToHeight);
        }

        console.log(iMap.background.posX + "px X");
        console.log(iMap.background.posY + "px Y");
        console.log(iMap.background.size + "px size");
        
        // Apply change
        iMap.htmlElement.style.backgroundPositionX = iMap.background.posX + "px";
        iMap.htmlElement.style.backgroundPositionY = iMap.background.posY + "px";
        iMap.htmlElement.style.backgroundSize = iMap.background.size + "px";
    };
    
    iMap.updateBackground();

    iMap.htmlElement.addEventListener('mousedown', (event) => {
        if(event.button == 0) {
            mouse.lastX = event.clientX;
            mouse.lastY = event.clientY;
            iMap.htmlElement.style.cursor = "grabbing";
            mouse.inDrag = true;
        }
    });

    // This has to be on the intire window because the mouse can go outside of the map(and the body)
    window.addEventListener('mouseup', (event) => {
        iMap.htmlElement.style.cursor = "grab";
        mouse.inDrag = false;
    });

    iMap.htmlElement.addEventListener('mousemove', (event) => {
        if(mouse.inDrag){
            let xChange = event.clientX - mouse.lastX;
            let yChange = event.clientY - mouse.lastY;
            mouse.lastX = event.clientX;
            mouse.lastY = event.clientY;
            iMap.background.posX += xChange;
            iMap.background.posY += yChange;
            iMap.updateBackground();
        }
    });

    iMap.getElementWidthToHeight = () => {
        return iMap.htmlElement.clientWidth / iMap.htmlElement.clientHeight;
    };

    window.addEventListener('resize', iMap.updateBackground);

    /// For mobile:
    iMap.htmlElement.addEventListener('touchstart', (event) => {
        mouse.lastX = event.touches[0].clientX;
        mouse.lastY = event.touches[0].clientY;
        mouse.inDrag = true;
    });

    // This has to be on the intire window because the mouse can go outside of the map(and the body)
    window.addEventListener('touchend', (event) => {
        mouse.inDrag = false;
    });

    iMap.htmlElement.addEventListener('touchmove', (event) => {
        if(mouse.inDrag){
            let xChange = event.touches[0].clientX - mouse.lastX;
            let yChange = event.touches[0].clientY - mouse.lastY;
            mouse.lastX = event.touches[0].clientX;
            mouse.lastY = event.touches[0].clientY;
            iMap.background.posX += xChange;
            iMap.background.posY += yChange;
            iMap.updateBackground();
        }
    });
}