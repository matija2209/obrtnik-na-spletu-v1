import { MediaBlock } from '@/blocks/blog/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock } from '@/blocks/blog/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  // CTABlock as CTABlockProps,
  CodeBlock as CodeBlockProps,
  MediaBlock as MediaBlockProps,
} from '@payload-types'
import { BannerBlock } from '@/blocks/blog/Banner/Component'
// import { CallToActionBlock } from '@/blocks/blog/CallToAction/Component'
import { cn } from '@/lib/utils'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | CodeBlockProps> // CTABlockProps

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  const linkConverters = LinkJSXConverter({ internalDocToHref })
  
  return {
    ...defaultConverters,
    ...linkConverters,
    // Ensure paragraph spacing
    paragraph: ({ node, nodesToJSX }) => <p className="mb-4">{nodesToJSX({ nodes: node.children })}</p>,
    // Add list converters with proper styling
    list: ({ node, nodesToJSX }) => {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag className={cn(
          'mb-4 pl-6',
          node.listType === 'number' ? 'list-decimal' : 'list-disc'
        )}>
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      )
    },
    listitem: ({ node, nodesToJSX }) => (
      <li className="mb-1 pl-1">
        {nodesToJSX({ nodes: node.children })}
      </li>
    ),
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      // cta: ({ node }) => <CallToActionBlock {...node.fields} />,
    },
  }
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
          // Add list styling when prose is disabled
          '[&>p]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4 [&>li]:mb-1 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:pl-6 [&>ol]:pl-6': !enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}