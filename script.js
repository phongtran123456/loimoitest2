document.addEventListener('DOMContentLoaded', () => {
  setupMinDateTime();
  setupRunawayButton();
});

// 1. TỰ ĐỘNG THIẾT LẬP NGÀY TỐI THIỂU LÀ NGÀY HIỆN TẠI
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

// 2. THUẬT TOÁN BỎ CHẠY AN TOÀN TRONG NỘI BỘ THẺ CARD
function setupRunawayButton() {
  const btnNo = document.getElementById('btn-no');
  const card = document.getElementById('step-1');

  if (!btnNo || !card) return;

  function moveButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Lấy kích thước thẻ Card trắng
    const cardWidth = card.clientWidth;
    const cardHeight = card.clientHeight;

    // Lấy kích thước nút
    const btnWidth = btnNo.offsetWidth || 130;
    const btnHeight = btnNo.offsetHeight || 44;

    // Vùng đệm cách mép thẻ Card
    const padding = 16;

    // Tính khoảng tọa độ tối đa cho phép
    const maxX = cardWidth - btnWidth - padding;
    const maxY = cardHeight - btnHeight - padding;

    // Tính vị trí ngẫu nhiên
    const randomX = Math.max(padding, Math.floor(Math.random() * (maxX - padding + 1)) + padding);
    const randomY = Math.max(padding, Math.floor(Math.random() * (maxY - padding + 1)) + padding);

    // Gán vị trí mới tính theo khung #step-1
    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    btnNo.style.right = 'auto'; // Hủy vị trí right ban đầu
  }

  // Bắt sự kiện trên máy tính (mouseover) và điện thoại (touchstart, click)
  btnNo.addEventListener('mouseover', moveButton);
  btnNo.addEventListener('touchstart', moveButton, { passive: false });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton(e);
  });
}

// 3. CHUYỂN BƯỚC
function goToStep(stepNumber) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');
}

// 4. KIỂM TRA VÀ XỬ LÝ LỊCH HẸN
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
    errorMsg.innerText = 'Thi chọn ít nhất 1 hoạt động hoặc tự nhập thêm nha! 😊';
    return;
  }

  const now = new Date();
  const selectedDateTime = new Date(`${dateVal}T${timeVal}`);

  if (isNaN(selectedDateTime.getTime())) {
    errorMsg.innerText = 'Vui lòng chọn thời gian hợp lệ!';
    return;
  }

  if (selectedDateTime < now) {
    errorMsg.innerText = 'Thi ơi, không thể du hành về quá khứ chọn giờ đã qua được nè! 😁';
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
