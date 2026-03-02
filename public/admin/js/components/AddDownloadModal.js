/**
 * Reusable ResultFormCard Component
 * @param {Object} props - Properties to customize the card
 * @param {string} props.title - Card heading
 * @param {string} props.description - Card subheading
 * @param {function} props.onSave - Callback when save button clicked
 * @param {function} props.onCancel - Callback when cancel button clicked
*/
// export default function AddDownloadModal(props) {
//     let selectedFile = null;
//     let isDirty = false;
//     const isEditMode = !!props.editData;
//     const data = props.editData;
    

//     const container = document.createElement('div');
//     container.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";

//     // Inner modal
//     const modal = document.createElement('div');
//     modal.className = "flex flex-col w-full max-w-[600px] max-h-[80vh] bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden";
//     modal.style.maxHeight = "80vh"

//     // Modal inner HTML
//     modal.innerHTML = `
//         <!-- Header -->
//         <div class="px-6 py-5 border-b border-[#dbe0e6] flex justify-between items-center cursor-move" id="modalHeader">
//             <div>
//                 <h2 class="text-xl font-bold text-[#111418]">${props.title || 'Add / Edit Result'}</h2>
//                 <p class="text-sm text-[#617589] mt-1">${props.description || 'Enter the details for the exam result document below.'}</p>
//             </div>
//             <button id="closeModal" class="text-[#617589] hover:text-red-600 font-bold">✕</button>
//         </div>

//         <!-- Scrollable Body -->
//         <div class="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

//             <!-- Document Title -->
//             <div class="flex flex-col gap-1">
//                 <label class="text-sm font-bold text-[#111418]">Document Title</label>
//                 <input id="docTitle" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Grade 10 Science Results" type="text" />
//                 <span class="text-red-600 text-xs hidden" id="docTitleError">Document Title is required</span>
//             </div>

//             <!-- Publish Date -->
//             <div class="flex flex-col gap-1">
//                 <label class="text-sm font-bold text-[#111418]">Publish Date</label>
//                 <input id="publishDate" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" type="date" />
//                 <span class="text-red-600 text-xs hidden" id="publishDateError">Publish Date is required</span>
//             </div>

//             <!-- Academic Year -->
//             <div class="flex flex-col gap-1">
//                 <label class="text-sm font-bold text-[#111418]">Academic Year</label>
//                 <input id="academicYear" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. 2081/2082" type="text" />
//                 <span class="text-red-600 text-xs hidden" id="academicYearError">Academic Year is required</span>

//             </div>

//             <!-- Class -->
//             <div class="flex flex-col gap-1">
//                 <label class="text-sm font-bold text-[#111418]">Class</label>
//                 <input id="classField" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Grade 10" type="text" />
//                 <span class="text-red-600 text-xs hidden" id="classError">Class is required</span>
//             </div>

//             <!-- Subject -->
//             <div class="flex flex-col gap-1">
//                 <label class="text-sm font-bold text-[#111418]">Subject</label>
//                 <input id="subject" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Science" type="text" />
//                 <span class="text-red-600 text-xs hidden" id="subjectError">Subject is required</span>
//             </div>

//             <!-- File Upload -->
//             <div class="flex flex-col gap-1 md:col-span-2">
//                 <label class="text-sm font-bold text-[#111418]">Upload Document</label>
//                 <div id="uploadZoneContainer">

//                     <div id="uploadZone" class="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-[#dbe0e6] bg-[#f8f9fa] cursor-pointer">
//                         <p class="text-sm font-medium text-[#111418]">Click to upload or drag and drop</p>
//                         <p class="text-xs text-[#617589] mt-1">PDF, DOCX or XLSX (MAX. 10MB)</p>
//                     </div>
//                     <div class=" flex justify-between items-center w-full px-4 hidden" id="removeFileBtnContainer">
//                         <span class="text-sm" id="selectedFileName"></span>
//                         <button id="removeFileBtn" class="text-red-600 text-sm">Remove</button>
//                     </div>

