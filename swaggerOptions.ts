// utils/swaggerOptions.ts
import { SwaggerOptions } from 'swagger-jsdoc';

const swaggerOptions: SwaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Reservation API',
            version: '1.0.0',
            description: 'API for managing book reservations',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
            },
        ],
    },
    apis: ['./pages/api/books/*.ts'], // Path to your API files
};

export default swaggerOptions;
