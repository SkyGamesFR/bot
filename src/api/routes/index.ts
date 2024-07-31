import express from 'express';
import McRouter from './mc'

// if you want to add another router like news or something else
// you could add one 'server.use(...)' below the 'server.use('/user',...)

const routes = (server: express.Application): void => {
    server.use('/players', new McRouter().router);
};

export default routes