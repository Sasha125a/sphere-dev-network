const express = require('express');
const router = express.Router();
const virtualFS = require('../utils/virtualFS');
const versionControl = require('../utils/versionControl');
const virtualDB = require('../utils/virtualDatabase');
const virtualDeployer = require('../utils/virtualDeployer');

// Создание проекта с шаблоном
router.post('/', async (req, res) => {
    try {
        const project = await virtualFS.createProject(req.body);
        await versionControl.initRepo(project.id);
        
        // Создание базы данных для проекта
        virtualDB.createDatabase(project.id, 'sql');
        
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение файлов проекта
router.get('/:id/files', async (req, res) => {
    try {
        const content = await virtualFS.getFile(req.params.id, req.query.path);
        res.send(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Сохранение файлов проекта
router.put('/:id/files', async (req, res) => {
    try {
        await virtualFS.saveFile(req.params.id, req.body.path, req.body.content);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Коммит изменений
router.post('/:id/commit', async (req, res) => {
    try {
        const commit = await versionControl.commit(req.params.id, req.body.message, req.body.author);
        res.json(commit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Деплой проекта
router.post('/:id/deploy', async (req, res) => {
    try {
        const deployment = await virtualDeployer.deployProject(req.params.id, req.body.server);
        res.json(deployment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;