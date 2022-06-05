const SceneModel = require('./models/Scenes')
const { ObjectId } = require("mongodb");
const fs = require("fs");

module.exports = function (app) {

    app.get("/getScenes", (req, res) => {
        SceneModel.find({}, (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        })
    });

    app.get("/getScenes/:_id", (req, res) => {
        SceneModel.findById(ObjectId(req.params._id), (err, result) => {
            if (err) {
                res.json(err);
            } else {
                const content = fs.readFileSync(result.filePath).toString();
                res.json({ result: result, content: content });
            }
        })
    });

    app.post("/createScene", async (req, res) => {
        const scene = req.body;
        const newScene = new SceneModel(scene);
        await newScene.save();

        res.json(scene);
    });
}