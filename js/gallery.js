export class Gallery {
    index = 0;
    folderPath = "/";
    images = [];

    slider;
    img;

    constructor(sliderId, imgId, folderPath, imgArray) {
        this.slider = document.getElementById(sliderId);
        this.img = document.getElementById(imgId);

        this.folderPath = folderPath;
        this.images = imgArray;

        this.slider.max = this.images.length - 1;

        this.setGallery(0);
    }

    scrollGallery(offset) {
        this.setGallery(this.index + offset);
    }

    // Overflow values wrap around
    setGallery(pos) {
        this.index = pos % this.images.length;
        if (pos < 0) this.index += this.images.length;

        this.slider.value = this.index;
        this.img.src = this.folderPath + this.images[this.index];
    }
}

//===== Gallery instances =====//

const kittySliderElement = "kittySliderElement";
const kittyImgElement = "kittyImgElement";
const kittyImgPath = "/assets/gallery/my-cat/";
const kittyImgNames = [ // No better way to do this client side
    "PXL_20230215_210425193.jpg",
    "PXL_20230303_222245983.jpg",
    "PXL_20230303_222307987.jpg",
    "PXL_20230425_211841997.jpg",
    "PXL_20230425_211932289.jpg",
    "PXL_20230425_212031667.MP.jpg",
    "PXL_20230601_155407214.jpg",
    "PXL_20230720_020921585.MP.jpg",
    "PXL_20230720_020945077.MP.jpg",
    "PXL_20230722_041157156.MP.jpg",
    "PXL_20230801_001157041.jpg"
];

const kittyGallery = new Gallery(
    kittySliderElement,
    kittyImgElement,
    kittyImgPath,
    kittyImgNames
);

window.kittyGallery = kittyGallery;