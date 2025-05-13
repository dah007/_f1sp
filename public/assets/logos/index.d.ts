declare module '*.png' {
    const value: DetailedHTMLProps<
        ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    >;
    export = value;
}
