export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    className?: string;
    alt?: string;
};

export function Image({
    className = "",
    alt = "", 
    ...props
}: ImageProps) {
    return (
        <img
            alt={alt}
            className={`${className}`.trim()}
            {...props}
        />
    );
}