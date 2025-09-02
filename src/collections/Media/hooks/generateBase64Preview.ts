
import { getPlaiceholder } from 'plaiceholder'; // Import plaiceholder
import { CollectionAfterChangeHook } from 'payload';

const generateBase64Preview: CollectionAfterChangeHook = async ({
    doc, // The full document that was saved
    req, // Express request object
    operation, // 'create' or 'update'
    previousDoc, // The document before the change (only available on 'update')
  }) => {
    // Only proceed if a file was uploaded/changed and it's an image
    // req.file is present when a file is part of the current operation.
    // doc.mimeType helps confirm it's an image.
    if (
      req.file &&
      req.file.data && // Ensure the buffer is available
      doc.mimeType &&
      doc.mimeType.startsWith('image/')
    ) {
      try {
        req.payload.logger.info(`Generating Base64 preview for media: ${doc.filename} (ID: ${doc.id})`);
        const imageBuffer = req.file.data;
  
        // Generate the plaiceholder (includes base64, css, svg, etc.)
        // We are interested in the base64 string
        // The `size` option determines the dimensions of the placeholder image (before encoding).
        // Smaller sizes (e.g., 10-32) result in smaller Base64 strings.
        const { base64 } = await getPlaiceholder(imageBuffer, { size: 32 }); // Adjust size as needed
  
        // Update the document with the base64Preview
        // We use payload.update to avoid triggering an infinite loop of hooks
        // if this hook were to return the modified doc directly.
        // Passing `req` ensures access control and other contextual data is maintained.
        await req.payload.update({
          collection: 'media',
          id: doc.id,
          data: {
            base64Preview: base64,
          },
          // By providing the original `req` object, Payload's internal mechanisms
          // can often prevent re-triggering the same hook for this specific update.
          // Also ensure depth is 0 to prevent fetching unnecessary related data.
          req: req,
          depth: 0,
          overrideAccess: false, // Let access control apply as usual, unless necessary
        });
        req.payload.logger.info(`Successfully generated and saved Base64 preview for media ID: ${doc.id}`);
  
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        req.payload.logger.error(
          `Error generating Base64 preview for media ID ${doc.id}: ${errorMessage}`
        );
        if (error instanceof Error && error.stack) {
          req.payload.logger.error(error.stack);
        }
      }
    }
    // This hook doesn't need to return the doc if it's modifying it via payload.update
    // If it were the first in a chain and needed to pass a modified doc to the next, it would.
    // return doc;
  };
  
  export default generateBase64Preview