class DownloadPageLoader{
    constructor(){
        this.content = null;
        this.init();
        this.currentTab = 'results';
        this.currentPage = 1;
        this.rowSizeInPage = 6;
        this.currentRows = [];
        this.filterValues = [];
    }

    async init() {
        await this.loadContent();
        this.applyDownloadFilters()
        this.bindEvents()
    }

    createLucideIcon(){ 
        // Reinitialize lucide icons after content injection
        if(typeof lucide !== 'undefined'){
            lucide.createIcons();
        }else{
            console.error('failed to create lucide icon!');
        }
    }

    bindEvents(){
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => {
                this.applyDownloadFilters();
            });
        });

        document.addEventListener('click', (e) => {
            const actionButton = e.target.closest('[data-action]');

            if(!actionButton){
                return;
            }

            const action = actionButton.getAttribute('data-action')
            
            // show result tab
            if(action === "show-results"){
                this.currentTab = 'results'
                this.applyDownloadFilters()
            }

            // show curriculum tab
            if(action === "show-curriculum"){
                this.currentTab = 'curriculum'
                this.applyDownloadFilters()
            }

            // show syllabus tab
            if(action === "show-syllabus"){
                this.currentTab = 'syllabus'
                this.applyDownloadFilters()
            }

            if (action === "prev-page") {
                if (this.currentPage > 1) {
                    this.currentPage--
                    if(this.currentTab === 'results'){
                        this.renderResultTab(this.currentRows)
                    }else{
                        this.renderDownloadTab(this.currentRows)
                    }
                }
            }
        
            if (action === "next-page") {
                const totalPages = Math.ceil(this.currentRows.length / this.rowSizeInPage)
                if (this.currentPage < totalPages) {
                    this.currentPage++
                    if(this.currentTab === 'results'){
                        this.renderResultTab(this.currentRows)
                    }else{
                        this.renderDownloadTab(this.currentRows)
                    }
                }
            }

            // handle view 
            if (action === "view-download") {
                const id = actionButton.getAttribute("data-id");
                this.handleView(id);
            }
    
            // Download file
            if (action === "download-file") {
                const id = actionButton.getAttribute("data-id");
                this.handleDownload(id);
            }

            if(action === "filter-clear"){
                this.clearFilters();
            }


        })

    }

    async loadContent(){
        try{
            const cacheManager = window.cacheManager;
            let downloadData;
            
            if(cacheManager){
                downloadData = await cacheManager.fetch('/api/downloads')
            }else{
                //  Fallback to direct fetch with timeout
                const controller = new AbortController();
                const timoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch('/api/content/downloads', {
                    signal: controller.signal
                })

                clearTimeout(timoutId)

                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                downloadData = await response.json();
            }

            if(downloadData && downloadData.status && downloadData.data){
                // Organize the data by category for easier access
                this.content = {};
                downloadData.data.forEach(item => {
                    if(!this.content[item.category]){
                        this.content[item.category] = [];
                    }
                    this.content[item.category].push(item)
                })
            }else{
                this.content = null;
            }
        }catch(exception){
            if(exception.name === 'AbortError'){
                console.warn('About page content load timeout')
            }else{
                console.warn('❌ Failed to load download page content:', exception)
            }
        }
    }

    renderResultTab(tabData){
        const tabContentContainer = document.querySelector('#tab-content-container')
        tabContentContainer.innerHTML = ""

        if(!tabData || tabData.length === 0){
            return tabContentContainer.innerHTML = `
                <div>No data available in ${this.currentTab}</div>
            `
        }

        // Save full dataset
        this.currentRows = tabData

        const totalRows = this.currentRows.length
        const totalPages = Math.ceil(totalRows / this.rowSizeInPage)

        const rows = this.getPaginatedRows()

        const startItem = (this.currentPage - 1) * this.rowSizeInPage + 1
        const endItem = Math.min(this.currentPage * this.rowSizeInPage, totalRows)

        const rowsHtml = rows.map(row => {

            const publishDate = row.created_at.split("T")[0]
    
            return `
                <div class="results-table-row">
                    <div class="table-col-doc">
                        <div class="doc-title">${row.category_title}</div>
                        <div class="doc-meta">
                            <i data-lucide="file-text" class="file-icon pdf"></i>
                            <span>PDF • ${row.file_size_kb || '0'} KB</span>
                        </div>
                    </div>
    
                    <div class="table-col-date">${row.subject}</div>

                    <div class="table-col-date">${row.class}</div>

                    <div class="table-col-date">${publishDate}</div>
    
                    <div class="table-col-actions">
                        <button class="btn-view" 
                        data-action="view-download"
                        data-id="${row.id}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button 
                            class="btn-download h-9 w-9 p-0" 
                            data-action="download-file"
                            data-id="${row.id}"
                        >
                            <i data-lucide="download"></i>
                        </button>
                    </div>
                </div>
            `
        }).join("")
    
        const resultHtml = `
            <h2 class="section-title-downloads">Exam Results</h2>

            <div class="w-full overflow-x-auto">
                <div class="min-w-[900px]">
                
                    <div class="exam-results-section">

                        <div class="flex items-center justify-between pb-4 bg-white"> 

                            <p class="text-sm text-[#617589]">Showing ${startItem} to ${endItem} of ${totalRows} ${this.currentTab}</p>
                            
                            <div>
                                <button 
                                    class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                                    data-action="prev-page"
                                    ${this.currentPage === 1 ? "disabled" : ""} "
                                >Previous</button>
                                
                                <button 
                                    class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                                    data-action="next-page"
                                    ${this.currentPage === totalPages ? "disabled" : ""}
                                >Next</button>
                            </div>
                        
                        </div>


                        <div class="results-table">
                            <div class="results-table-header">
                                <div class="table-col-doc">DOCUMENT TITLE</div>
                                <div>Subject</div>
                                <div>Class</div>
                                <div>PUBLISHED DATE</div>
                                <div class="table-col-actions">ACTIONS</div>
                            </div>
                            
                            <div class="results-table-body">
                                ${rowsHtml}
                            </div>
                        </div>
                        
                        

                    </div>
                </div>
            </div>
        `

        tabContentContainer.innerHTML = resultHtml

        this.createLucideIcon()

        
    }

    renderDownloadTab(tabData){
        const tabContentContainer = document.querySelector('#tab-content-container')
        tabContentContainer.innerHTML = ""

        if(!tabData || tabData.length === 0){
            tabContentContainer.innerHTML = `
                <div>No data available in ${this.currentTab}</div>
            `   
            return
        }

        // Save full dataset
        this.currentRows = tabData

        const totalRows = this.currentRows.length
        const totalPages = Math.ceil(totalRows / this.rowSizeInPage)

        const rows = this.getPaginatedRows()

        const startItem = (this.currentPage - 1) * this.rowSizeInPage + 1
        const endItem = Math.min(this.currentPage * this.rowSizeInPage, totalRows)


        const downloadHtml = `
            <h2 class="section-title-downloads">${this.currentTab.toLocaleUpperCase()}</h2>

            <div class="flex items-center justify-between pb-4 bg-white"> 

                <p class="text-sm text-[#617589]">Showing ${startItem} to ${endItem} of ${totalRows} ${this.currentTab}</p>
                
                <div>
                    <button 
                        class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                        data-action="prev-page"
                        ${this.currentPage === 1 ? "disabled" : ""} "
                    >Previous</button>
                    
                    <button 
                        class="px-3 py-1 text-sm font-medium text-[#617589] bg-[#f0f2f4] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer" 
                        data-action="next-page"
                        ${this.currentPage === totalPages ? "disabled" : ""}
                    >Next</button>
                </div>
            
            </div>
            <div class="syllabus-cards-grid">
            ${
                rows.map(item => {
                    const publishedData = item.created_at.split('T')[0]
                    return `
                        <div class="syllabus-card">

                            <div class="flex gap-2">
                                <div class="syllabus-card-category syllabus-purple">${item.class || "Class"}</div>
                                <div class="syllabus-card-category syllabus-purple">${item.subject || "Subject"}</div>
                                <div class="syllabus-card-category syllabus-purple">${item.academic_year || "Class"}</div>
                            </div>

                            <h3 class="syllabus-card-title">${item.category_title}</h3>

                            <div class="syllabus-card-date">
                                <i data-lucide="calendar"></i>
                                <span>Published: ${publishedData}</span>
                            </div>

                            <div class="syllabus-card-actions">
                                <button 
                                    class="btn-view-card"
                                    data-id="${item.id}"
                                    data-action="view-download"
                                >
                                    <i data-lucide="eye"></i>
                                    <span>View</span>
                                </button>

                                <button
                                    class="btn-download-card"
                                    data-id="${item.id}"
                                    data-action="download-file"
                                >
                                    <i data-lucide="download"></i>
                                    <span>Download</span>
                                </button>
                            </div>
                        </div>`  
                }).join("")  
            }
            </div>
        `

        tabContentContainer.innerHTML = downloadHtml
        this.createLucideIcon()
    }

    getDownloadByFilter(currentTab) {
        return this.content[currentTab]
    }

    getPaginatedRows() {
        const start = (this.currentPage - 1) * this.rowSizeInPage
        const end = start + this.rowSizeInPage
        return this.currentRows.slice(start, end)
    }

    handleView(id) {
        const file = this.currentRows.find(row => row.id == id);

        if (file.file_url){
            window.open(file.file_url, "_blank");
        }else{
            throw new Error("File is missing or removed")
        }
    
    }

    handleDownload(id) {
        if(!id){
            throw new Error("Id is missing in download button")
        }

        const file = this.currentRows.find(row => row.id == id);
        
        if (!file.file_url){
            throw new Error("File is missing or removed")
        }
        const fileName = (file.category_title || "download")
        .replace(/\s+/g, "_"); // avoid spaces issues

        const downloadUrl = file.file_url.replace(
            "/upload/",
            `/upload/fl_attachment:${fileName}/`
        );
    
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.category_title || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    applyDownloadFilters() {
        this.getFilterValues()
        this.renderFilterOptions();


        const year = document.getElementById('academic-year').value;
        const grade = document.getElementById('class-grade').value;
        const subject = document.getElementById('subject').value;
    
        this.currentRows = this.content[this.currentTab].filter(row => {
            if((year === 'all' || row.academic_year == year) &&
                (grade === 'all' || row.class == grade) &&
                (subject === 'all' || row.subject == subject))
            {
                return row;
            }
        });
    
        this.currentPage = 1;
        
        if(this.currentTab === 'results'){
            this.renderResultTab(this.currentRows);
        }else{
            this.renderDownloadTab(this.currentRows);
        }

        
    }
    

    clearFilters() {
    document.getElementById('academic-year').value = 'all';
    document.getElementById('class-grade').value = 'all';
    document.getElementById('subject').value = 'all';

    this.currentRows = [...this.content[this.currentTab]];
    this.currentPage = 1;

    if (this.currentTab === 'results') {
        this.renderResultTab(this.currentRows);
    } else {
        this.renderDownloadTab(this.currentRows);
    }

    this.getFilterValues();
    this.renderFilterOptions();
}


    getFilterValues() {
        const academicYears = new Set();
        const classGrades = new Set();
        const subjects = new Set();
    
        // Combine all arrays into one
        const allItems = this.content[this.currentTab]
    
        allItems.forEach(item => {
            if (item.academic_year) academicYears.add(item.academic_year);
            if (item.class) classGrades.add(item.class);
            if (item.subject) subjects.add(item.subject);
        });
    
        this.filterValues = {
            academic_year: [...academicYears],
            class_grade: [...classGrades],
            subject: [...subjects]
        };    
    }

    renderFilterOptions() {

        const yearSelect = document.getElementById("academic-year");
        const gradeSelect = document.getElementById("class-grade");
        const subjectSelect = document.getElementById("subject");
    
        if (!yearSelect || !gradeSelect || !subjectSelect) return;
    
        // Save current selected values
        const selectedYear = yearSelect.value || 'all';
        const selectedGrade = gradeSelect.value || 'all';
        const selectedSubject = subjectSelect.value || 'all';
    
        // Rebuild options
        yearSelect.innerHTML =
            `<option value="all">All</option>` +
            this.filterValues.academic_year
                .sort((a, b) => b.localeCompare(a))
                .map(year => `<option value="${year}">${year}</option>`)
                .join("");
    
        gradeSelect.innerHTML =
            `<option value="all">All Classes</option>` +
            this.filterValues.class_grade
                .sort()
                .map(grade => `<option value="${grade}">${grade}</option>`)
                .join("");
    
        subjectSelect.innerHTML =
            `<option value="all">All Subjects</option>` +
            this.filterValues.subject
                .sort()
                .map(subject => `<option value="${subject}">${subject}</option>`)
                .join("");
    
        // Restore selected values
        yearSelect.value = this.filterValues.academic_year.includes(selectedYear) ? selectedYear : 'all';
        gradeSelect.value = this.filterValues.class_grade.includes(selectedGrade) ? selectedGrade : 'all';
        subjectSelect.value = this.filterValues.subject.includes(selectedSubject) ? selectedSubject : 'all';
    }
    
    
    
    
    
    
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.downloadPageLoader = new DownloadPageLoader();
})
