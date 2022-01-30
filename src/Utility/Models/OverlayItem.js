export class OverlayItem {
    title;
    type;
    video_url;
    image_url;

    constructor(title, type, video_url, image_url) {
        this.title = title;
        this.type = type;
        this.video_url = video_url;
        this.image_url = image_url;
    }
}