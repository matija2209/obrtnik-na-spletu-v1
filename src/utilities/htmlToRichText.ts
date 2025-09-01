// Utility function to convert HTML strings to Payload RichText format
// This is used across multiple seeding files to standardize HTML to RichText conversion

interface RichTextBaseNode {
  type: string;
  version: number;
  [key: string]: unknown;
}

interface RichTextTextNode extends RichTextBaseNode {
  type: 'text';
  text: string;
  format?: number;
}

interface RichTextElementNode extends RichTextBaseNode {
  type: 'paragraph' | 'heading' | 'list' | 'listitem' | 'quote' | 'link' | string;
  children: RichTextNode[];
  format?: '' | 'left' | 'center' | 'right' | 'justify';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'ul' | 'ol' | 'li' | 'blockquote';
  listType?: 'bullet' | 'number';
  indent?: number;
}

type RichTextNode = RichTextTextNode | RichTextElementNode;

interface RichTextRoot {
  type: 'root';
  children: RichTextElementNode[];
  direction: ('ltr' | 'rtl') | null;
  format: '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify';
  indent: number;
  version: number;
}

export interface RichText {
  root: RichTextRoot;
  [key: string]: unknown;
}

/**
 * Converts HTML string to Payload RichText format
 * Strips HTML tags and creates a simple paragraph structure
 * @param html - HTML string to convert (can be null or undefined)
 * @returns RichText object or null if input is empty
 */
export const htmlToRichText = (html?: string | null): RichText | null => {
  if (!html || html.trim() === '') return null;
  
  // Strip HTML tags and get plain text
  const text = html.replace(/<\/?[^>]+(>|$)/g, "").trim();
  
  if (!text) return null;
  
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          tag: 'p',
          children: [{ type: 'text', text: text, version: 1 }],
          version: 1,
          format: '',
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  };
};

/**
 * Creates a Lexical editor state format (alternative format used in some collections)
 * @param text - Plain text string
 * @returns Lexical editor state object
 */
export const createLexicalEditorState = (text: string) => {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              style: '',
              mode: 'normal',
              detail: 0,
              text: text,
              version: 1
            }
          ],
          direction: 'ltr' as const
        }
      ],
      direction: 'ltr' as const
    }
  };
}; 