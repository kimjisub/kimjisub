import { notFound } from 'next/navigation';

/**
 * Catch-all route: any URL not matched by other routes in this group
 * will land here and be redirected to the 404 page.
 */
export default function CatchAllPage() {
	notFound();
}
