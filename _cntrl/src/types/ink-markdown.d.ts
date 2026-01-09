declare module 'ink-markdown' {
    import { FC, ReactNode } from 'react';
    
    interface MarkdownProps {
        children: ReactNode;
    }
    
    const Markdown: FC<MarkdownProps>;
    export default Markdown;
}
