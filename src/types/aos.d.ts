declare module 'aos' {
	export type AOSOptions = Record<string, unknown>;

	const AOS: {
		init(options?: AOSOptions): void;
		refresh(): void;
		refreshHard(): void;
	};

	export default AOS;
}
