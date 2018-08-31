const baseController = require('./BaseController');
const Robot = require('../../collections/Robot');

class RobotsController extends baseController {
    constructor() {
        super();
    }

    /**
     * Action to return all robots
     *
     * @param req
     * @param res
     */
    indexAction(req, res) {
        Robot.find((err, robots) => {
            if (err)
                this.jsonResponse(res, 400, { 'error': err });

            this.jsonResponse(res, 200, { 'robots': robots });
        });
    }

    /**
     * Action to create a robot
     *
     * @param req
     * @param res
     */
    createAction(req, res) {
        let robot = new Robot();
        robot.name = req.body.name;

        robot.save((err) => {
            if (err)
                this.jsonResponse(res, 400, { 'error': err });

            this.jsonResponse(res, 201, { 'message': 'Robot created!' });
        });
    }

    /**
     * Action to return one robot
     *
     * @param req
     * @param res
     */
    getOneAction(req, res) {
        Robot.findOne({name: req.params.id}, (err, robot) => {
            if (err)
                this.jsonResponse(res, 400, { 'error': err });

            this.jsonResponse(res, 200, { 'robot': robot });
        });
    }

    /**
     * Action to delete a robot
     *
     * @param req
     * @param res
     */
    deleteAction(req, res) {
        Robot.remove({ _id: req.params.id }, (err, robot) => {
            if (err)
                this.jsonResponse(res, 400, { 'error': err });

            this.jsonResponse(res, 204, { 'message': 'Deleted successfully!' });
        });
    }
}

module.exports = new RobotsController();
