document.addEventListener('DOMContentLoaded', () => {
  setupMinDateTime();
  setupRunawayButton();
});

// 1. TỰ ĐỘNG THIẾT LẬP NGÀY TỐI THIỂU LÀ NGÀY HIỆN TẠI
function setupMinDateTime() {
  const dateInput = document.getElementById('date');
  const today = new Date();
  
  // Lấy chuỗi YYYY-MM-DD theo giờ địa phương
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const minDate = `${year}-${month}-${day}`;
  dateInput.min = minDate;
  dateInput.value = minDate; // Default là hôm nay
}

// 2. XỬ LÝ NÚT "TỪ CHỐI" BỎ CHẠY AN TOÀN (KHÔNG TRÀN MÀN HÌNH & AN TOÀN TRÊN ĐIỆN THOẠI)
function setupRunawayButton() {
  const btnNo = document.getElementById('btn-no');
  const container = document.querySelector('.card.active');

  function moveButton(e) {
    if (e) {
      e.preventDefault(); // Ngăn chặn sự kiện click ăn vào nút khác trên điện thoại
      e.stopPropagation();
    }

    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Giới hạn phạm vi di chuyển chỉ trong lòng thẻ Card
    const padding = 20;
    const maxX = containerRect.width - btnRect.width - padding;
    const maxY = containerRect.height - btnRect.height - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
  }

  // Bắt sự kiện rê chuột (Máy tính) và Chạm màn hình (Điện thoại)
  btnNo.addEventListener('mouseover', moveButton);
  btnNo.addEventListener('touchstart', moveButton, { passive: false });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveButton(e);
  });
}

// 3. CHUYỂN BƯỚC
function goToStep(stepNumber) {
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');
}

// 4. XỬ LÝ KIỂM TRA & GỬI FORM LỊCH HẸN
function handleFormSubmit(event) {
  event.preventDefault();

  const errorMsg = document.getElementById('error-msg');
  errorMsg.innerText = '';

  const dateVal = document.getElementById('date').value;
  const timeVal = document.getElementById('time').value;
  const otherVal = document.getElementById('other-activity').value.trim();

  // Lấy danh sách các checkbox đã chọn
  const selectedCheckboxes = document.querySelectorAll('input[name="activity"]:checked');
  let activities = Array.from(selectedCheckboxes).map(cb => cb.value);

  if (otherVal !== '') {
    activities.push(otherVal);
  }

  // Kiểm tra nếu chưa chọn hoạt động nào
  if (activities.length === 0) {
    errorMsg.innerText = 'Thi chọn ít nhất 1 hoạt động hoặc tự nhập thêm nha! 😊';
    return;
  }

  // XÁC THỰC THỜI GIAN THỰC
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

  // ĐỊNH DẠNG NGÀY THÁNG VIỆT NAM
  const formattedDate = selectedDateTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // ĐIỀN DỮ LIỆU SANG BƯỚC 3
  document.getElementById('res-date').innerText = formattedDate;
  document.getElementById('res-time').innerText = timeVal;
  document.getElementById('res-activity').innerText = activities.join(', ');

  goToStep(3);
}