//                     <input type="file" accept=".pdf,.docx,.xlsx" class="hidden" id="file-input"/>
//                     <span class="text-red-600 text-xs hidden" id="fileError">File is required</span>
//                 </div>
//             </div>
//         </div>

//         <!-- Footer -->
//         <div class="px-6 py-5 bg-[#f8f9fa] border-t border-[#dbe0e6] flex items-center justify-end gap-3">
//             <button id="cancelBtn" class="h-10 px-6 rounded-xl border border-[#dbe0e6] bg-white text-sm font-bold cursor-pointer">Cancel</button>
//             <button id="saveBtn" class="h-10 px-6 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer">Save Result</button>
//         </div>
//     `;



//     container.appendChild(modal);

//     // Grab elements
//     const uploadZone = modal.querySelector('#uploadZone');
//     const uploadZoneContainer = modal.querySelector('#uploadZoneContainer');
//     const fileInput = modal.querySelector('#file-input');
//     const titleInput = modal.querySelector('#docTitle');
//     const publishInput = modal.querySelector('#publishDate');
//     const academicYearInput = modal.querySelector('#academicYear');
//     const classInput = modal.querySelector('#classField');
//     const subjectInput = modal.querySelector('#subject');

//     const titleError = modal.querySelector('#docTitleError');
//     const publishError = modal.querySelector('#publishDateError');
//     const fileError = modal.querySelector('#fileError');
//     const academicYearError = modal.querySelector('#academicYearError')
//     const classError = modal.querySelector('#classError')
//     const subjectError = modal.querySelector('#subjectError')
    

//     const closeModal = modal.querySelector('#closeModal');
//     const cancelBtn = modal.querySelector('#cancelBtn');
//     const saveBtn = modal.querySelector('#saveBtn');
//     const modalHeader = modal.querySelector('#modalHeader');
//     const removeFileBtn = modal.querySelector('#removeFileBtn');
//     const removeFileBtnContainer = modal.querySelector('#removeFileBtnContainer');
    

//     if (isEditMode) {
        
//         titleInput.value = data.category_title || '';
//         publishInput.value = data.created_at
//         ? data.created_at.split('T')[0]
//         : '';
//         academicYearInput.value = data.academic_year || '';
//         classInput.value = data.class || '';
//         subjectInput.value = data.subject || '';
        
//         saveBtn.disabled = true
//         saveBtn.classList.add('bg-gray-300', 'cursor-not-allowed'); // gray + block mouse
        
//         if(data.file_name){
//             showFile(data.file_name)
//             selectedFile.name = data.file_name;
//         }
//     }
    
    

//     // File upload logic
//     uploadZone.addEventListener('click', () => fileInput.click());

//     uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('border-primary/50','bg-primary/5'); });

//     uploadZone.addEventListener('dragleave', e => { e.preventDefault(); uploadZone.classList.remove('border-primary/50','bg-primary/5'); });

//     uploadZone.addEventListener('drop', e => { 
//         e.preventDefault(); 
//         fileInput.files = e.dataTransfer.files; 
//     });    
    
//     // Live validation
//     titleInput.addEventListener('input', () => { titleInput.value.trim() ? (titleError.classList.add('hidden'), titleInput.classList.remove('border-red-600')) : null; });

//     publishInput.addEventListener('input', () => { publishInput.value.trim() ? (publishError.classList.add('hidden'), publishInput.classList.remove('border-red-600')) : null; });

//     fileInput.addEventListener('change', () => { 
//         selectedFile = fileInput.files[0] || null;
//         markDirty()

//         if(selectedFile !== null){
//             const fileName = removeFileBtnContainer.querySelector('#selectedFileName')
//             fileName.innerHTML= selectedFile.name
//             removeFileBtnContainer.classList.remove('hidden')
//             uploadZone.classList.add('hidden')
//         }else{
//             removeFileBtnContainer.classList.add('hidden')
//             uploadZone.classList.remove('hidden')
//         }

