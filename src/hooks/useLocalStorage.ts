import { Dispatch, SetStateAction, useEffect, useState } from 'react';

function useLocalStorage<T>(
	key: string,
	initialState: T,
): [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		if (typeof window === 'undefined') return initialState;
		const data = window.localStorage.getItem(key);
		return data ? (JSON.parse(data) as T) : initialState;
	});

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(key, JSON.stringify(state));
	}, [key, state]);

	return [state, setState];
}

export default useLocalStorage;
