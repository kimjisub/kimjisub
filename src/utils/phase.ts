export const isBuildPhase = () =>
	process.env.NEXT_PHASE === 'phase-production-build';
