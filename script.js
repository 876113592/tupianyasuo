document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const compressionSection = document.querySelector('.compression-section');

    let originalImage = null;

    // 修改文件输入框处理
    imageInput.removeAttribute('hidden');

    // 拖拽上传
    uploadArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#007AFF';
        uploadArea.style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#DEDEDE';
        uploadArea.style.backgroundColor = 'white';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = '#DEDEDE';
        uploadArea.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                handleImageUpload(file);
            }
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            handleImageUpload(file);
        }
    });

    // 验证文件函数
    function validateFile(file) {
        // 检查文件类型
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('请上传 PNG 或 JPG 格式的图片！');
            return false;
        }

        // 检查文件大小（10MB）
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('文件大小不能超过 10MB！');
            return false;
        }

        return true;
    }

    // 压缩图片函数
    function compressImage(image, quality) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // 确定输出格式
        let format = 'image/jpeg';
        let extension = 'jpg';
        
        // 检查原始图片格式
        if (originalImage.src.includes('data:image/png') || 
            (imageInput.files[0] && imageInput.files[0].type === 'image/png')) {
            format = 'image/png';
            extension = 'png';
        }

        const compressedDataUrl = canvas.toDataURL(format, quality);
        document.getElementById('compressedImage').src = compressedDataUrl;

        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);

        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `compressed_image.${extension}`;
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = () => {
                document.getElementById('originalImage').src = e.target.result;
                document.getElementById('originalSize').textContent = formatFileSize(file.size);
                compressImage(originalImage, qualitySlider.value / 100);
                compressionSection.style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 