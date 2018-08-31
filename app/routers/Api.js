/**
 * Import base packages
 */
const express = require('express');
const router = express.Router();
const routerUtils = require('../helpers/modules/Router');

/**
 * Define routes
 */
const routes = [
    {
        route: '/',
        method: 'get',
        controller: 'Index',
        action: 'index'
    },
    {
        route: '/robots',
        method: 'get',
        controller: 'Robots',
        action: 'index'
    },
    {
        route: '/robots',
        method: 'post',
        controller: 'Robots',
        action: 'create'
    },
    {
        route: '/robots/:id',
        method: 'get',
        controller: 'Robots',
        action: 'getOne'
    },
    {
        route: '/robots/:id',
        method: 'delete',
        controller: 'Robots',
        action: 'delete'
    }
];

routerUtils.routesToRouter(router, routes, 'Api');

module.exports = {router, routes};
