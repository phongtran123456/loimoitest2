// Chuyển đổi giữa các bước
function goToStep(stepNumber) {
  document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');
}

// Tạo hiệu ứng nút "Từ chối" bỏ chạy khi di chuột vào
function moveNoButton() {
  const btnNo = document.getElementById('btn-no');
  const x = Math.random() * (window.innerWidth - 150) - (window.innerWidth / 2 - 100);
  const y = Math.random() * (window.innerHeight - 100) - (window.innerHeight / 2 - 50);
  
  btnNo.style.position = 'absolute';
  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
}

// Xử lý gửi form
function handleFormSubmit(event) {
  event.preventDefault();

  const dateVal = document.getElementById('date').value;
  const timeVal = document.getElementById('time').value;
  const activityVal = document.getElementById('activity').value;

  // Định dạng lại ngày dd/mm/yyyy
  const formattedDate = new Date(dateVal).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById('res-date').innerText = formattedDate;
  document.getElementById('res-time').innerText = timeVal;
  document.getElementById('res-activity').innerText = activityVal;

  goToStep(3);
}