//         selectedFile? 
//             (fileError.classList.add('hidden'), 
//             uploadZone.classList.remove('border-red-600')) 
//             : null; 
//     });

//     // Text inputs
//     [titleInput, publishInput, academicYearInput, classInput, subjectInput].forEach(input => {
//         input.addEventListener('input', markDirty);
//     });

    

//     function markDirty (){
//         if (!isDirty) {
//             isDirty = true;
//             saveBtn.disabled = false;
//             saveBtn.classList.add('bg-gray-300', 'cursor-not-allowed'); // gray + block mouse
//         }else{
//             saveBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
//             saveBtn.classList.add('bg-primary'); // your active color
//         }
//     };

//     function showFile(fileName = null) {
//         const fileNameHtml = removeFileBtnContainer.querySelector('#selectedFileName')
//         if(!fileName){
//             fileName = selectedFile.name
//         }
//         fileNameHtml.innerHTML= fileName
//         removeFileBtnContainer.classList.remove('hidden')
//         uploadZone.classList.add('hidden')
//     }

//     function hideFile() {
//         removeFileBtnContainer.classList.add('hidden')
//         uploadZone.classList.remove('hidden')
//     }

//     saveBtn.textContent = isEditMode? "Update Result": "Save Result"

//     // Save
//     saveBtn.addEventListener('click', () => {
//         let isValid = true;
//         [titleError,publishError,fileError, academicYearError, classError, subjectError].forEach(el => el.classList.add('hidden'));
//         [titleInput,publishInput,uploadZone, academicYearInput, classInput, subjectInput].forEach(el => el.classList.remove('border-red-600'));

//         // category input validation 
//         if (!titleInput.value.trim()) { 
//             titleError.classList.remove('hidden'); 
//             titleInput.classList.add('border-red-600'); 
//             isValid=false; 
//         }

//         // published date input validation 
//         if (!publishInput.value.trim()) { 
//             publishError.classList.remove('hidden'); 
//             publishInput.classList.add('border-red-600'); 
//             isValid=false; 
//         }

//         // file input validation 
//         if (!isEditMode && !fileInput.files.length) { 
//             fileError.classList.remove('hidden'); 
//             uploadZone.classList.add('border-red-600'); 
//             isValid=false; 
//         }
        
//         // academic year input validation 
//         if (!academicYearInput.value.length) { 
//             academicYearError.classList.remove('hidden'); 
//             academicYearInput.classList.add('border-red-600'); 
//             isValid=false; 
//         }

//         // class input validation 
//         if (!classInput.value.length) { 
//             classError.classList.remove('hidden'); 
//             classInput.classList.add('border-red-600'); 
//             isValid=false; 
//         }

//         // subject input validation 
//         if (!subjectInput.value.length) { 
//             subjectError.classList.remove('hidden'); 
//             subjectInput.classList.add('border-red-600'); 
//             isValid=false; 
//         }


//         if (!isValid) return;

//         props.onSave && props.onSave({
//             category: props.currentSection,
//             categoryTitle: titleInput.value.trim(),
//             academicYear: academicYearInput.value.trim(),
//             class: classInput.value.trim(),
//             subject: subjectInput.value.trim(),
//             publishDate: publishInput.value.trim(),
//             file: selectedFile,
//         });
//     });

//     // remove file button 
//     removeFileBtn.addEventListener('click', (e)=> {
//         fileInput.value = ""

//         removeFileBtnContainer.classList.add('hidden')
//         uploadZone.classList.remove('hidden')
//     })

//     // Cancel / Close
//     const close = () => { props.onCancel && props.onCancel(); container.remove(); };
//     cancelBtn.addEventListener('click', close);
//     closeModal.addEventListener('click', close);
//     window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

