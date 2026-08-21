type MnemonicaCtor = new (...args: any[]) => object;
interface MnemonicaBodyOptions {
    dtoClass?: new () => object;
}
export declare function MnemonicaBody(TypeCtor: MnemonicaCtor, options?: MnemonicaBodyOptions): ParameterDecorator;
export {};
//# sourceMappingURL=mnemonica-body.decorator.d.ts.map