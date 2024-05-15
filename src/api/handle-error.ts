import type { Response } from 'express';
import { z } from 'zod';

export const handleError = (err: unknown, res: Response) => {
	if (err instanceof z.ZodError) {
		console.log(err.issues);
		res.status(400).send('Bad Request');
		return;
	}

	if (err instanceof Error) {
		console.log(err.message);
	} else {
		console.log(err);
	}

	res.status(500).send('Internal Server Error');
};
