export const listSupportedTags = ['e', 'a', 't', 'r', 'p', 'url', 'relay'];
export const isListKind = (kind: number): boolean => {
	return [
		3,
		10000, // Mute list - p, e, a, t tags
		10001, // Pin list - e, a tags
		10002, // Relay list metadata - r tags
		10003, // Bookmark list - e, a, t, r tags
		10004, // Communities list - a tags
		10005, // Public chats list - e tags
		10006, // Blocked relays list - r tags
		10007, // Search relays list - r tags
		10015, // Interests list - t tags
		10030, // User emoji list - emoji tags
		30000, // Categorized people lists - p tags
		30001, // Categorized bookmark lists - e, a, t, r tags
		30003, // Follow sets - p tags
		30008, // Profile badges - a tags
		30009, // Badge definitions - image tags
		30015, // Interest sets - t tags
		30017, // Create stall - e, a tags
		30018, // Create product - e, a tags
		30030, // Emoji packs - emoji tags
		30078, // Arbitrary custom app data - various tags
		31923, // Article curation sets - a tags
		31924, // Video curation sets - a tags
		31925, // Note curation sets - e tags
		39802 // Live activities - a, p tags
	].includes(kind);
};

export const kindNameMap: Record<number, string> = {
	3: 'Follow List',
	10000: 'Mute List',
	10001: 'Pin List',
	10002: 'Relay List Metadata',
	10003: 'Bookmarks',
	10004: 'Communities',
	10005: 'Public Chats',
	10006: 'Blocked Relays',
	10007: 'Search Relays',
	10015: 'Interests',
	10030: 'User Emoji List',
	30000: 'People List',
	30001: 'Generic lists',
	30002: 'Relay sets',
	30003: 'Bookmark Sets',
	30008: 'Profile Badges',
	30009: 'Badge Definitions',
	30015: 'Interest Sets',
	30017: 'Create Stall',
	30018: 'Create Product',
	30023: 'Article',
	30024: 'Article Draft',
	30030: 'Emoji Packs',
	30078: 'App Data',
	31923: 'Article Curation',
	31924: 'Video Curation',
	31925: 'Note Curation',
	39802: 'Live Activities'
};

export function getKindDisplayName(kind: number): string {
	return kindNameMap[kind] ?? `Kind: ${kind}`;
}
