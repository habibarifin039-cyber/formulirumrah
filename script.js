// Form Management System
class UmrohRegistrationForm {
    constructor() {
        this.formData = {};
        this.registrationCounter = this.getRegistrationCounter();
        this.init();
    }

    init() {
        this.generateRegistrationId();
        this.setRegistrationDate();
        this.bindEvents();
        this.setupValidation();
        this.setupConditionalFields();
    }

    generateRegistrationId() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const counter = this.registrationCounter.toString().padStart(4, '0');
        
        const registrationId = `UM${year}${month}${day}${counter}`;
        document.getElementById('registrationId').value = registrationId;
        
        // Increment counter for next registration
        this.incrementRegistrationCounter();
    }

    getRegistrationCounter() {
        const stored = localStorage.getItem('umrohRegistrationCounter');
        return stored ? parseInt(stored) : 1;
    }

    incrementRegistrationCounter() {
        const newCounter = this.registrationCounter + 1;
        localStorage.setItem('umrohRegistrationCounter', newCounter.toString());
    }

    setRegistrationDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('tanggalPendaftaran').value = today;
    }

    setupConditionalFields() {
        // Penyakit khusus conditional field
        const penyakitKhusus = document.getElementById('penyakitKhusus');
        const penyakitDetail = document.getElementById('penyakitKhususDetail');
        
        penyakitKhusus.addEventListener('change', () => {
            if (penyakitKhusus.checked) {
                penyakitDetail.style.display = 'block';
                document.getElementById('detailPenyakit').required = true;
            } else {
                penyakitDetail.style.display = 'none';
                document.getElementById('detailPenyakit').required = false;
                document.getElementById('detailPenyakit').value = '';
            }
        });

        // Penanganan khusus conditional field
        const penangananKhusus = document.getElementById('penangananKhusus');
        const penangananDetail = document.getElementById('penangananKhususDetail');
        
        penangananKhusus.addEventListener('change', () => {
            if (penangananKhusus.checked) {
                penangananDetail.style.display = 'block';
                document.getElementById('detailPenanganan').required = true;
            } else {
                penangananDetail.style.display = 'none';
                document.getElementById('detailPenanganan').required = false;
                document.getElementById('detailPenanganan').value = '';
            }
        });
    }

    bindEvents() {
        // Form submission
        document.getElementById('umrohForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Modal close
        document.querySelector('.btn-close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('successModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous error state
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Field ini wajib diisi';
        }

        // Specific field validations
        switch (fieldName) {
            case 'nik':
                if (value && !this.isValidNIK(value)) {
                    isValid = false;
                    errorMessage = 'NIK harus 16 digit angka';
                }
                break;

            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Format email tidak valid';
                }
                break;

            case 'telepon':
            case 'teleponKontak':
            case 'whatsapp':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Format nomor telepon tidak valid';
                }
                break;

            case 'kodePos':
                if (value && !this.isValidPostalCode(value)) {
                    isValid = false;
                    errorMessage = 'Kode pos harus 5 digit angka';
                }
                break;

            case 'tanggalLahir':
                if (value && !this.isValidBirthDate(value)) {
                    isValid = false;
                    errorMessage = 'Usia minimal 18 tahun';
                }
                break;

            case 'tanggalBerakhir':
                if (value && !this.isValidPassportExpiry(value)) {
                    isValid = false;
                    errorMessage = 'Paspor harus berlaku minimal 6 bulan';
                }
                break;
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        }

        return isValid;
    }

    isValidNIK(nik) {
        const nikRegex = /^[0-9]{16}$/;
        return nikRegex.test(nik);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        const cleanPhone = phone.replace(/[\s-]/g, '');
        return phoneRegex.test(cleanPhone);
    }

    isValidPostalCode(code) {
        const postalRegex = /^[0-9]{5}$/;
        return postalRegex.test(code);
    }

    isValidBirthDate(date) {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18;
    }

    isValidPassportExpiry(date) {
        const expiryDate = new Date(date);
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);
        
        return expiryDate > sixMonthsFromNow;
    }

    showError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    validateForm() {
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;

        // Validate all required fields
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    getGenderLabel(gender) {
        const labels = {
            'L': 'Laki-laki',
            'P': 'Perempuan'
        };
        return labels[gender] || gender;
    }

    getPackageInfo(packageType) {
        const packages = {
            'hemat-jabodetabek': { name: 'Umrah Hemat Zona Jabodetabek' },
            'hemat-ntb': { name: 'Umrah Hemat Zona NTB' }
        };
        return packages[packageType] || { name: '-' };
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('id-ID', options);
    }

    submitForm() {
        // Validate entire form
        if (!this.validateForm()) {
            return;
        }

        // Validate agreement checkbox
        const agreement = document.getElementById('agreement');
        if (!agreement.checked) {
            this.showNotification('Anda harus menyetujui syarat dan ketentuan', 'error');
            return;
        }

        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Memproses...';

        // Collect all form data
        const formData = new FormData(document.getElementById('umrohForm'));
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Convert form field names to database column names and handle special cases
            switch (key) {
                case 'namaLengkap':
                    data['full_name'] = value;
                    break;
                case 'jenisKelamin':
                    data['gender'] = value; // This will be 'L' or 'P' from the select options
                    break;
                case 'tempatLahir':
                    data['birth_place'] = value;
                    break;
                case 'tanggalLahir':
                    data['birth_date'] = value;
                    break;
                case 'namaAyah':
                    data['father_name'] = value;
                    break;
                case 'namaIbu':
                    data['mother_name'] = value;
                    break;
                case 'alamat':
                    data['address'] = value;
                    break;
                case 'kota':
                    data['city'] = value;
                    break;
                case 'provinsi':
                    data['province'] = value;
                    break;
                case 'kodePos':
                    data['postal_code'] = value;
                    break;
                case 'pekerjaan':
                    data['occupation'] = value;
                    break;
                case 'penyakitKhusus':
                    data['has_special_illness'] = value === 'on';
                    break;
                case 'detailPenyakit':
                    data['illness_details'] = value;
                    break;
                case 'penangananKhusus':
                    data['needs_special_care'] = value === 'on';
                    break;
                case 'detailPenanganan':
                    data['special_care_details'] = value;
                    break;
                case 'kursiRoda':
                    data['needs_wheelchair'] = value === 'on';
                    break;
                case 'nik':
                    data['nik'] = value;
                    break;
                case 'nomorPaspor':
                    data['passport_number'] = value;
                    break;
                case 'tanggalTerbit':
                    data['passport_issue_date'] = value;
                    break;
                case 'tanggalBerakhir':
                    data['passport_expiry_date'] = value;
                    break;
                case 'tempatTerbit':
                    data['passport_issue_place'] = value;
                    break;
                case 'telepon':
                    data['phone'] = value;
                    break;
                case 'whatsapp':
                    data['whatsapp'] = value;
                    break;
                case 'email':
                    data['email'] = value;
                    break;
                case 'pernahUmrah':
                    data['has_umrah_experience'] = value === 'on';
                    break;
                case 'pernahHaji':
                    data['has_hajj_experience'] = value === 'on';
                    break;
                case 'namaKontak':
                    data['emergency_contact_name'] = value;
                    break;
                case 'hubunganKontak':
                    data['emergency_contact_relation'] = value;
                    break;
                case 'teleponKontak':
                    data['emergency_contact_phone'] = value;
                    break;
                case 'statusPernikahan':
                    data['marital_status'] = value;
                    break;
                case 'paketDipilih':
                    data['selected_package'] = value;
                    break;
                case 'metodePembayaran':
                    data['payment_method'] = value;
                    break;
                case 'tanggalPendaftaran':
                    data['registration_date'] = value;
                    break;
                case 'registrationId':
                    data['registration_id'] = value;
                    break;
                // Skip agreement checkbox and other non-database fields
                case 'agreement':
                    break;
                default:
                    // For any unmapped fields, use the original key
                    data[key] = value;
                    break;
            }
        }

        // Submit to Supabase
        this.submitToSupabase(data, submitBtn);
    }

    async submitToSupabase(data, submitBtn) {
        try {
            // Import Supabase functions
            const { submitRegistration } = await import('./src/lib/supabase.ts');
            
            const result = await submitRegistration(data);
            
            if (result.success) {
                this.handleSubmissionSuccess(data, result.data);
            } else {
                this.showNotification(result.error || 'Terjadi kesalahan saat menyimpan data', 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            this.showNotification('Terjadi kesalahan saat menghubungi server', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Daftar Umroh';
        }
    }

    handleSubmissionSuccess(data, dbResult) {
        // Generate registration number
        const registrationNumber = dbResult?.registration_id || data.registration_id;
        
        // Show success modal
        document.getElementById('registrationNumber').textContent = registrationNumber;
        document.getElementById('confirmEmail').textContent = data.email || 'Tidak ada email';
        
        const modal = document.getElementById('successModal');
        modal.classList.add('show');

        // Log data (in production, this would be sent to server)
        console.log('Registration Data:', {
            ...data,
            registrationNumber,
            submittedAt: dbResult?.created_at || new Date().toISOString()
        });

        // Show success notification
        this.showNotification('Pendaftaran berhasil disimpan!', 'success');
    }

    generateRegistrationNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `UM${year}${month}${random}`;
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
        
        // Reset form after successful submission
        setTimeout(() => {
            this.resetForm();
        }, 300);
    }

    resetForm() {
        document.getElementById('umrohForm').reset();
        
        // Clear package selection
        document.getElementById('paketDipilih').value = '';
        
        // Reset conditional fields
        document.getElementById('penyakitKhusus').checked = false;
        document.getElementById('penangananKhusus').checked = false;
        document.getElementById('kursiRoda').checked = false;
        document.getElementById('pernahUmrah').checked = false;
        document.getElementById('pernahHaji').checked = false;
        document.getElementById('penyakitKhususDetail').style.display = 'none';
        document.getElementById('penangananKhususDetail').style.display = 'none';
        document.getElementById('detailPenyakit').value = '';
        document.getElementById('detailPenanganan').value = '';
        
        // Clear all errors
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // Generate new registration ID
        this.generateRegistrationId();
        this.setRegistrationDate();
        
        // Scroll to top
        document.querySelector('.form-header').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            box-shadow: var(--shadow-lg);
            animation: slideInRight 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'var(--success-500)';
                break;
            case 'warning':
                notification.style.background = 'var(--warning-500)';
                break;
            case 'error':
                notification.style.background = 'var(--error-500)';
                break;
            default:
                notification.style.background = 'var(--primary-500)';
        }

        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    setupValidation() {
        // Add CSS for notification animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Form Enhancement Features
class FormEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupDateConstraints();
        this.setupInputFormatting();
        this.setupKeyboardNavigation();
    }

    setupDateConstraints() {
        // Set minimum birth date (18 years ago)
        const birthDateInput = document.getElementById('tanggalLahir');
        if (birthDateInput) {
            const today = new Date();
            const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
            
            birthDateInput.max = maxDate.toISOString().split('T')[0];
            birthDateInput.min = minDate.toISOString().split('T')[0];
        }

        // Set constraints for passport dates
        const tanggalTerbit = document.getElementById('tanggalTerbit');
        const tanggalBerakhir = document.getElementById('tanggalBerakhir');
        
        if (tanggalTerbit && tanggalBerakhir) {
            const today = new Date().toISOString().split('T')[0];
            const maxFutureDate = new Date();
            maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 20);
            
            tanggalTerbit.max = today;
            tanggalBerakhir.min = today;
            tanggalBerakhir.max = maxFutureDate.toISOString().split('T')[0];
        }
    }

    setupInputFormatting() {
        // Phone number formatting
        const phoneInputs = document.querySelectorAll('#telepon, #teleponKontak, #whatsapp');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                // Limit to reasonable phone number length
                if (value.length > 15) {
                    value = value.slice(0, 15);
                }
                
                e.target.value = value;
            });
        });

        // NIK formatting
        const nikInput = document.getElementById('nik');
        if (nikInput) {
            nikInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) {
                    value = value.slice(0, 16);
                }
                e.target.value = value;
            });
        }

        // Postal code formatting
        const postalInput = document.getElementById('kodePos');
        if (postalInput) {
            postalInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.slice(0, 5);
                }
                e.target.value = value;
            });
        }

        // Passport number formatting (uppercase)
        const passportInput = document.getElementById('nomorPaspor');
        if (passportInput) {
            passportInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }

        // Name formatting (title case)
        const nameInputs = document.querySelectorAll('#namaLengkap, #namaKontak, #namaAyah, #namaIbu, #tempatLahir, #kota, #provinsi, #tempatTerbit');
        nameInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                e.target.value = this.toTitleCase(e.target.value);
            });
        });
    }

    toTitleCase(str) {
        return str.toLowerCase().replace(/\b\w+/g, (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        });
    }

    setupKeyboardNavigation() {
        // Enable Enter key for next step
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                const activeElement = document.activeElement;
                
                // Don't trigger for textarea or when submitting
                if (activeElement.tagName === 'TEXTAREA' || activeElement.type === 'submit') {
                    return;
                }
                
                e.preventDefault();
                
                // Submit form with Ctrl+Enter
                const submitBtn = document.querySelector('.btn-submit');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        });
    }
}

// Analytics and Tracking
class FormAnalytics {
    constructor() {
        this.startTime = Date.now();
        // Track form completion time
        document.getElementById('umrohForm').addEventListener('submit', () => {
            const totalTime = Date.now() - this.startTime;
            console.log(`Form completed in ${totalTime}ms`);
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main form functionality
    const form = new UmrohRegistrationForm();
    
    // Initialize form enhancements
    const enhancements = new FormEnhancements();
    
    // Initialize analytics (optional)
    const analytics = new FormAnalytics();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation for form initialization
    document.body.classList.add('loaded');
    
    // Progressive enhancement: Add advanced features only if JavaScript is enabled
    document.documentElement.classList.add('js-enabled');
});

// Utility Functions
const utils = {
    // Format currency for display
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Validate Indonesian phone number
    isValidIndonesianPhone: (phone) => {
        const cleaned = phone.replace(/[\s-]/g, '');
        const indonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
        return indonesianPhoneRegex.test(cleaned);
    },

    // Format phone number for display
    formatPhoneNumber: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length >= 10) {
            return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        return phone;
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UmrohRegistrationForm,
        FormEnhancements,
        FormAnalytics,
        utils
    };
}