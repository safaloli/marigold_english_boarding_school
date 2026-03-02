const downloadsRouter = require('express').Router()
const DownloadCtrl = require('../controller/download.controller')
const {pdfUpload} = require('./upload')
const { authenticateToken, requireRole } = require('../middleware/auth');


downloadsRouter.get('/', DownloadCtrl.getAllDownloads)
downloadsRouter.get('/search/', DownloadCtrl.getAllByFilter)

downloadsRouter.post('/add', authenticateToken, requireRole(['ADMIN', 'admin']), pdfUpload.single('file'), DownloadCtrl.create)

downloadsRouter.delete('/:id', authenticateToken, requireRole(['ADMIN', 'admin']), DownloadCtrl.deleteRowById)
downloadsRouter.post('/delete-file', DownloadCtrl.deleteCloudinaryFile)

downloadsRouter.put('/edit/:id', authenticateToken, requireRole(['ADMIN', 'admin']), DownloadCtrl.updateRow)

module.exports = downloadsRouter