//     // Drag logic
//     let isDragging = false, offsetX = 0, offsetY = 0;
//     modalHeader.addEventListener('mousedown', (e) => {
//         isDragging = true;
//         offsetX = e.clientX - modal.offsetLeft;
//         offsetY = e.clientY - modal.offsetTop;
//         document.body.style.userSelect = 'none';
//     });
//     window.addEventListener('mousemove', (e) => {
//         if (!isDragging) return;
//         modal.style.left = `${e.clientX - offsetX}px`;
//         modal.style.top = `${e.clientY - offsetY}px`;
//         modal.style.position = 'absolute';
//     });
//     window.addEventListener('mouseup', () => { isDragging = false; document.body.style.userSelect = ''; });

    

//     return container;
// }

export default function AddDownloadModal(props) {
    let selectedFile = null;
    const isEditMode = !!props.editData;
    const data = props.editData;
    let originalData = null;
    

    const container = document.createElement('div');
    container.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4";

    // Inner modal
    const modal = document.createElement('div');
    modal.className = "flex flex-col w-full max-w-[600px] max-h-[80vh] bg-white rounded-xl border border-[#dbe0e6] shadow-sm overflow-hidden";
    modal.style.maxHeight = "80vh"

    // Modal inner HTML
    modal.innerHTML = `
        <!-- Header -->
        <div class="px-6 py-5 border-b border-[#dbe0e6] flex justify-between items-center cursor-move" id="modalHeader">
            <div>
                <h2 class="text-xl font-bold text-[#111418]">${props.title || 'Add / Edit Result'}</h2>
                <p class="text-sm text-[#617589] mt-1">${props.description || 'Enter the details for the exam result document below.'}</p>
            </div>
            <button id="closeModal" class="text-[#617589] hover:text-red-600 font-bold">✕</button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            <!-- Document Title -->
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold text-[#111418]">Document Title</label>
                <input id="docTitle" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Grade 10 Science Results" type="text" />
                <span class="text-red-600 text-xs hidden" id="docTitleError">Document Title is required</span>
            </div>

            <!-- Publish Date -->
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold text-[#111418]">Publish Date</label>
                <input id="publishDate" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" type="date" />
                <span class="text-red-600 text-xs hidden" id="publishDateError">Publish Date is required</span>
            </div>

            <!-- Academic Year -->
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold text-[#111418]">Academic Year</label>
                <input id="academicYear" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. 2081/2082" type="text" />
                <span class="text-red-600 text-xs hidden" id="academicYearError">Academic Year is required</span>

            </div>

            <!-- Class -->
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold text-[#111418]">Class</label>
                <input id="classField" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Grade 10" type="text" />
                <span class="text-red-600 text-xs hidden" id="classError">Class is required</span>
            </div>

            <!-- Subject -->
            <div class="flex flex-col gap-1">
                <label class="text-sm font-bold text-[#111418]">Subject</label>
                <input id="subject" class="w-full h-12 px-4 rounded-xl border border-[#dbe0e6]" placeholder="e.g. Science" type="text" />
                <span class="text-red-600 text-xs hidden" id="subjectError">Subject is required</span>
            </div>

            <!-- File Upload -->
            <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-bold text-[#111418]">Upload Document</label>
                <div id="uploadZoneContainer">

                    <div id="uploadZone" class="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-[#dbe0e6] bg-[#f8f9fa] cursor-pointer">
                        <p class="text-sm font-medium text-[#111418]">Click to upload or drag and drop</p>
                        <p class="text-xs text-[#617589] mt-1">PDF, DOCX or XLSX (MAX. 10MB)</p>
                    </div>
                    <div class=" flex justify-between items-center w-full px-4 hidden" id="removeFileBtnContainer">
                        <span class="text-sm" id="selectedFileName"></span>
                        <button id="removeFileBtn" class="text-red-600 text-sm">Remove</button>
                    </div>

                    <input type="file" accept=".pdf,.docx,.xlsx" class="hidden" id="file-input"/>
                    <span class="text-red-600 text-xs hidden" id="fileError">File is required</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-5 bg-[#f8f9fa] border-t border-[#dbe0e6] flex items-center justify-end gap-3">
            <button id="cancelBtn" class="h-10 px-6 rounded-xl border border-[#dbe0e6] bg-white text-sm font-bold cursor-pointer">Cancel</button>
            <button id="saveBtn" class="h-10 px-6 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer">Save Result</button>
        </div>
    `;



    container.appendChild(modal);

    // Grab elements
    const uploadZone = modal.querySelector('#uploadZone');
    const uploadZoneContainer = modal.querySelector('#uploadZoneContainer');
    const fileInput = modal.querySelector('#file-input');
    const titleInput = modal.querySelector('#docTitle');
    const publishInput = modal.querySelector('#publishDate');
    const academicYearInput = modal.querySelector('#academicYear');
    const classInput = modal.querySelector('#classField');
    const subjectInput = modal.querySelector('#subject');

    const titleError = modal.querySelector('#docTitleError');
    const publishError = modal.querySelector('#publishDateError');
    const fileError = modal.querySelector('#fileError');
    const academicYearError = modal.querySelector('#academicYearError')
    const classError = modal.querySelector('#classError')
    const subjectError = modal.querySelector('#subjectError')
    

    const closeModal = modal.querySelector('#closeModal');
    const cancelBtn = modal.querySelector('#cancelBtn');
    const saveBtn = modal.querySelector('#saveBtn');
    const modalHeader = modal.querySelector('#modalHeader');
    const removeFileBtn = modal.querySelector('#removeFileBtn');
    const removeFileBtnContainer = modal.querySelector('#removeFileBtnContainer');
    

    if (isEditMode) {
        originalData = {
            categoryTitle: data.category_title || '',
            publishDate: data.created_at ? data.created_at.split('T')[0] : '',
            academicYear: data.academic_year || '',
            class: data.class || '',
            subject: data.subject || '',
            fileName: data.file_name || '',
            cloudinaryPublicId: data.cloudinary_public_id || ''
        };
    
        titleInput.value = originalData.categoryTitle;
        publishInput.value = originalData.publishDate;
        academicYearInput.value = originalData.academicYear;
        classInput.value = originalData.class;
        subjectInput.value = originalData.subject;
    
        if (originalData.fileName) {
            showFile(originalData.fileName);
        }

        disableButton()
    
    }
    
    

    // File upload logic
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('border-primary/50','bg-primary/5'); });

    uploadZone.addEventListener('dragleave', e => { e.preventDefault(); uploadZone.classList.remove('border-primary/50','bg-primary/5'); });

    uploadZone.addEventListener('drop', e => { 
        e.preventDefault(); 
        fileInput.files = e.dataTransfer.files; 
    });    
    
    // Live validation
    titleInput.addEventListener('input', () => { titleInput.value.trim() ? (titleError.classList.add('hidden'), titleInput.classList.remove('border-red-600')) : null; });

    publishInput.addEventListener('input', () => { publishInput.value.trim() ? (publishError.classList.add('hidden'), publishInput.classList.remove('border-red-600')) : null; });

    fileInput.addEventListener('change', () => { 
        selectedFile = fileInput.files[0] || null;
        
        if(selectedFile){
            showFile(selectedFile.name);
        }else{
            hideFile()
        }

        checkIfChanged()
    });

    // Text inputs
    [titleInput, publishInput, academicYearInput, classInput, subjectInput].forEach(input => {
        input.addEventListener('input', checkIfChanged);
    });

    function showFile(fileName = null) {
        const fileNameHtml = removeFileBtnContainer.querySelector('#selectedFileName')
        if(!fileName){
            fileName = selectedFile.name
        }
        fileNameHtml.innerHTML= fileName
        removeFileBtnContainer.classList.remove('hidden')
        uploadZone.classList.add('hidden')
    }

    function hideFile() {
        removeFileBtnContainer.classList.add('hidden')
        uploadZone.classList.remove('hidden')
    }

    function disableButton() {
        saveBtn.disabled = true;
        saveBtn.classList.remove('bg-primary');
        saveBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
    }
    
    function enableButton() {
        saveBtn.disabled = false;
        saveBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
        saveBtn.classList.add('bg-primary', 'cursor-pointer');
    }

    function checkIfChanged() {

        if (!isEditMode) return enableButton();
    
        const changed =
            titleInput.value.trim() !== originalData.categoryTitle ||
            publishInput.value.trim() !== originalData.publishDate ||
            academicYearInput.value.trim() !== originalData.academicYear ||
            classInput.value.trim() !== originalData.class ||
            subjectInput.value.trim() !== originalData.subject ||
            selectedFile !== null;
    
        changed ? enableButton() : disableButton();
    }
    

    saveBtn.textContent = isEditMode? "Update Result": "Save Result"

    // Save
    saveBtn.addEventListener('click', () => {

        if (saveBtn.disabled) return;
    
        let isValid = true;
    
        [titleError,publishError,fileError,academicYearError,classError,subjectError]
            .forEach(el => el.classList.add('hidden'));
    
        [titleInput,publishInput,uploadZone,academicYearInput,classInput,subjectInput]
            .forEach(el => el.classList.remove('border-red-600'));
    
        if (!titleInput.value.trim()) {
            titleError.classList.remove('hidden');
            titleInput.classList.add('border-red-600');
            isValid = false;
        }
    
        if (!publishInput.value.trim()) {
            publishError.classList.remove('hidden');
            publishInput.classList.add('border-red-600');
            isValid = false;
        }
    
        if (!academicYearInput.value.trim()) {
            academicYearError.classList.remove('hidden');
            academicYearInput.classList.add('border-red-600');
            isValid = false;
        }
    
        if (!classInput.value.trim()) {
            classError.classList.remove('hidden');
            classInput.classList.add('border-red-600');
            isValid = false;
        }
    
        if (!subjectInput.value.trim()) {
            subjectError.classList.remove('hidden');
            subjectInput.classList.add('border-red-600');
            isValid = false;
        }
    
        // File required ONLY in Add mode
        if (!isEditMode && !selectedFile) {
            fileError.classList.remove('hidden');
            uploadZone.classList.add('border-red-600');
            isValid = false;
        }
    
        if (!isValid) return;
    
        // Build payload
        let payload = {};
    
        if (isEditMode) {
    
            // Only send changed fields
            if (titleInput.value.trim() !== originalData.categoryTitle)
                payload.categoryTitle = titleInput.value.trim();
    
            if (publishInput.value.trim() !== originalData.publishDate)
                payload.publishDate = publishInput.value.trim();
    
            if (academicYearInput.value.trim() !== originalData.academicYear)
                payload.academicYear = academicYearInput.value.trim();
    
            if (classInput.value.trim() !== originalData.class)
                payload.class = classInput.value.trim();
    
            if (subjectInput.value.trim() !== originalData.subject)
                payload.subject = subjectInput.value.trim();
    
            if (selectedFile) {
                payload.file = selectedFile;
                payload.oldCloudinaryPublicId = originalData.cloudinaryPublicId;
            }
    
            payload.id = data.id;
    
        } else {
            // Add mode
            payload = {
                category: props.currentSection,
                categoryTitle: titleInput.value.trim(),
                academicYear: academicYearInput.value.trim(),
                class: classInput.value.trim(),
                subject: subjectInput.value.trim(),
                publishDate: publishInput.value.trim(),
                file: selectedFile
            };
        }
    
        props.onSave && props.onSave(payload);
    });
    

    // remove file button 
    removeFileBtn.addEventListener('click', () => {
        fileInput.value = "";
        selectedFile = null;
        hideFile();
        checkIfChanged();
    });
    

    // Cancel / Close
    const close = () => { props.onCancel && props.onCancel(); container.remove(); };
    cancelBtn.addEventListener('click', close);
    closeModal.addEventListener('click', close);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Drag logic
    let isDragging = false, offsetX = 0, offsetY = 0;
    modalHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - modal.offsetLeft;
        offsetY = e.clientY - modal.offsetTop;
        document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
        modal.style.position = 'absolute';
    });
    window.addEventListener('mouseup', () => { isDragging = false; document.body.style.userSelect = ''; });

    

    return container;
}




