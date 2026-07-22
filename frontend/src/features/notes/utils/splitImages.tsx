

// ---- type ----
import type { NoteImage } from "../../../types/note";


export function splitImages(
    images: NoteImage[]

) {


    const largeCount = images.length % 3;


    return {

        largeImages: images.filter((_, index) => index < largeCount),

        normalImages: images.filter((_, index) => index >= largeCount),


    };



}
