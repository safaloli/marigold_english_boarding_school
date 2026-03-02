// Download Page Manager 

import AddDownloadModal from "../components/AddDownloadModal.js";

class DownloadContentManager {
    constructor() {
        this.currentSection = 'Downloads';
        this.sections = {
            // 'hero': { name: 'Hero Section', icon: '🏠' },
            'results': { name: 'Results', icon: '📊' },
            'curriculum': { name: 'Curriculum', icon: '📘' },
            'syllabus': { name: 'Syllabus', icon: '📝' },

        };
        this.downloadRows = [];
        this.currentRows = []
        this.currentPage = 1;
        this.totalPages = 1
        this.rowSizeInPage = 10
        this.init();
    }

    createLucideIcon() {
        // Reinitialize Lucide icons after content injection
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('lucide icon created');

        } else {
            console.error('failed to create lucide icon!');
        }
    }

    init() {
        this.bindEvents();
    }

    async loadDownloadsContent() {
        try {
            // Get downloads content
            const content = this.getDownloadsContent();

            // Inject content into page-content
            this.injectContent(content);

            // Update navigation
            this.updateNavigation();

        } catch (error) {
            console.error('Error loading downloads content section:', error);
            this.showError('Failed to load downloads content section');
        }
    }

    // Bind event listeners 
    bindEvents() {
        document.addEventListener('click', async (e) => {
            const el = e.target.closest('[data-download-section]')
            if (el) {
                const section = el.getAttribute('data-download-section')
                await this.loadSection(section);
                await this.createLucideIcon()

            }
        })

        // back, save, addFile card, open modal
        document.addEventListener('click', async (e) => {
            const actionButton = e.target.closest('[data-action]')

            if (actionButton) {
                const action = actionButton.getAttribute('data-action')

                // back to section list
                if (action === "back-to-section-list") {
                    console.log("i'm click back")
                    this.backToSectionList()
                }

                // save section 
                if (action === "save-section") {
                    const section = e.target.getAttribute('data-section')
                    this.saveSection(section, e.target)
                }

                // add file card 
                if (action === "add-file") {
                    this.addFileCard()
                }

                // open add modal
                if (action === "open-add-modal") {

                    const addModal = AddDownloadModal({
                        currentSection: this.currentSection,
                        title: "Add " + this.currentSection,
                        description: "Enter exam result details below.",
                        onSave: (data) => {
                            console.log(data)
                            this.saveDownloadModal(data)
                        },
                        onCancel: () => {
                            this.hideModal()
                        }
                    })
                    this.showModal(addModal)
                }

                // open edit modal
                if(action === "edit-download"){
                    const targetId = actionButton.getAttribute('id')
                    const fileToEdit = this.currentRows.find(item => item.id === targetId)

                    const editModal = AddDownloadModal({
                        title: "Add " + this.currentSection,
                        description: "Enter exam result details below.",
                        currentSection: this.currentSection,
                        editData: fileToEdit,
                        onSave: (data) => {
                            // console.log('data', data)
                            this.saveDownloadModal(data, true, fileToEdit.cloudinary_public_id)
                        },
                        onCancel: () => {
                            this.hideModal()
                        }
                    })
                    this.showModal(editModal)
                }

                // delete download row
                if(action === "delete-download"){  
                    const id = actionButton.getAttribute('id')
                    const row = actionButton.closest("tr")
                    const itemName = row.querySelector(".category-title").textContent

                    this.openDeleteModal(id, itemName)
                }

                // reload table
                if(action === "reload-table"){
                    const reloadIcon = actionButton.querySelector('.reload-icon')
                    reloadIcon.classList.add("animate-spin")
                    await this.reloadTable(this.currentSection)
                    
                    setTimeout(() => {
                        reloadIcon.classList.remove("animate-spin")
                    }, 1000)
                    window.showNotification(
                        "Success",
                        `${this.capitalize(this.currentSection)} section reloaded successfully.`,
                        "success"
                    )

                }

                // pagination action
                if(action === 'prev-page'){
                    console.log('prev button clicked', this.currentPage)
                    if(this.currentPage > 1){
                        this.currentPage--;
                        this.reloadTable()
                    }
                }

                if(action === 'next-page'){
                    console.log('next button clicked', this.currentPage)
                    if(this.currentPage < this.totalPages){
                        this.currentPage++;
                        this.reloadTable(this.currentSection)
                    }
                }
            }
        })

    }

    getDownloadsContent() {
        return `
            <section id="downloads-content-section" class="content-section active">
                <div class="page-header">
                    <div class="page-title">
                        <h1>Downloads Page Content Management</h1>
                        <p>Manage all content sections displayed on the Downloads page.</p>
                    </div>
                </div>

                <div id="sectionList" class="section-list-view">
                    <div class="sections-grid">
                        ${Object.entries(this.sections).map(([key, section]) => `
                        <div class="section-menu-item" data-download-section="${key}">
                            <div class="section-header">
                                <div class="section-icon">${section.icon}</div>
                                <div class="section-info">
                                    <div class="section-title">${section.name}</div>
                                    <div class="section-subtitle">Manage ${section.name.toLowerCase()} content</div>
                                </div>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>

                <div id="sectionEditor" class="section-editor-view" style="display:none;"></div>
            </section>
        `;
    }

    injectContent(content) {
        const pageContent = document.getElementById('pageContent')
        if (!pageContent) return


        pageContent.innerHTML = content
    }

    async loadSection(section) {
        this.currentSection = section;
        document.getElementById('sectionList').style.display = 'none'
        document.querySelector('.page-header').style.display = 'none'

        const editor = document.getElementById('sectionEditor')
        editor.style.display = 'block'
        editor.innerHTML = await this.getSectionEditor(section)

        // load existing data from api
        const res = await fetch(`/api/content/downloads?section${section}`)
        if (res.ok) {
            const data = await res.json()
            this.populateSectionEditor(section, data)
        }
    }

    backToSectionList() {
        console.log("back")

        document.getElementById('sectionEditor').style.display = 'none'

        document.getElementsByClassName('page-header').style.display = 'block'
        document.getElementById('sectionList').style.display = 'block'
    }

    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1)
    }

    async getSectionEditor(section) {
        const breadcrumb = this.getBreadcrumbHtml(section)
        const haveSaveButton = ['hero']
        const haveAddButtons = ['results', 'curriculum', 'syllabus']


        const sectionHeader = `
            <div class="flex w-full justify-between">
                <div class="flex flex-col gap-2">
                    <h1 class="text-[#111418] text-xl md:text-2xl font-black leading-tight tracking-[-0.033em]">Manage ${this.capitalize(section)}</h1>
                </div>

                <div class="flex items-center gap-4">
                    <!-- Reload Button -->
                    <button 
                        class="flex shrink-0 cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                        data-action="reload-table"
                        title="Reload"
                    >
                        <div class="reload-icon"> 
                            <i data-lucide="rotate-ccw"> </i>
                        </div>
                    </button>

                    ${haveAddButtons.includes(section) ? `
                        <button class="flex shrink-0 cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-sm"
                        data-action="open-add-modal">
                            <i data-lucide="plus"></i>
                            <span>Add ${this.capitalize(section)}</span>
                        </button>
                    ` : ""}
                </div>
            </div>
        `

        let editorContent = null

        switch (section.toLowerCase()) {
            case 'hero':
                editorContent = await this.getHeroEditor()
                break

            case 'results':
                editorContent = await this.getSubSectionEditor('results')
                break

            case 'curriculum':
                editorContent = await this.getSubSectionEditor('curriculum')
                break

            case 'syllabus':
                editorContent = await this.getSubSectionEditor('syllabus')
                break
        }


        if (editorContent != null && editorContent != '') {
            return `
                ${breadcrumb}
                <div class="section-editor">
                    <div class="editor-header">${sectionHeader}</div>
                    <div class="editor-content" id="editorContent">${editorContent}</div>

                    ${haveSaveButton.includes(section) ? `
                        <div class="editor-actions">
                            <button class="btn btn-primary save-section-btn" data-section="${section}">
                                <i data-lucide="save"></i>
                                Save Changes
                            </button>
                        </div>
                    `: ''}
                </div>
                
            `
        } else {
            return breadcrumb
        }

    }


    getBreadcrumbHtml(section) {
        return `
            <!-- Simple Breadcrumb -->
            <div class="simple-breadcrumb">
                <button class="back-button" data-action="back-to-section-list">
                    <i data-lucide="arrow-left"></i>
                </button>
                <div class="breadcrumb-path">
                    <span>Downloads</span>
                    <i data-lucide="chevron-right"></i>
                    <span id="currentSectionName">${section}</span>
                </div>
            </div>
        `
    }

    getHeroEditor() {
        return `
            <form class="section-form" id="heroForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="hero-title">Title</label>
                        <input type="text" id="hero-title" class="form-input" placeholder="Downloads">
                    </div>
                    <div class="form-group">
                        <label for="hero-subtitle">Subtitle</label>
                        <input type="text" id="hero-subtitle" class="form-input" placeholder="Access official academic results, curriculum details, and syllabus outlines for the specific academic year.">
                    </div>
                </div>
            </form>
        `
    }

    async getSubSectionEditor(section) {
        this.downloadRows = await this.fetchDownloadByFilter('category', section)
        const rows = await this.getPaginatedRows()
        this.currentRows = rows

        const totalRows = this.downloadRows.length
        const totalPages = Math.ceil(totalRows/this.rowSizeInPage)
        // Pagination info
        const startItem = (this.currentPage - 1) * this.rowSizeInPage + 1;
        const endItem = Math.min(this.currentPage * this.rowSizeInPage, totalRows);

        return `
            <div class="flex-1 'overflow-y-auto">
                <div class="max-w-6xl mx-auto flex flex-col gap-6 md:gap-8 pb-10">
                    <div class="rounded-xl border border-[#dbe0e6] bg-white overflow-hidden shadow-sm">
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[800px]">
                                <thead class="bg-[#f8f9fa] border-b border-[#dbe0e6]">
                                    <tr>
                                        <th
                                            class="px-6 py-4 text-left text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Document Title</th>
                                        <th
                                            class="px-6 py-4 text-left text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Class</th>
                                        <th
                                            class="px-6 py-4 text-left text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Subject</th>
                                        <th
                                            class="px-6 py-4 text-left text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Academic Year</th>
                                        <th
                                            class="px-6 py-4 text-left text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Published Date</th>
                                        <th
                                            class="px-6 py-4 text-right text-[#617589] text-xs font-bold uppercase tracking-wider">
                                            Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#dbe0e6]">
                                    ${
                                        rows.map(row => {
                                            const publishDate = row.created_at.split("T")[0];
                                            return `
                                                <tr class="hover:bg-background-light transition-colors group">
                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center gap-3">
                                                            <div
                                                                class="flex items-center justify-center size-10 rounded-lg bg-red-100 text-red-600 shrink-0">
                                                                <i data-lucide="file-text"></i>  
                                                            </div>
                                                            <div class="flex flex-col">
                                                                <span class="text-[#111418] text-sm font-bold category-title">${row.category_title}</span>
                                                                <span class="text-[#617589] text-xs">${row.file_size_kb}KB</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center gap-3">
                                                            <div class="flex flex-col">
                                                                <span class="text-[#617589] text-sm font-medium">${row.class}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center gap-3">
                                                            <div class="flex flex-col">
                                                                <span class="text-[#617589] text-sm font-medium">${row.subject}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center gap-3">
                                                            <div class="flex flex-col">
                                                                <span class="text-[#617589] text-sm font-medium">${row.academic_year}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    

                                                    <td class="px-6 py-4 text-[#617589] text-sm font-medium">${publishDate}</td>

                                                    <td class="px-6 py-4">
                                                        <div class="flex items-center justify-end gap-2">
                                                            <button 
                                                                id="${row.id}"
                                                                data-action="edit-download"
                                                                class="p-2 rounded-lg hover:bg-blue-100 text-[#617589] hover:text-blue-600 transition-colors cursor-pointer"
                                                                title="Edit">
                                                                <i data-lucide="square-pen"></i>  
                                                            </button>
                                                            <button
                                                                id="${row.id}"
                                                                class="p-2 rounded-lg hover:bg-red-50 text-[#617589] hover:text-red-600 transition-colors cursor-pointer"
                                                                title="Delete" data-action='delete-download'>
                                                                <i data-lucide="trash"></i>  
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `
                                        }).join("")
                                    }                                    
                                </tbody>
                            </table>
                        </div>
                        <div class="flex items-center justify-between px-6 py-4 border-t border-[#dbe0e6] bg-white">
                            <p class="text-sm text-[#617589]">Showing ${startItem} to ${endItem} of ${totalRows} results</p>
                            
                            <div>
                                <button 
                                    class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                                    data-action="prev-page" ${this.currentPage === 1 ? 'disabled' : ''}
                                >Previous</button>
                                
                                <button 
                                    class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                                    data-action="next-page" ${this.currentPage === totalPages ? 'disabled' : ''}
                                >Next</button>
                            </div>
                        
                        </div>
                    </div>
                    
                </div>
            </div>
        `

    }

    getCurriculumEditor() {
        return `
            <form class="section-form" id="curriculumForm">curriculum</form>
        `
    }

    getSyllabusEditor() {
        return `
            <form class="section-form" id="syllabusForm">Syllabus</form>
        `
    }



    populateSectionEditor() { }


    //  Update navigation state
    updateNavigation() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to about content link
        const downloadContentLink = document.querySelector('[data-section="downloads"]');
        if (downloadContentLink) {
            downloadContentLink.classList.add('active');
        }
    }

    getPaginatedRows() {
        if (!this.downloadRows || !this.downloadRows.length) return [];
    
        this.totalPages = Math.ceil(this.downloadRows.length / this.rowSizeInPage);
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages; // clamp page
    
        const start = (this.currentPage - 1) * this.rowSizeInPage;
        const end = start + this.rowSizeInPage;
    
        return this.downloadRows.slice(start, end);
    }
    
    showModal(modal) {
        const modalOverlay = document.querySelector('.modalOverlay')
        modalOverlay.classList.remove('hide')
        modalOverlay.appendChild(modal)
    }

    hideModal() {
        const modalOverlay = document.querySelector('.modalOverlay');
        modalOverlay.classList.add('hide')
        modalOverlay.innerHTML = ""
    }

    // saving add downloads data 
    async saveDownloadModal(data, isEditMode = false, previousPublicId = null) {
        const saveBtn = document.getElementById('saveBtn');
        if (!saveBtn) return;

        try {
            let endPoint = ""
            saveBtn.disabled = true;
            saveBtn.innerHTML = `
                <div class="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="60">
                            <animate attributeName="stroke-dashoffset" values="60;0" dur="1s" repeatCount="indefinite"/>
                        </circle>
                    </svg>
                    Saving...
                </div>
            `;

            // console.log("data",isEditMode, data.id)

            if (isEditMode && !data.id) {
                console.error("Edit mode but no ID found", data);
                return window.showNotification("Error", "Download ID is missing.", "error");
            }

            let uploadResult = null;

            if(data.file){
                uploadResult = await this.uploadDownloadFile(data.file)
            }

            let bodyData = {}


            if(isEditMode){
                endPoint = `/api/downloads/edit/${data.id}`
                bodyData = data

                // If new file uploaded
                if (uploadResult) {
                    bodyData.fileName = uploadResult.fileName;
                    bodyData.cloudinaryPublicId = uploadResult.publicId;
                    bodyData.fileUrl = uploadResult.fileUrl;
                    bodyData.fileType = uploadResult.format;
                    bodyData.fileSizeKb = Math.round(data.file.size / 1024);
                }
            }else{
                endPoint = `/api/downloads/add`
                bodyData = {
                    mainTitle: data.mainTitle,
                    mainDescription: data.mainDescription,
                    category: data.category,
                    academicYear: data.academicYear,
                    class: data.class,
                    subject: data.subject,
                    categoryTitle: data.categoryTitle,
                    fileName: uploadResult.fileName ,
                    cloudinaryPublicId: uploadResult.publicId,
                    fileUrl: uploadResult.fileUrl,
                    fileType: uploadResult.format,
                    fileSizeKb: Math.round(data.file.size / 1024),
                    createAt: data.publishDate,
                }
            }

            const response = await fetch(endPoint, {
                method: isEditMode? 'PUT': 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to add download");
            }

             // ✅ Delete previous Cloudinary file if updated
            if (isEditMode && uploadResult && data.oldCloudinaryPublicId) {
                await this.deleteFile(data.oldCloudinaryPublicId)
            }

            

            window.showNotification(
                "Success",
                `Successfully added ${this.currentSection}`,
                "success"
            );

            this.hideModal()
            this.reloadTable(this.currentSection)

        } catch (error) {
            console.error("Error in saveAddModal:", error);

            window.showNotification(
                "Error",
                error.message,
                "error"
            );
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = "Save Result";
            }
        }
    }


    // * Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async deleteRowById(id){
        try{
            if(!id){
                throw new Error("Id is missing in deleting component")
            }
            const response = await fetch(`/api/downloads/${id}`, {
                method: "DELETE"
            });
            
            const file = await response.json()
            return file.data
        }catch(exception){
            throw new Error("Error while deleting row of download")
        }
    }

    async fetchDownloadByFilter(filter, value) {
        try{
            const response = await fetch(`/api/downloads/search?filter=${filter}&value=${value}`, {
                method: 'GET'
            })
            const data = await response.json()
            return data.rows
        }catch(exception){
            throw exception
        }
    }

   

    async uploadDownloadFile(file) {
        try{
            if(!file){
                throw new Error("No file selected")
            }

            const formData =  new FormData();
            formData.append("file", file)
            formData.append("folder", "marigold-school/downloads")

            const uploadResponse = await fetch('/api/upload/cloudinary', {
                method: 'POST',
                body: formData
            });

            const data = await uploadResponse.json();
            
            if (!data.success) {
                throw new Error(data.error || "Upload failed");
            }

            return {
                fileUrl: data.url,
                publicId: data.public_id,
                fileName: data.originalName,
                bytes: data.bytes,
                format: data.format
            };
        }catch(exception){
            console.error(exception)
            throw exception 
        }
    }

    openDeleteModal(id, itemName){
        window.DeleteConfirmationModal.show({
            title: `Delete ${this.currentSection}`,
            itemName: itemName,
            itemType: "download file",
            itemId: id,
            onConfirm: async() => {
                try{
                    const file = await this.deleteRowById(id);
                    await this.deleteFile(file.cloudinaryPublicId)
                    this.reloadTable(this.currentSection)
                }catch(exception){
                    console.error(exception)
                }
            },
            onCancel: () => {
                
            }
        })
    }

    async reloadTable(section) {
        try{
            const editorContentHtml = document.querySelector('#editorContent')
            let editorContent = null
            
            switch (section.toLowerCase()) {
                case 'hero':
                    editorContent = await this.getHeroEditor()
                    break
    
                case 'results':
                    editorContent = await this.getSubSectionEditor('results')
                    break
    
                case 'curriculum':
                    editorContent = await this.getSubSectionEditor('curriculum')
                    break
    
                case 'syllabus':
                    editorContent = await this.getSubSectionEditor('syllabus')
                    break
            }

            editorContentHtml.innerHTML = editorContent

            this.createLucideIcon()
            console.log("table reloaded")

        }catch(exception){
            console.error(exception)
        }
    }

    async deleteFile(publicId) {
        try{
            if(publicId){
                await fetch(`/api/downloads/delete-file`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: publicId })
                });
            }else{
                console.error("Public is missing")
            }
        }catch(exception){
            throw exception
        }
    }

}


// Initialize when is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.downloadsContentManager = new DownloadContentManager()
})