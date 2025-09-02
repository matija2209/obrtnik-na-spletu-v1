import { HighQualityMedia, Media } from "@payload-types";

export const getHighQualityFirstImage = (images: HighQualityMedia[]| number | null | undefined | (number | HighQualityMedia)[]):HighQualityMedia=>{
    if (!images) throw new Error("getFirstImage: Images are not defined");
    if (typeof images === 'number') throw new Error("getFirstImage: Images are not a number");
    if (Array.isArray(images)) {
        return images[0] as HighQualityMedia;
    }
    return images as HighQualityMedia;
}

const getFirstImage = (images: Media[]| number | null | undefined | (number | Media)[]):Media=>{
    if (!images) throw new Error("getFirstImage: Images are not defined");
    if (typeof images === 'number') throw new Error("getFirstImage: Images are not a number");
    if (Array.isArray(images)) {
        return images[0] as Media;
    }
    return images as Media;
}

export default getFirstImage