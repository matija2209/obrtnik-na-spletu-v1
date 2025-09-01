import { Media, Project } from "@payload-types";
import { getImageUrl } from "./getImageUrl";

  // Helper function to get image source and alt text for Image 1
  const getProjectImage = (img: NonNullable<Project['projectImages']>[number] | undefined) => {
    if (!img) return { src: '/placeholder-image.jpg', alt: 'Placeholder Image' };

    // Use image1 as the primary image source
    // getImageUrl should handle cases where image1 might be an ID (number) or a Media object
    const imageObj = img.image1 as Media | undefined; 

    return {
      src: imageObj ? getImageUrl(imageObj) || '/placeholder-image.jpg' : '/placeholder-image.jpg',
      alt: img.altText1 || 'Project Image', // Use altText1
    };
  };
  

  export default getProjectImage