export default (str: string): number => {
    return encodeURI(str).split(/%..|./).length - 1;
};
