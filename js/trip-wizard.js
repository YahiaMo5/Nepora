// Trip Wizard JS
(function(){
    const governorateAttractions = {
        giza: [
            {id:'pyramids', name:{ar:'الأهرامات وأبو الهول', en:'Pyramids & Sphinx'}, price:200},
            {id:'saqqara', name:{ar:'هرم سقارة المدرج', en:'Saqqara Step Pyramid'}, price:120},
            {id:'grand-museum', name:{ar:'المتحف المصري الكبير', en:'Grand Egyptian Museum'}, price:150},
            {id:'memphis', name:{ar:'متحف ممفيس المفتوح', en:'Memphis Open Air Museum'}, price:80},
            {id:'queens-pyramids', name:{ar:'أهرامات الملكات', en:'Queens Pyramids'}, price:85},
        ],
        luxor: [
            {id:'karnak', name:{ar:'معبد الكرنك', en:'Karnak Temple'}, price:180},
            {id:'valley', name:{ar:'وادي الملوك', en:'Valley of the Kings'}, price:160},
            {id:'luxor-temple', name:{ar:'معبد الأقصر', en:'Luxor Temple'}, price:140},
            {id:'hatshepsut', name:{ar:'معبد حتشبسوت', en:'Hatshepsut Temple'}, price:130},
            {id:'medinet-habu', name:{ar:'معبد مدينة هابو', en:'Medinet Habu Temple'}, price:110},
            {id:'ramesseum', name:{ar:'معبد الرامسيس', en:'Ramesseum Temple'}, price:100},
            {id:'nobles-tombs', name:{ar:'مقابر النبلاء', en:'Nobles Tombs'}, price:90}
        ],
        aswan: [
            {id:'abu', name:{ar:'معبد أبو سمبل', en:'Abu Simbel'}, price:220},
            {id:'philae', name:{ar:'معبد فيلة', en:'Philae Temple'}, price:140},
            {id:'kom-ombo', name:{ar:'معبد كوم أمبو', en:'Kom Ombo Temple'}, price:110},
            {id:'edfu', name:{ar:'معبد إدفو', en:'Edfu Temple'}, price:100},
            {id:'kalabsha', name:{ar:'معبد كلابشة', en:'Kalabsha Temple'}, price:90},
            {id:'unfinished-obelisk', name:{ar:'المسلة الناقصة', en:'Unfinished Obelisk'}, price:70},
            {id:'sehel', name:{ar:'جزيرة سهيل ونقوشها', en:'Sehel Island Inscriptions'}, price:85}
        ],
        alexandria: [
            {id:'library', name:{ar:'مكتبة الإسكندرية', en:'Library of Alexandria'}, price:100},
            {id:'kom-el-shoqafa', name:{ar:'مقابر كوم الشقافة', en:'Kom el-Shoqafa Catacombs'}, price:90},
            {id:'pompeys-pillar', name:{ar:'عمود بومبي', en:'Pompeys Pillar'}, price:70},
            {id:'serapeum', name:{ar:'معبد السربايوم', en:'Serapeum Temple'}, price:85}
        ],
        cairo: [
            {id:'museum', name:{ar:'المتحف المصري', en:'Egyptian Museum'}, price:120},
            {id:'nilometer', name:{ar:'مقياس النيل', en:'Nilometer'}, price:70},
        ]
    };

    const hotels = {
        '3': [
            {id:'hotel-nubian-charm', img:'hotel-nubian-charm.png', name:{ar:'فندق Nubian Charm', en:'Nubian Charm'}, price:60, amenities:['wifi','food'] , rooms:[{type:'single',price:60},{type:'double',price:90}]},
            {id:'hotel-aswan-plaza', img:'hotel-aswan-plaza.png', name:{ar:'فندق Aswan Plaza', en:'Aswan Plaza'}, price:50, amenities:['wifi'], rooms:[{type:'double',price:50}]}
        ],
        '4': [
            {id:'hotel-giza-pyramid', img:'hotel-giza-pyramid.png', name:{ar:'فندق Giza Pyramid', en:'Giza Pyramid'}, price:120, amenities:['wifi','pool','breakfast'], rooms:[{type:'standard',price:120},{type:'deluxe',price:180}]},
            {id:'hotel-luxor-royal', img:'hotel-luxor-royal.png', name:{ar:'فندق Luxor Royal', en:'Luxor Royal'}, price:110, amenities:['wifi','breakfast'], rooms:[{type:'standard',price:110},{type:'suite',price:200}]}
        ],
        '5': [
            {id:'hotel-grand-cairo', img:'hotel-grand-cairo.png', name:{ar:'فندق Grand Cairo', en:'Grand Cairo'}, price:220, amenities:['wifi','pool','spa','breakfast'], rooms:[{type:'deluxe',price:220},{type:'suite',price:350}]},
            {id:'hotel-karnak-luxury', img:'hotel-karnak-luxury.png', name:{ar:'فندق Karnak Luxury', en:'Karnak Luxury'}, price:250, amenities:['wifi','pool','breakfast','parking'], rooms:[{type:'deluxe',price:250},{type:'presidential',price:500}]}
        ]
    };

    // Helpers
    const $ = selector => document.querySelector(selector);
    const $$ = selector => Array.from(document.querySelectorAll(selector));

    // Keep track of current step
    let currentStepNumber = 1;

    function showStep(n) {
        const currentStep = document.querySelector('.wizard-step:not(.d-none)');
        const nextStep = document.querySelector(`.wizard-step[data-step="${n}"]`);
        
        if (currentStep && currentStep !== nextStep) {
            // Always slide current step to the right (RTL-friendly)
            currentStep.classList.add('slide-out');
            
            setTimeout(() => {
                currentStep.classList.add('d-none');
                currentStep.classList.remove('slide-out');
            }, 500); // match CSS transition duration
        }

        if (nextStep) {
            // Always slide new step from the left (RTL-friendly)
            nextStep.classList.add('slide-in');
            nextStep.classList.remove('d-none');
            
            // Force reflow
            nextStep.offsetHeight;
            // Ensure the parent steps-content grows to fit the next step to avoid clipping
            try{
                const container = nextStep.closest('.steps-content');
                if(container){
                    // set min-height to the content's full height (including padding)
                    const h = nextStep.scrollHeight;
                    container.style.minHeight = h + 'px';
                }
            }catch(e){/* ignore */}

            // Move to center (start animation)
            nextStep.classList.remove('slide-in');
            // after the CSS transition ends, recompute container height to account for final layout
            setTimeout(()=>{
                try{ adjustStepsContentHeight(); }catch(e){}
            }, 520); // slightly longer than CSS transition (500ms) to ensure layout settled
        }

        // Update indicators and progress
        $$('.step-indicator').forEach(si => {
            const stepNum = parseInt(si.getAttribute('data-step'));
            si.classList.toggle('active', stepNum == n);
            si.classList.toggle('completed', stepNum < n);
        });
        
        // Update progress
        updateConnectorProgress(n);
        
        // Store current step
        currentStepNumber = n;
    }

    // update connector progress height based on current step (1..4)
    function updateConnectorProgress(step){
        const container = document.querySelector('.step-indicators');
        if(!container) return;
        const progress = container.querySelector('.connector-progress');
        const totalSteps = container.querySelectorAll('.step-indicator').length || 4;
        const ratio = Math.max(0, Math.min(1, (step-1)/(totalSteps-1)));
        // set height as percentage of container (from bottom up)
        if(progress){
            progress.style.height = `${ratio * 100}%`;
        }
    }

    // Ensure the .steps-content container fits the currently visible step
    function adjustStepsContentHeight(){
        try{
            const content = document.querySelector('.steps-content');
            if(!content) return;
            const activeStep = content.querySelector('.wizard-step:not(.d-none)');
            if(activeStep){
                // use scrollHeight for the full height including content
                const h = activeStep.scrollHeight;
                content.style.minHeight = h + 'px';
            } else {
                // fallback to default
                content.style.minHeight = '';
            }
        }catch(e){/* ignore */}
    }

    function populateAttractions(gov){
        const list = $('#attractionsList');
        list.innerHTML = '';
        // Add a container row for the grid system
        const row = document.createElement('div');
        row.className = 'row g-3';
        list.appendChild(row);
        
        const items = governorateAttractions[gov]||[];
        // if no governorate provided, keep the container empty
        if(!gov || !items.length) return;
        items.forEach(item=>{
            const col = document.createElement('div'); 
            col.className='col-12 col-md-6 col-lg-3';
            const box = document.createElement('label'); 
            box.className='attraction-item card-compact';
            const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
            const name = (item.name && typeof item.name === 'object') ? (item.name[currentLang] || item.name.ar) : (item.name || '');
            // prefer specific image files; fallback to a placeholder
            const imgFiles = {
                // Giza
                pyramids: 'images/pyramids.png',
                saqqara: 'images/saqqara.png',
                'grand-museum': 'images/grand-museum.png',
                memphis: 'images/memphis-museum.png',
                'queens-pyramids': 'images/queens-pyramids.png',
                'bent-pyramid': 'images/bent-pyramid.png',
                
                // Luxor
                karnak: 'images/karnak.png',
                valley: 'images/valley-of-kings.png',
                'luxor-temple': 'images/luxor-temple.png',
                hatshepsut: 'images/hatshepsut-temple.png',
                'medinet-habu': 'images/medinet-habu.png',
                ramesseum: 'images/ramesseum.png',
                'nobles-tombs': 'images/nobles-tombs.png',
                
                // Aswan
                abu: 'abu-simbel.png',
                philae: 'philae.png',
                'kom-ombo': 'kom-ombo.png',
                edfu: 'edfu-temple.png',
                kalabsha: 'kalabsha.png',
                'unfinished-obelisk': 'unfinished-obelisk.png',
                sehel: 'sehel-inscriptions.png',
                
                // Alexandria
                library: 'alexandria-library.png',
                'kom-el-shoqafa': 'kom-el-shoqafa.png',
                'pompeys-pillar': 'pompeys-pillar.png',
                serapeum: 'serapeum.png',
                
                // Cairo
                museum: 'cairo-museum.png',
                nilometer: 'nilometer.png',
            };
            const imgPath = `assets/images/${imgFiles[item.id] || 'attraction-placeholder.png'}`;
            // Add location information based on governorate
            const govName = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation(`tripWizard.governorates.${gov}`, currentLang) || gov) : ({giza:'الجيزة',luxor:'الأقصر',aswan:'أسوان',alexandria:'الإسكندرية',cairo:'القاهرة'})[gov] || gov;
            
            box.innerHTML = `
                <input type="checkbox" name="attraction" value="${item.id}" data-price="${item.price}" class="d-none">
                <img src="${imgPath}" alt="${name}" class="card-media" onerror="this.src='assets/images/attraction-placeholder.png'">
                <div class="attraction-details">
                    <div class="attraction-title">${name}</div>
                    <div class="attraction-location">
                        <i class="fas fa-map-marker-alt"></i> ${govName}
                    </div>
                    <div class="attraction-meta">
                        <span class="recommended-time">
                            <i class="far fa-clock"></i> 
                            ${(window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.step1.recommendedTime', currentLang) || '3-4 ساعات') : '3-4 ساعات'}
                        </span>
                    </div>
                </div>
                <div class="attraction-checkbox">
                    <i class="fas fa-check"></i>
                </div>
            `;
            // toggle when clicking the whole card
            box.addEventListener('click', (e) => {
                // ignore clicks on inner interactive controls
                if(e.target && (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION' || e.target.tagName === 'A' || e.target.tagName === 'BUTTON')) return;
                const cb = box.querySelector('input[type="checkbox"]');
                if(cb){ cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')) }
            });
            box.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                if(e.target.checked){
                    box.classList.add('selected');
                    box.setAttribute('aria-selected','true');
                } else {
                    box.classList.remove('selected');
                    box.setAttribute('aria-selected','false');
                }
            });
            col.appendChild(box); 
            row.appendChild(col);
        });
    }

    function populateHotels(classId){
        const list = $('#hotelsList'); 
        const suggestions = document.getElementById('hotelSuggestions');
        // if no class selected, clear and hide suggestions
        if(!classId){
            if(list) list.innerHTML = '';
            if(suggestions) suggestions.classList.add('d-none');
            return;
        }
        if(suggestions) suggestions.classList.remove('d-none');
        list.innerHTML='';
        const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
        const currency = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('common.egp', currentLang) || 'ج.م') : 'ج.م';
        // create a row container to match attractions layout (bootstrap grid)
        const row = document.createElement('div');
        row.className = 'row g-3';
        (hotels[classId]||[]).forEach(h=>{
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-3';
            const item = document.createElement('div');
            item.className='hotel-item card-compact';
            item.dataset.hotelId=h.id; 
            item.dataset.price=h.price;
            const name = (h.name && typeof h.name === 'object') ? (h.name[currentLang] || h.name.ar) : (h.name || '');
            const imgSrc = h.img ? `assets/images/${h.img}` : 'assets/images/hotel-placeholder.png';
            // amenities icons mapping
            const amenityIcons = {
                wifi: 'fa-wifi',
                pool: 'fa-person-swimming',
                breakfast: 'fa-utensils',
                spa: 'fa-spa',
                parking: 'fa-car',
                food: 'fa-utensils'
            };
            const amenitiesHtml = (h.amenities||[]).map(a=>`<span class="amenity"><i class="fas ${amenityIcons[a]||'fa-check'}"></i><span class="d-none d-md-inline"> ${a}</span></span>`).join('');

            item.innerHTML = `
                <img src="${imgSrc}" alt="${name}" class="card-media">
                <div class="card-body-compact">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                        <div>
                            <div class="hotel-name">${name}</div>
                            <div class="hotel-meta text-muted" style="font-size:.9rem">${h.rooms.length} ${(window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.step2.roomTypes', currentLang) || 'نوع غرفة') : 'نوع غرفة'}</div>
                        </div>
                        <div class="hotel-price">${h.price} ${currency}</div>
                    </div>
                    <div class="amenities">${amenitiesHtml}</div>
                </div>
                <div class="room-selection d-none">
                    <label for="rooms_${h.id}">${(window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.step2.roomsLabel', currentLang) || 'عدد الغرف') : 'عدد الغرف'}</label>
                    <select id="rooms_${h.id}" class="form-select mt-1 mb-2">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <label for="roomtype_${h.id}">${(window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.step2.selectRoomType', currentLang) || 'اختر نوع الغرفة') : 'اختر نوع الغرفة'}</label>
                    <select id="roomtype_${h.id}" class="form-select mt-1">
                        ${(h.rooms||[]).map(r=>`<option value="${r.type}" data-price="${r.price}">${r.type} - ${r.price} ${currency}</option>`).join('')}
                    </select>
                </div>
                <div class="hotel-checkbox">
                    <i class="fas fa-check"></i>
                </div>
            `;
            item.addEventListener('click', ()=>{
                // deselect other hotel items inside the row
                row.querySelectorAll('.hotel-item').forEach(i => {
                    i.classList.remove('selected');
                    const rs = i.querySelector('.room-selection'); if(rs) rs.classList.add('d-none');
                    i.setAttribute('aria-selected', 'false');
                    const cb = i.querySelector('input[type="radio"][name="hotel_choice"]'); if(cb) cb.checked = false;
                });
                // mark current as selected
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
                const rs = item.querySelector('.room-selection'); if(rs) rs.classList.remove('d-none');
                // if a hidden radio doesn't exist, create and select it for accessibility/form handling
                let hiddenRadio = item.querySelector('input[type="radio"][name="hotel_choice"]');
                if(!hiddenRadio){
                    hiddenRadio = document.createElement('input');
                    hiddenRadio.type = 'radio'; hiddenRadio.name='hotel_choice'; hiddenRadio.className='d-none';
                    hiddenRadio.value = item.dataset.hotelId || ''; 
                    item.appendChild(hiddenRadio);
                }
                hiddenRadio.checked = true;
            });
            // prevent clicks on room selects from bubbling to card click
            const rsSelects = item.querySelectorAll('.room-selection select');
            rsSelects.forEach(s=>s.addEventListener('click', e=>e.stopPropagation()));
            // append hotel card inside the column and column into the row
            col.appendChild(item);
            row.appendChild(col);
        });
        // append the constructed row to the hotels list container
        list.appendChild(row);
    }

    function showError(element, message) {
        element.classList.add('is-invalid');
        let feedback = element.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            element.parentNode.insertBefore(feedback, element.nextElementSibling);
        }
        feedback.textContent = message;
    }

    function clearErrors() {
        $$('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
            const feedback = el.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.remove();
            }
        });
    }

    function validateStep1(){
        clearErrors();
        const gov = $('#governorate');
        const attractionsContainer = $('#attractionsContainer');
        const any = !!$$('input[name="attraction"]:checked').length;
    
        let isValid = true;
        const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
        const reqMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.required', currentLang) || 'هذا الحقل مطلوب') : 'هذا الحقل مطلوب';
        const selectDestMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.selectDestination', currentLang) || 'يرجى اختيار وجهة واحدة على الأقل') : 'يرجى اختيار وجهة واحدة على الأقل';

        if(!gov.value){ 
            showError(gov, reqMsg);
            isValid = false;
        }
        if(!any){ 
            attractionsContainer.classList.add('is-invalid');
            showError(attractionsContainer, selectDestMsg);
            isValid = false;
        }
        return isValid;
    }

    function validateStep2(){
        clearErrors();
        const startDate = $('#startDate');
        const endDate = $('#endDate');
        const peopleCount = $('#peopleCount');
        const hotelsList = $('#hotelsList');
    
        let isValid = true;
        const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
        const reqMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.required', currentLang) || 'هذا الحقل مطلوب') : 'هذا الحقل مطلوب';
        const endBeforeMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.endDateBeforeStart', currentLang) || 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية') : 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
        const minValTemplate = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.minValue', currentLang) || 'القيمة يجب أن تكون {min} على الأقل') : 'القيمة يجب أن تكون {min} على الأقل';
        const hotelSelectMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.step2.selectHotel', currentLang) || 'يرجى اختيار فندق') : 'يرجى اختيار فندق';

        if(!startDate.value){ 
            showError(startDate, reqMsg);
            isValid = false;
        }
        if(!endDate.value){ 
            showError(endDate, reqMsg);
            isValid = false;
        }
        if(new Date(endDate.value) <= new Date(startDate.value)){ 
            showError(endDate, endBeforeMsg);
            isValid = false;
        }
        if(Number(peopleCount.value) < 1){ 
            showError(peopleCount, minValTemplate.replace('{min}', '1'));
            isValid = false;
        }
        
        const hotelSelected = !!$('.hotel-item.selected');
        if(!hotelSelected){ 
            hotelsList.classList.add('is-invalid');
            showError(hotelsList, hotelSelectMsg);
            isValid = false;
        }
        return isValid;
    }

    function buildSummary(){
        const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
        const gov = $('#governorate').value;
        const govText = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation(`tripWizard.governorates.${gov}`, currentLang) || $('#governorate').selectedOptions[0].textContent) : $('#governorate').selectedOptions[0].textContent;
        const attractions = $$('input[name="attraction"]:checked').map(i=>i.closest('.attraction-item').querySelector('.attraction-title').textContent.trim());
        const selectedHotel = document.querySelector('.hotel-item.selected');
        const hotelText = selectedHotel ? selectedHotel.querySelector('.hotel-name').textContent : '';
        const start = $('#startDate').value; const end = $('#endDate').value; const people = $('#peopleCount').value;

        // price calc: attractions sum + (selected room price * rooms * nights)
        let attractionsPrice = $$('input[name="attraction"]:checked').reduce((sum,i)=>sum+Number(i.dataset.price),0);
        const nights = Math.max(1, Math.round((new Date(end)-new Date(start))/(1000*60*60*24)));
        let hotelPrice = 0;
        let roomsCount = 0;
        if(selectedHotel){
            const roomTypeSelect = selectedHotel.querySelector('select[id^="roomtype_"]');
            const roomsSelect = selectedHotel.querySelector('select[id^="rooms_"]');
            roomsCount = roomsSelect ? Number(roomsSelect.value) : 1;
            if(roomTypeSelect){ hotelPrice = Number(roomTypeSelect.selectedOptions[0].dataset.price || selectedHotel.dataset.price); }
        }
        const total = attractionsPrice + (hotelPrice * nights * roomsCount);

    const summary = document.getElementById('summaryCard');
    const currency = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('common.egp', currentLang) || 'ج.م') : 'ج.م';
        // format dates for display (fallback to raw values)
        const startDisplay = start || '-';
        const endDisplay = end || '-';
        const noAttractionsText = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.noAttractions', currentLang) || 'لم يتم اختيار معالم') : 'لم يتم اختيار معالم';
        const noHotelText = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.noHotel', currentLang) || 'لم يتم اختيار فندق') : 'لم يتم اختيار فندق';
        const labelGovernorate = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.governorate', currentLang) || 'المحافظة') : 'المحافظة';
        const labelAttractions = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.attractions', currentLang) || 'المعالم') : 'المعالم';
        const labelHotel = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.hotel', currentLang) || 'الفندق') : 'الفندق';
        const labelDates = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.dates', currentLang) || 'التواريخ') : 'التواريخ';
        const labelPeople = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.people', currentLang) || 'الافراد') : 'الافراد';
        const labelTotal = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.total', currentLang) || 'السعر الاجمالي') : 'السعر الاجمالي';

        summary.innerHTML = `
            <div class="summary-row"><div class="summary-label">${labelGovernorate}:</div><div class="summary-value">${govText}</div></div>
            <div class="summary-row"><div class="summary-label">${labelAttractions}:</div><div class="summary-value">${attractions.length ? attractions.join(', ') : noAttractionsText}</div></div>
            <div class="summary-row"><div class="summary-label">${labelHotel}:</div><div class="summary-value">${hotelText || noHotelText}</div></div>
            <div class="summary-row"><div class="summary-label">${labelDates}:</div><div class="summary-value">${startDisplay}   ${endDisplay} (${nights} ${window.languageSwitcher && window.languageSwitcher.getNestedTranslation ? (window.languageSwitcher.getNestedTranslation('tripWizard.summary.nights', currentLang) || 'ليالي') : 'ليالي'})</div></div>
            <div class="summary-row"><div class="summary-label">${labelPeople}:</div><div class="summary-value">${people}</div></div>
            <div class="summary-row"><div class="summary-total">${labelTotal}:</div><div class="summary-value"><span class="summary-total-badge">${total} ${currency}</span></div></div>
        `;
        // ensure container adapts to the newly inserted content (summary may change height)
        try{ window.requestAnimationFrame(adjustStepsContentHeight); }catch(e){}
    }

    // Event wiring
    document.addEventListener('DOMContentLoaded', ()=>{
        // wire selects
        $('#governorate').addEventListener('change', e=>{
            populateAttractions(e.target.value);
        });

        // create connector progress element once
        const stepContainer = document.querySelector('.step-indicators');
        if(stepContainer && !stepContainer.querySelector('.connector-progress')){
            const prog = document.createElement('span');
            prog.className = 'connector-progress';
            stepContainer.appendChild(prog);
        }

        $('#hotelClass').addEventListener('change', e=>{
            populateHotels(e.target.value);
        });

        // on initial load hide suggestions if no class selected
        try{
            const hc = $('#hotelClass');
            const hs = document.getElementById('hotelSuggestions');
            if(hc && (!hc.value || hc.value === '')){ if(hs) hs.classList.add('d-none'); }
            else if(hc && hc.value) { populateHotels(hc.value); }
        }catch(e){/* ignore */}

        $('#toStep2').addEventListener('click', ()=>{
            if(validateStep1()) showStep(2);
        });
        $('#backTo1').addEventListener('click', ()=>showStep(1));

        $('#toStep3').addEventListener('click', ()=>{
            if(validateStep2()) showStep(3);
        });
        $('#backTo2').addEventListener('click', ()=>showStep(2));

        $('#toStep4').addEventListener('click', ()=>{
            clearErrors();
            const nameEl = $('#fullName'); const emailEl = $('#email'); const phoneEl = $('#phone');
            const name = nameEl.value.trim(); const email = emailEl.value.trim(); const phone = phoneEl.value.trim();
            let ok = true;
            const currentLang = (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
            const reqMsg = (window.languageSwitcher && window.languageSwitcher.getNestedTranslation) ? (window.languageSwitcher.getNestedTranslation('validation.required', currentLang) || 'هذا الحقل مطلوب') : 'هذا الحقل مطلوب';
            if(!name){ showError(nameEl, reqMsg); ok=false }
            if(!email){ showError(emailEl, reqMsg); ok=false }
            if(!phone){ showError(phoneEl, reqMsg); ok=false }
            if(!ok) return;
            buildSummary(); showStep(4);
            updateConnectorProgress(4);
        });
        $('#backTo3').addEventListener('click', ()=>showStep(3));

        $('#tripWizardForm').addEventListener('submit', e=>{
            e.preventDefault();
            // show success banner above the form
            const banner = document.getElementById('bookingSuccess');
            if(banner){
                banner.classList.add('show');
                // briefly animate check (already present in svg)
            }
            // reset form and selections after a short delay, then go to step 1
            setTimeout(()=>{
                // clear selections
                $$('#attractionsList input[type="checkbox"]').forEach(cb=>{cb.checked=false; cb.closest('.attraction-item') && cb.closest('.attraction-item').classList.remove('selected')});
                $$('#hotelsList .hotel-item').forEach(h=>{h.classList.remove('selected'); const rs=h.querySelector('.room-selection'); if(rs) rs.classList.add('d-none')});
                // reset the whole form
                $('#tripWizardForm').reset();
                // clear attractions container so they don't show until user selects governorate again
                const attractionsContainer = document.getElementById('attractionsList'); if(attractionsContainer) attractionsContainer.innerHTML = '';
                // hide hotel suggestions as no class is selected after reset
                const hotelSuggestions = document.getElementById('hotelSuggestions'); if(hotelSuggestions) hotelSuggestions.classList.add('d-none');
                // hide banner after showing for a while
                setTimeout(()=> banner.classList.remove('show'), 3500);
                showStep(1);
                updateConnectorProgress(1);
                const wizard = document.getElementById('trip-wizard'); if(wizard) wizard.scrollIntoView({behavior:'smooth',block:'start'});
            }, 800);
        });

        // initialize default step
        showStep(1);
        updateConnectorProgress(1);
        // make sure container fits the initial step
        adjustStepsContentHeight();

        // recompute on window resize
        window.addEventListener('resize', ()=>{
            // debounce-ish: use rAF to avoid layout thrash
            window.requestAnimationFrame(adjustStepsContentHeight);
        });

        // observe dynamic changes in the steps-content (e.g., attractions/hotels populate)
        const stepsContent = document.querySelector('.steps-content');
        if(stepsContent){
            const mo = new MutationObserver(() => {
                adjustStepsContentHeight();
            });
            mo.observe(stepsContent, { childList: true, subtree: true, characterData: true });
        }

        // Re-render dynamic parts when site language changes
        document.addEventListener('languageChanged', (e)=>{
            try{
                const lang = (e && e.detail && e.detail.lang) || (window.languageSwitcher && window.languageSwitcher.getCurrentLanguage && window.languageSwitcher.getCurrentLanguage()) || 'ar';
                // re-populate attractions for current governorate
                const currentGov = $('#governorate').value; if(currentGov) populateAttractions(currentGov);
                // re-populate hotels for selected class
                const hClass = $('#hotelClass').value; if(hClass) populateHotels(hClass);
                // rebuild summary if on summary step or if data present
                buildSummary();
            }catch(err){/* ignore */}
        });


        // add a mutation/interaction handler to pop-check animation on selection
        document.addEventListener('change', (ev)=>{
            const target = ev.target;
            if(!target) return;
            // attraction checkbox change
            if(target.matches('input[name="attraction"]')){
                const card = target.closest('.attraction-item');
                if(card){
                    const checkboxIcon = card.querySelector('.attraction-checkbox');
                    if(checkboxIcon){
                        checkboxIcon.classList.add('checked-pop');
                        setTimeout(()=> checkboxIcon.classList.remove('checked-pop'), 420);
                    }
                }
            }
            // hotel selection handled via hidden radio we create; animate hotel's check
            if(target.matches('input[name="hotel_choice"]')){
                const el = document.querySelector(`.hotel-item[data-hotel-id="${target.value}"]`);
                if(el){
                    const icon = el.querySelector('.hotel-checkbox');
                    if(icon){ icon.classList.add('checked-pop'); setTimeout(()=> icon.classList.remove('checked-pop'),420); }
                }
            }
        });
    });

})();

