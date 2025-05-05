import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

interface R2ClientOptions {
  contentType?: string;
  cacheControl?: string;
}

interface R2UploadResult {
  success: boolean;
  result?: any; // Type based on PutObjectCommandOutput if needed
  url?: string;
  error?: string;
}

interface R2GetResult {
  success: boolean;
  Body?: NodeJS.ReadableStream; // Type might vary based on environment
  ContentType?: string;
  LastModified?: Date;
  error?: string;
}

export class R2Client {
  private client: S3Client;
  private bucketName: string | undefined;

  constructor() {
    // Initialize S3 client configured for R2
    // Ensure environment variables are properly typed and handled if missing
    this.client = new S3Client({
      region: "auto", // R2 uses 'auto'
      endpoint: process.env.S3_CSS_ENDPOINT as string, // Add type assertion or validation
      credentials: {
        accessKeyId: process.env.S3_CSS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_CSS_SECRET as string,
      },
    });
    this.bucketName = process.env.S3_CSS_BUCKET;

    if (!this.bucketName || !process.env.S3_CSS_ENDPOINT || !process.env.S3_CSS_ACCESS_KEY_ID || !process.env.S3_CSS_SECRET) {
      console.warn("R2 environment variables (S3_CSS_BUCKET, S3_CSS_ENDPOINT, S3_CSS_ACCESS_KEY_ID, S3_CSS_SECRET) are not fully configured.");
      // Depending on usage, might want to throw an error here
    }
  }

  /**
   * Upload a file to R2
   * @param {string} key - Object key (path)
   * @param {string|Buffer} content - File content
   * @param {R2ClientOptions} options - Additional options
   * @returns {Promise<R2UploadResult>} - Upload result
   */
  async uploadFile(key: string, content: string | Buffer, options: R2ClientOptions = {}): Promise<R2UploadResult> {
    if (!this.bucketName) {
        return { success: false, error: "R2 bucket name not configured." };
    }
    try {
      const { contentType = "text/plain", cacheControl = "public, max-age=3600" } = options;
      
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
        CacheControl: cacheControl,
      };

      const command = new PutObjectCommand(params);
      const result = await this.client.send(command);
      
      return {
        success: true,
        result,
        url: `${process.env.S3_CSS_ENDPOINT}/${key}`, // Ensure S3_CSS_ENDPOINT is set
      };
    } catch (error: any) {
      console.error(`R2 upload error for ${key}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get a file from R2
   * @param {string} key - Object key (path)
   * @returns {Promise<R2GetResult>} - Retrieved object with Body and metadata
   */
  async getFile(key: string): Promise<R2GetResult> {
     if (!this.bucketName) {
        return { success: false, error: "R2 bucket name not configured." };
    }
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      const command = new GetObjectCommand(params);
      const response = await this.client.send(command);

      // Check if Body is undefined, which can happen
      if (!response.Body) {
          throw new Error('Response body is undefined');
      }
      
      return {
        success: true,
        Body: response.Body as NodeJS.ReadableStream, // Assert type if needed
        ContentType: response.ContentType,
        LastModified: response.LastModified,
      };
    } catch (error: any) {
      console.error(`R2 get error for ${key}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get a file as a string from R2
   * @param {string} key - Object key (path)
   * @returns {Promise<string>} - File content as string
   */
  async getFileAsString(key: string): Promise<string> {
    const file = await this.getFile(key);
    
    if (!file.success || !file.Body) {
      throw new Error(`Failed to get file ${key}: ${file.error || 'Body is missing'}`);
    }
    
    // Convert stream to string (Node.js specific)
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        file.Body!.on('data', (chunk) => chunks.push(chunk));
        file.Body!.on('error', reject);
        file.Body!.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

    // Alternative if using Node 18+ fetch streams directly
    // if (typeof file.Body.text === 'function') {
    //    return file.Body.text();
    // }
  }
}

// Export singleton instance
export const r2 = new R2Client(); 