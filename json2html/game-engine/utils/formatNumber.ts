const formatNumber = (n: number, lang: string): string =>
    new Intl.NumberFormat(lang).format(n);
export default formatNumber;
