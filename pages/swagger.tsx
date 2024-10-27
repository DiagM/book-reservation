// pages/swagger.tsx
import { useEffect } from 'react';

const SwaggerPage = () => {
    useEffect(() => {
        // Ensure Swagger UI is initialized correctly
        const swaggerUI = (window as any).SwaggerUIBundle;
        const swaggerUIStandalonePreset = (window as any).SwaggerUIStandalonePreset;

        if (swaggerUI) {
            const ui = swaggerUI({
                url: '/swagger', // Make sure this is your correct API definition endpoint
                dom_id: '#swagger-ui',
                presets: [
                    swaggerUIStandalonePreset,
                    swaggerUI.presets.apis,
                ],
                layout: "StandaloneLayout",
            });

            // Clean up on unmount
            return () => {
                ui.destroy();
            };
        }
    }, []);

    return (
        <div>
            <h1>API Documentation</h1>
            <div id="swagger-ui" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.5/swagger-ui.css" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.5/swagger-ui-bundle.js" />
            <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.52.5/swagger-ui-standalone-preset.js" />
        </div>
    );
};

export default SwaggerPage;
