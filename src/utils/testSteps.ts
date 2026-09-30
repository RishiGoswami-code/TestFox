import { TestStep } from '../types';

/**
 * Convert steps from any generator (or older saved tests) into TestStep objects.
 *
 * Accepts plain strings ("Click 'Login' button"), canonical TestStep objects, and the
 * legacy `{ id, description, action, selector, value, expected }` shape.
 */
export function normalizeTestSteps(steps: unknown): TestStep[] {
    if (!Array.isArray(steps)) {
        return [];
    }

    return steps
        .filter(step => step !== null && step !== undefined)
        .map((step, index): TestStep => {
            if (typeof step === 'string') {
                return { order: index + 1, action: step };
            }

            const raw = step as Record<string, unknown>;
            const rawData = raw.data ?? raw.value;
            const order = typeof raw.order === 'number' ? raw.order : Number(raw.id) || index + 1;

            const normalized: TestStep = {
                order,
                action: String(raw.action ?? raw.description ?? '')
            };
            if (rawData !== undefined) {
                normalized.data = typeof rawData === 'string' ? rawData : JSON.stringify(rawData);
            }
            if (raw.expected !== undefined) {
                normalized.expected = String(raw.expected);
            }
            if (raw.selector !== undefined) {
                normalized.selector = String(raw.selector);
            }
            if (raw.description !== undefined) {
                normalized.description = String(raw.description);
            }
            return normalized;
        });
}
