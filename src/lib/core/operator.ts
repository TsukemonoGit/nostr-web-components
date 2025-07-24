import { type EventPacket } from 'rx-nostr';
import { scan, type OperatorFunction } from 'rxjs';
import * as Nostr from 'nostr-typedef';

// scanArray関数の修正版
export function scanArray<T extends EventPacket>(
	limit?: number
): OperatorFunction<T, Nostr.Event[]> {
	return scan((acc: Nostr.Event[], packet: T) => {
		// packetからeventを安全に抽出
		const event = (packet as any).event || (packet as any).data || packet;

		if (!event || typeof event !== 'object') {
			return acc;
		}

		const sorted = sortEvents([...acc, event]);

		if (limit !== undefined) {
			return sorted.slice(0, limit === 0 ? undefined : limit);
		}
		return sorted;
	}, []);
}

export function sortEventPackets<A extends EventPacket>(events: A[]): A[] {
	return events.sort((a: A, b: A): number => {
		if (a.event.created_at !== b.event.created_at) {
			return b.event.created_at - a.event.created_at;
		}
		return a.event.id.localeCompare(b.event.id);
	});
}
export function sortEvents(events: Nostr.Event[]): Nostr.Event[] {
	return events.sort((a: Nostr.Event, b: Nostr.Event): number => {
		if (a.created_at !== b.created_at) {
			return b.created_at - a.created_at;
		}
		return a.id.localeCompare(b.id);
	});
}
