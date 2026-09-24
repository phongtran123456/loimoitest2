// Biến đếm số lần bấm nút "Từ chối"
let noButtonClickCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  setupMinDateTime();
  setupPhongOptionHandler();
});

// 1. TỰ ĐỘNG KHÓA NGÀY TỐI THIỂU LÀ NGÀY HIỆN TẠI
function setupMinDateTime() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;
  
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const minDate = `${year}-${month}-${day}`;
  dateInput.min = minDate;
  dateInput.value = minDate;
}

// 2. TÍNH NĂNG TROLL 5S DÀNH CHO NÚT "PHONG TỰ CHỌN ĐI"
function setupPhongOptionHandler() {
  const phongInput = document.getElementById('input-phong-option');
  const phongSpan = document.getElementById('span-phong-option');

  if (!phongInput || !phongSpan) return;

  phongInput.addEventListener('change', () => {
    if (phongInput.checked) {
      // Khi bấm chọn: hiện câu chọc ghẹo ngay lập tức
      phongSpan.innerText = "Để chơi cho vui mà cũng chọn hả 😜";
      phongInput.value = "Thi sẽ tự chọn 😜";

      // Đợi đúng 5 giây (5000ms) đổi thành câu chốt
      setTimeout(() => {
        if (phongInput.checked) {
          phongSpan.innerText = "Thi sẽ tự chọn 🥰";
          phongInput.value = "Thi sẽ tự chọn 🥰";
        }
      }, 5000);
    } else {
      // Khi bỏ chọn: trả lại tên ban đầu
      phongSpan.innerText = "Phong tự chọn đi 🎲";
      phongInput.value = "Phong tự chọn đi 🎲";
    }
  });
}

// 3. XỬ LÝ CHUỖI SỰ KIỆN 3 LẦN BẤM NÚT "TỪ CHỐI"
function handleNoButtonClick() {
  const btnNo = document.getElementById('btn-no');
  if (!btnNo) return;

  noButtonClickCount++;

  if (noButtonClickCount === 1) {
    // Lần 1: Đổi chữ, khung vẫn xám
    btnNo.innerText = "Sai roài chọn lại đuy";
  } 
  else if (noButtonClickCount === 2) {
    // Lần 2: Đổi chữ, khung vẫn xám
    btnNo.innerText = "Tui bảo chọn lại mà tr ?? Trẻ hư hả ?";
  } 
  else if (noButtonClickCount === 3) {
    // Lần 3: Đổi chữ + Biến thành màu đỏ hồng + Tạo hiệu ứng rung
    btnNo.innerText = "PHẢI CÓ, tưởng mình được chọn hả 😾";
    btnNo.classList.remove('btn-secondary');
    btnNo.classList.add('btn-converted');
  } 
  else {
    // Lần 4 trở đi: Chuyển sang Bước 2
    goToStep(2);
  }
}

// 4. CHUYỂN BƯỚC
function goToStep(stepNumber) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');
}

// 5. KIỂM TRA & XỬ LÝ LỊCH HẸN
function handleFormSubmit(event) {
  event.preventDefault();

  const errorMsg = document.getElementById('error-msg');
  errorMsg.innerText = '';

  const dateVal = document.getElementById('date').value;
  const timeVal = document.getElementById('time').value;
  const otherVal = document.getElementById('other-activity').value.trim();

  const selectedCheckboxes = document.querySelectorAll('input[name="activity"]:checked');
  let activities = Array.from(selectedCheckboxes).map(cb => cb.value);

  if (otherVal !== '') {
    activities.push(otherVal);
  }

  if (activities.length === 0) {
    errorMsg.innerText = 'Hong thèm chọn hoạt động luôn hả tr, bộ tính ra nhìn mặt nhao thôi hả ?? 😒';
    return;
  }

  const now = new Date();
  const selectedDateTime = new Date(`${dateVal}T${timeVal}`);

  if (isNaN(selectedDateTime.getTime())) {
    errorMsg.innerText = 'Vui lòng chọn thời gian hợp lệ!';
    return;
  }

  if (selectedDateTime < now) {
    errorMsg.innerText = 'Cô bé này tính hẹn nhau ở quá khứ hay gì zậy ta ?';
    return;
  }

  const formattedDate = selectedDateTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  document.getElementById('res-date').innerText = formattedDate;
  document.getElementById('res-time').innerText = timeVal;
  document.getElementById('res-activity').innerText = activities.join(', ');

  goToStep(3);
}
