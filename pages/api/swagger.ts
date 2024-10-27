// pages/api/swagger.ts
import { NextApiRequest, NextApiResponse } from 'next';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerOptions from '../../swaggerOptions'; // Adjust the path if necessary

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(swaggerDocs);
}
