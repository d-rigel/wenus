import config from "../../config/config"

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'WENUS application API documentation',
      version: '0.0.1',
      // version: '1.0.0',
      description: 'This is the backend server application for WENUS project',
      license: {
        name: 'MIT',
        url: 'https://github.com/d-rigel/wenus.git',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/v1`,
        description: 'Development Server',
      },
    ],
  };
  
  export default swaggerDefinition;
  