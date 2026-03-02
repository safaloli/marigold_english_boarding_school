const { db } = require("../config/database")
const {deleteImage} = require("../config/cloudinary")

class DownloadController {
    create = async (req, res, next) => {
        try {
            const downloadData = {
                mainTitle: req.body.mainTitle || null,
                mainDescription: req.body.mainDescription || null,
                category: req.body.category,
                academicYear: req.body.academicYear || null,
                class: req.body.class || null,
                subject: req.body.subject || null,
                categoryTitle: req.body.categoryTitle || null,
                fileName: req.body.fileName || null,
                cloudinaryPublicId: req.body.cloudinaryPublicId,
                fileType: req.body.fileType || null,
                fileSizeKb: req.body.fileSizeKb || null,
                fileUrl: req.body.fileUrl || null,
                iconName: req.body.iconName || null,
                isActive: req.body.isActive || 'active',
                createdBy: req.user?.id || null,   // if using auth middleware
                updatedBy: req.user?.id || null,
            };

            if(!downloadData.category){
                next({statusCode: 500, message: "Category can't be empty"})
            }

            // console.log("req.file: ", req.body.file)
            // console.log("req.body: ", req.body)
            const data = await db.downloads.create(downloadData);

            return res.status(201).json({
                success: true,
                message: "Download created successfully",
                data: data,
            });

        } catch (exception) {
            next(exception);
        }
    };

    deleteRowById = async(req, res, next) => {
        try{
            console.log('delete api hit')

            const {id} = req.params;
            
            if(!id){
                return res.json({
                    success: false,
                    message: "id is required"
                })
            }

            const file = await db.downloads.findById(id)
            await db.downloads.deleteById(id)

            res.json({
                success: true,
                message: "Download row deleted successfully",
                data: file,
            })
            
            return file
        }catch(exception){
            console.error(exception)
            next(exception)
        }
    } ;

    getAllByFilter = async(req, res, next) => {
        try{
            const {filter, value} = req.query
            let rows = null

            if(!filter && !value){
                return res.json({
                    message: "Filter or value is missing",
                    status: "false"
                })
            }

            rows = await db.downloads.findAllRowByFilter(filter, value)

            res.json({
                status: "true",
                message: "successfully fetched all downloads by filter",
                rows: rows
            })
            // return rows
        }catch(exception){
            next(exception)
        }
    }

    getAllDownloads = async(req, res, next) => {
        try{
            const rows = await db.downloads.findAll()
            res.json({
                status: "true",
                message: "successfully fetched all downloads",
                data: rows
            })
            // return rows
        }catch(exception){
            next(exception)
        }
    }

    deleteCloudinaryFile = async(req, res, next) => {
        try{
            const publicId = req.body.publicId
            if (publicId) {
                await deleteImage(publicId, 'raw'   );
                res.json({
                    success: "true",
                    message: "Successfully deleted file from cloudinary"
                })
            }else{
                next({message: 'public id is missing while deleting...'})
            }
            
        }catch(exception){
            next(exception)
        }
    }

    updateRow = async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Download ID is required"
                });
            }
    
            // 1️⃣ Check if record exists
            const existingDownload = await db.downloads.findById(id);
    
            if (!existingDownload) {
                return res.status(404).json({
                    success: false,
                    message: "Download not found"
                });
            }
    
            const {
                mainTitle,
                mainDescription,
                category,
                academicYear,
                class: className,
                subject,
                categoryTitle,
                fileName,
                cloudinaryPublicId,
                fileUrl,
                fileType,
                fileSizeKb,
                createAt
            } = req.body;
    
            const updates = {
                mainTitle,
                mainDescription,
                category,
                academicYear,
                class: className,
                subject,
                categoryTitle,
                fileName,
                cloudinaryPublicId,
                fileUrl,
                fileType,
                fileSizeKb,
                createdAt: createAt
            };
    
            // 2️⃣ Auto delete old Cloudinary file if new file uploaded
            if (
                cloudinaryPublicId &&
                existingDownload.cloudinary_public_id &&
                cloudinaryPublicId !== existingDownload.cloudinary_public_id
            ) {
                await deleteImage(existingDownload.cloudinary_public_id, 'raw');
            }
    
            // 3️⃣ Call your custom update method
            const updatedDownload = await db.downloads.update(id, updates);
    
            res.json({
                success: true,
                message: "Updated Successfully",
                data: updatedDownload
            });
    
        } catch (exception) {
            next(exception);
        }
    };


    
    
}

module.exports = new DownloadController()